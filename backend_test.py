#!/usr/bin/env python3
"""
Backend API Testing for Node.js Express Server
Tests all endpoints after conversion from Python FastAPI to Node.js Express
"""

import requests
import json
import sys
from typing import Dict, Any, Optional

# Configuration
BASE_URL = "https://apixel-admin-hub.preview.emergentagent.com/api"
ADMIN_EMAIL = "admin@agency.com"
ADMIN_PASSWORD = "Admin@123"

class APITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.token = None
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, details: str = ""):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details
        })
        print(f"{status}: {test_name}")
        if details:
            print(f"   Details: {details}")
        print()
    
    def make_request(self, method: str, endpoint: str, data: Dict = None, headers: Dict = None) -> tuple:
        """Make HTTP request and return (success, response_data, status_code)"""
        url = f"{self.base_url}{endpoint}"
        
        # Default headers
        default_headers = {"Content-Type": "application/json"}
        if headers:
            default_headers.update(headers)
            
        try:
            if method.upper() == "GET":
                response = requests.get(url, headers=default_headers, timeout=30)
            elif method.upper() == "POST":
                response = requests.post(url, json=data, headers=default_headers, timeout=30)
            elif method.upper() == "PUT":
                response = requests.put(url, json=data, headers=default_headers, timeout=30)
            elif method.upper() == "DELETE":
                response = requests.delete(url, headers=default_headers, timeout=30)
            else:
                return False, {"error": f"Unsupported method: {method}"}, 0
                
            try:
                response_data = response.json()
            except:
                response_data = {"text": response.text}
                
            return response.status_code < 400, response_data, response.status_code
            
        except Exception as e:
            return False, {"error": str(e)}, 0
    
    def authenticate(self) -> bool:
        """Authenticate and get access token"""
        print("🔐 Testing Authentication...")
        
        # Test with correct credentials
        success, data, status = self.make_request("POST", "/auth/login", {
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        
        if success and "access_token" in data:
            self.token = data["access_token"]
            self.log_test("Auth: Login with correct credentials", True, f"Got access token: {self.token[:20]}...")
            
            # Test with wrong credentials
            success_wrong, data_wrong, status_wrong = self.make_request("POST", "/auth/login", {
                "email": ADMIN_EMAIL,
                "password": "wrongpassword"
            })
            
            if not success_wrong and status_wrong == 401:
                self.log_test("Auth: Login with wrong credentials returns 401", True, "Correctly rejected wrong password")
            else:
                self.log_test("Auth: Login with wrong credentials returns 401", False, f"Expected 401, got {status_wrong}")
                
            return True
        else:
            self.log_test("Auth: Login with correct credentials", False, f"Status: {status}, Data: {data}")
            return False
    
    def get_auth_headers(self) -> Dict:
        """Get authorization headers"""
        return {"Authorization": f"Bearer {self.token}"}
    
    def test_experts_crud(self):
        """Test Experts CRUD operations"""
        print("👥 Testing Experts CRUD...")
        
        # 1. GET /api/experts (no auth) - should return 4 seeded experts sorted by order asc
        success, data, status = self.make_request("GET", "/experts")
        if success and isinstance(data, list) and len(data) == 4:
            # Check if sorted by order ascending
            orders = [expert.get("order", 0) for expert in data]
            is_sorted = orders == sorted(orders)
            self.log_test("GET /api/experts (public) returns 4 experts sorted by order", is_sorted, 
                         f"Found {len(data)} experts with orders: {orders}")
        else:
            self.log_test("GET /api/experts (public) returns 4 experts sorted by order", False, 
                         f"Status: {status}, Data length: {len(data) if isinstance(data, list) else 'not list'}")
        
        # 2. GET /api/experts?published_only=false (with auth) - should return all
        success, data, status = self.make_request("GET", "/experts?published_only=false", headers=self.get_auth_headers())
        if success and isinstance(data, list):
            self.log_test("GET /api/experts?published_only=false (auth) returns all experts", True, 
                         f"Found {len(data)} total experts")
        else:
            self.log_test("GET /api/experts?published_only=false (auth) returns all experts", False, 
                         f"Status: {status}, Data: {data}")
        
        # 3. POST /api/experts (auth) - create new expert
        test_expert = {
            "name": "Test QA Engineer",
            "role": "QA Engineer", 
            "image": "https://example.com/test.jpg",
            "order": 5,
            "published": True
        }
        
        success, data, status = self.make_request("POST", "/experts", test_expert, self.get_auth_headers())
        created_expert_id = None
        if success and "id" in data and "createdAt" in data:
            created_expert_id = data["id"]
            self.log_test("POST /api/experts (auth) creates expert", True, 
                         f"Created expert with ID: {created_expert_id}")
        else:
            self.log_test("POST /api/experts (auth) creates expert", False, 
                         f"Status: {status}, Data: {data}")
        
        # 4. PUT /api/experts/{id} (auth) - update expert
        if created_expert_id:
            update_data = {"role": "Senior QA Engineer"}
            success, data, status = self.make_request("PUT", f"/experts/{created_expert_id}", 
                                                    update_data, self.get_auth_headers())
            if success and data.get("role") == "Senior QA Engineer":
                self.log_test("PUT /api/experts/{id} (auth) updates expert", True, 
                             f"Updated role to: {data.get('role')}")
            else:
                self.log_test("PUT /api/experts/{id} (auth) updates expert", False, 
                             f"Status: {status}, Data: {data}")
        
        # 5. DELETE /api/experts/{id} (auth) - delete expert
        if created_expert_id:
            success, data, status = self.make_request("DELETE", f"/experts/{created_expert_id}", 
                                                    headers=self.get_auth_headers())
            if success and "message" in data:
                self.log_test("DELETE /api/experts/{id} (auth) deletes expert", True, 
                             f"Deleted successfully: {data.get('message')}")
            else:
                self.log_test("DELETE /api/experts/{id} (auth) deletes expert", False, 
                             f"Status: {status}, Data: {data}")
        
        # 6. POST /api/experts without auth - should return 401
        success, data, status = self.make_request("POST", "/experts", test_expert)
        if not success and status == 401:
            self.log_test("POST /api/experts without auth returns 401", True, 
                         "Correctly rejected unauthenticated request")
        else:
            self.log_test("POST /api/experts without auth returns 401", False, 
                         f"Expected 401, got {status}")
    
    def test_templates_crud(self):
        """Test Templates CRUD operations with simplified schema + badge"""
        print("🎨 Testing Templates CRUD...")
        
        # 1. GET /api/templates - verify schema and badge field
        success, data, status = self.make_request("GET", "/templates")
        if success and isinstance(data, list) and len(data) == 6:
            # Check required fields are present
            required_fields = ["title", "slug", "category", "excerpt", "thumbnailUrl", "tags", 
                             "priceLabel", "status", "demoUrl", "badge", "published", "id", "createdAt"]
            
            # Check removed fields are NOT present
            removed_fields = ["description", "gallery", "features", "techStack", "useCases", 
                            "valuePoints", "ctaLabel"]
            
            first_template = data[0] if data else {}
            has_required = all(field in first_template for field in required_fields)
            has_removed = any(field in first_template for field in removed_fields)
            
            # Check badge values
            badges = [t.get("badge", "") for t in data]
            expected_badges = ["Most Popular", "Best Seller", "Trending", ""]
            has_valid_badges = all(badge in expected_badges for badge in badges)
            
            if has_required and not has_removed and has_valid_badges:
                self.log_test("GET /api/templates returns correct simplified schema with badge", True, 
                             f"Found {len(data)} templates with badges: {badges}")
            else:
                self.log_test("GET /api/templates returns correct simplified schema with badge", False, 
                             f"Required fields: {has_required}, No removed fields: {not has_removed}, Valid badges: {has_valid_badges}")
        else:
            self.log_test("GET /api/templates returns correct simplified schema with badge", False, 
                         f"Status: {status}, Data length: {len(data) if isinstance(data, list) else 'not list'}")
        
        # 2. POST /api/templates (auth) with minimal body without description
        minimal_template = {
            "title": "Test Template",
            "category": "Test",
            "excerpt": "A test template",
            "thumbnailUrl": "https://example.com/thumb.jpg",
            "tags": ["Test"],
            "priceLabel": "$99",
            "status": "Available",
            "demoUrl": "https://example.com/demo",
            "badge": "Trending",
            "published": True
        }
        
        success, data, status = self.make_request("POST", "/templates", minimal_template, self.get_auth_headers())
        created_template_id = None
        if success and "id" in data:
            created_template_id = data["id"]
            self.log_test("POST /api/templates (auth) with minimal body succeeds", True, 
                         f"Created template with ID: {created_template_id}")
        else:
            self.log_test("POST /api/templates (auth) with minimal body succeeds", False, 
                         f"Status: {status}, Data: {data}")
        
        # 3. PUT badge update
        if created_template_id:
            badge_update = {"badge": "Most Popular"}
            success, data, status = self.make_request("PUT", f"/templates/{created_template_id}", 
                                                    badge_update, self.get_auth_headers())
            if success and data.get("badge") == "Most Popular":
                self.log_test("PUT /api/templates/{id} badge update works", True, 
                             f"Updated badge to: {data.get('badge')}")
            else:
                self.log_test("PUT /api/templates/{id} badge update works", False, 
                             f"Status: {status}, Data: {data}")
        
        # 4. DELETE template
        if created_template_id:
            success, data, status = self.make_request("DELETE", f"/templates/{created_template_id}", 
                                                    headers=self.get_auth_headers())
            if success and "message" in data:
                self.log_test("DELETE /api/templates/{id} works", True, 
                             f"Deleted successfully: {data.get('message')}")
            else:
                self.log_test("DELETE /api/templates/{id} works", False, 
                             f"Status: {status}, Data: {data}")
    
    def test_stats_endpoint(self):
        """Test /api/stats endpoint"""
        print("📊 Testing Stats Endpoint...")
        
        success, data, status = self.make_request("GET", "/stats", headers=self.get_auth_headers())
        if success and "totalExperts" in data:
            self.log_test("/api/stats (auth) includes totalExperts field", True, 
                         f"totalExperts: {data.get('totalExperts')}")
        else:
            self.log_test("/api/stats (auth) includes totalExperts field", False, 
                         f"Status: {status}, Data: {data}")
    
    def test_other_routes(self):
        """Test other routes still working"""
        print("🔗 Testing Other Routes...")
        
        # Test health endpoint
        success, data, status = self.make_request("GET", "/health")
        if success and data.get("status") == "healthy":
            self.log_test("GET /api/health works", True, f"Service: {data.get('service')}")
        else:
            self.log_test("GET /api/health works", False, f"Status: {status}, Data: {data}")
        
        # Test blogs endpoint
        success, data, status = self.make_request("GET", "/blogs")
        if success and isinstance(data, list):
            self.log_test("GET /api/blogs works", True, f"Found {len(data)} blogs")
        else:
            self.log_test("GET /api/blogs works", False, f"Status: {status}, Data: {data}")
        
        # Test services endpoint
        success, data, status = self.make_request("GET", "/services")
        if success and isinstance(data, list):
            self.log_test("GET /api/services works", True, f"Found {len(data)} services")
        else:
            self.log_test("GET /api/services works", False, f"Status: {status}, Data: {data}")
    
    def run_all_tests(self):
        """Run all tests"""
        print("🚀 Starting Backend API Tests for Node.js Express Server")
        print("=" * 60)
        
        # Authenticate first
        if not self.authenticate():
            print("❌ Authentication failed. Cannot proceed with other tests.")
            return False
        
        # Run all test suites
        self.test_experts_crud()
        self.test_templates_crud()
        self.test_stats_endpoint()
        self.test_other_routes()
        
        # Summary
        print("=" * 60)
        print("📋 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result["success"])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        if total - passed > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['details']}")
        
        return passed == total

if __name__ == "__main__":
    tester = APITester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)