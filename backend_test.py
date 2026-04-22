#!/usr/bin/env python3
"""
Backend API Testing for APIXEL Agency
Tests the newly added/updated backend endpoints
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
    
    def make_request(self, method: str, endpoint: str, data: Optional[Dict] = None, 
                    auth: bool = False, params: Optional[Dict] = None) -> requests.Response:
        """Make HTTP request with optional auth"""
        url = f"{self.base_url}{endpoint}"
        headers = {"Content-Type": "application/json"}
        
        if auth and self.token:
            headers["Authorization"] = f"Bearer {self.token}"
        
        try:
            if method.upper() == "GET":
                response = requests.get(url, headers=headers, params=params, timeout=30)
            elif method.upper() == "POST":
                response = requests.post(url, headers=headers, json=data, timeout=30)
            elif method.upper() == "PUT":
                response = requests.put(url, headers=headers, json=data, timeout=30)
            elif method.upper() == "DELETE":
                response = requests.delete(url, headers=headers, timeout=30)
            else:
                raise ValueError(f"Unsupported method: {method}")
            
            return response
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            raise
    
    def test_auth_login(self):
        """Test authentication login"""
        print("=== Testing Authentication ===")
        
        # Test correct credentials
        response = self.make_request("POST", "/auth/login", {
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        
        if response.status_code == 200:
            data = response.json()
            if "access_token" in data:
                self.token = data["access_token"]
                self.log_test("Auth Login - Correct Credentials", True, 
                            f"Token received: {self.token[:20]}...")
            else:
                self.log_test("Auth Login - Correct Credentials", False, 
                            "No access_token in response")
        else:
            self.log_test("Auth Login - Correct Credentials", False, 
                        f"Status: {response.status_code}, Response: {response.text}")
        
        # Test wrong password
        response = self.make_request("POST", "/auth/login", {
            "email": ADMIN_EMAIL,
            "password": "WrongPassword"
        })
        
        success = response.status_code == 401
        self.log_test("Auth Login - Wrong Password", success, 
                    f"Status: {response.status_code} (expected 401)")
    
    def test_experts_crud(self):
        """Test Experts CRUD operations"""
        print("=== Testing Experts CRUD ===")
        
        # Test GET /api/experts (no auth) - should return published experts
        response = self.make_request("GET", "/experts")
        if response.status_code == 200:
            experts = response.json()
            if isinstance(experts, list) and len(experts) == 4:
                # Check if sorted by order ascending
                orders = [expert.get("order", 0) for expert in experts]
                is_sorted = orders == sorted(orders)
                # Check if all are published
                all_published = all(expert.get("published", False) for expert in experts)
                
                success = is_sorted and all_published
                details = f"Found {len(experts)} experts, sorted by order: {is_sorted}, all published: {all_published}"
                self.log_test("GET /api/experts (public)", success, details)
            else:
                self.log_test("GET /api/experts (public)", False, 
                            f"Expected 4 experts, got {len(experts) if isinstance(experts, list) else 'non-list'}")
        else:
            self.log_test("GET /api/experts (public)", False, 
                        f"Status: {response.status_code}, Response: {response.text}")
        
        # Test GET /api/experts?published_only=false (with auth)
        response = self.make_request("GET", "/experts", auth=True, params={"published_only": "false"})
        if response.status_code == 200:
            all_experts = response.json()
            success = isinstance(all_experts, list) and len(all_experts) >= 4
            self.log_test("GET /api/experts (with auth, all)", success, 
                        f"Found {len(all_experts)} total experts")
        else:
            self.log_test("GET /api/experts (with auth, all)", False, 
                        f"Status: {response.status_code}")
        
        # Test POST /api/experts (with auth)
        new_expert = {
            "name": "Test Expert",
            "role": "QA Lead",
            "image": "https://example.com/img.jpg",
            "order": 5,
            "published": True
        }
        response = self.make_request("POST", "/experts", new_expert, auth=True)
        created_expert_id = None
        
        if response.status_code == 200:
            created_expert = response.json()
            if "id" in created_expert and "createdAt" in created_expert:
                created_expert_id = created_expert["id"]
                self.log_test("POST /api/experts (with auth)", True, 
                            f"Created expert with ID: {created_expert_id}")
            else:
                self.log_test("POST /api/experts (with auth)", False, 
                            "Missing id or createdAt in response")
        else:
            self.log_test("POST /api/experts (with auth)", False, 
                        f"Status: {response.status_code}, Response: {response.text}")
        
        # Test PUT /api/experts/{id} (with auth)
        if created_expert_id:
            update_data = {"role": "Senior QA Lead"}
            response = self.make_request("PUT", f"/experts/{created_expert_id}", update_data, auth=True)
            
            if response.status_code == 200:
                updated_expert = response.json()
                success = updated_expert.get("role") == "Senior QA Lead"
                self.log_test("PUT /api/experts/{id} (with auth)", success, 
                            f"Updated role to: {updated_expert.get('role')}")
            else:
                self.log_test("PUT /api/experts/{id} (with auth)", False, 
                            f"Status: {response.status_code}")
        
        # Test DELETE /api/experts/{id} (with auth)
        if created_expert_id:
            response = self.make_request("DELETE", f"/experts/{created_expert_id}", auth=True)
            
            success = response.status_code == 200
            self.log_test("DELETE /api/experts/{id} (with auth)", success, 
                        f"Status: {response.status_code}")
        
        # Test POST without auth (should fail)
        response = self.make_request("POST", "/experts", new_expert, auth=False)
        success = response.status_code in [401, 403]
        self.log_test("POST /api/experts (no auth)", success, 
                    f"Status: {response.status_code} (expected 401/403)")
    
    def test_templates_simplified_schema(self):
        """Test Templates with simplified schema and badge field"""
        print("=== Testing Templates Simplified Schema + Badge ===")
        
        # Test GET /api/templates
        response = self.make_request("GET", "/templates")
        if response.status_code == 200:
            templates = response.json()
            if isinstance(templates, list) and len(templates) > 0:
                template = templates[0]
                
                # Check for required fields from new schema
                required_fields = ["title", "slug", "category", "excerpt", "thumbnailUrl", 
                                 "tags", "priceLabel", "status", "demoUrl", "badge", 
                                 "published", "id", "createdAt"]
                
                # Check for removed fields (should NOT be present)
                removed_fields = ["description", "gallery", "features", "techStack", 
                                "useCases", "valuePoints", "ctaLabel"]
                
                has_required = all(field in template for field in required_fields)
                has_removed = any(field in template for field in removed_fields)
                
                # Check if some templates have badges
                badges_found = [t.get("badge", "") for t in templates if t.get("badge")]
                expected_badges = ["Most Popular", "Best Seller", "Trending"]
                has_valid_badges = any(badge in expected_badges for badge in badges_found)
                
                success = has_required and not has_removed and has_valid_badges
                details = f"Required fields: {has_required}, No removed fields: {not has_removed}, Valid badges found: {has_valid_badges}, Badges: {badges_found}"
                self.log_test("GET /api/templates (simplified schema)", success, details)
            else:
                self.log_test("GET /api/templates (simplified schema)", False, 
                            f"Expected templates list, got {type(templates)}")
        else:
            self.log_test("GET /api/templates (simplified schema)", False, 
                        f"Status: {response.status_code}")
        
        # Test POST /api/templates (with auth) - minimal body
        new_template = {
            "title": "Sample Item",
            "slug": "",
            "category": "Test",
            "excerpt": "Short excerpt",
            "thumbnailUrl": "https://example.com/a.jpg",
            "tags": ["x", "y"],
            "priceLabel": "$99",
            "status": "Available",
            "demoUrl": "https://demo.test",
            "badge": "Trending",
            "published": True
        }
        response = self.make_request("POST", "/templates", new_template, auth=True)
        created_template_id = None
        
        if response.status_code == 200:
            created_template = response.json()
            if "id" in created_template and "createdAt" in created_template:
                created_template_id = created_template["id"]
                self.log_test("POST /api/templates (minimal body)", True, 
                            f"Created template with ID: {created_template_id}")
            else:
                self.log_test("POST /api/templates (minimal body)", False, 
                            "Missing id or createdAt in response")
        else:
            self.log_test("POST /api/templates (minimal body)", False, 
                        f"Status: {response.status_code}, Response: {response.text}")
        
        # Test PUT to update badge
        if created_template_id:
            update_data = {"badge": "Best Seller"}
            response = self.make_request("PUT", f"/templates/{created_template_id}", update_data, auth=True)
            
            if response.status_code == 200:
                updated_template = response.json()
                success = updated_template.get("badge") == "Best Seller"
                self.log_test("PUT /api/templates/{id} (update badge)", success, 
                            f"Updated badge to: {updated_template.get('badge')}")
            else:
                self.log_test("PUT /api/templates/{id} (update badge)", False, 
                            f"Status: {response.status_code}")
        
        # Test DELETE
        if created_template_id:
            response = self.make_request("DELETE", f"/templates/{created_template_id}", auth=True)
            success = response.status_code == 200
            self.log_test("DELETE /api/templates/{id}", success, 
                        f"Status: {response.status_code}")
    
    def test_stats_endpoint(self):
        """Test /api/stats endpoint"""
        print("=== Testing Stats Endpoint ===")
        
        response = self.make_request("GET", "/stats", auth=True)
        if response.status_code == 200:
            stats = response.json()
            has_total_experts = "totalExperts" in stats
            experts_count = stats.get("totalExperts", 0)
            
            success = has_total_experts and experts_count >= 4
            details = f"totalExperts present: {has_total_experts}, count: {experts_count}"
            self.log_test("GET /api/stats (includes totalExperts)", success, details)
        else:
            self.log_test("GET /api/stats (includes totalExperts)", False, 
                        f"Status: {response.status_code}")
    
    def run_all_tests(self):
        """Run all tests"""
        print(f"Starting Backend API Tests for: {self.base_url}")
        print("=" * 60)
        
        try:
            # Test authentication first
            self.test_auth_login()
            
            if not self.token:
                print("❌ Cannot proceed without authentication token")
                return False
            
            # Test all endpoints
            self.test_experts_crud()
            self.test_templates_simplified_schema()
            self.test_stats_endpoint()
            
            # Summary
            print("=" * 60)
            print("TEST SUMMARY")
            print("=" * 60)
            
            passed = sum(1 for result in self.test_results if result["success"])
            total = len(self.test_results)
            
            for result in self.test_results:
                status = "✅" if result["success"] else "❌"
                print(f"{status} {result['test']}")
                if not result["success"] and result["details"]:
                    print(f"   {result['details']}")
            
            print(f"\nResults: {passed}/{total} tests passed")
            
            return passed == total
            
        except Exception as e:
            print(f"❌ Test execution failed: {e}")
            return False

if __name__ == "__main__":
    tester = APITester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)