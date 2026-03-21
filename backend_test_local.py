import requests
import sys
import json
from datetime import datetime

class APXIELLocalAPITester:
    def __init__(self, base_url="http://localhost:8001"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.failed_tests.append({
                    "test": name,
                    "endpoint": endpoint,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "response": response.text[:200]
                })
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                "test": name,
                "endpoint": endpoint,
                "error": str(e)
            })
            return False, {}

    def test_health_check(self):
        """Test API health check"""
        return self.run_test("Health Check", "GET", "api/health", 200)

    def test_get_services(self):
        """Test getting services"""
        success, response = self.run_test("Get Services", "GET", "api/services", 200)
        if success and isinstance(response, list):
            print(f"   Found {len(response)} services")
            if len(response) == 4:
                print("✅ Correct number of services (4)")
                # Verify service structure
                for i, service in enumerate(response):
                    required_fields = ['id', 'name', 'description', 'features', 'icon', 'priceRange', 'order']
                    if all(field in service for field in required_fields):
                        print(f"   ✅ Service {i+1}: {service['name']} - Structure valid")
                    else:
                        print(f"   ❌ Service {i+1}: Missing required fields")
                return True
            else:
                print(f"❌ Expected 4 services, got {len(response)}")
                return False
        return success

    def test_get_blogs(self):
        """Test getting blogs"""
        success, response = self.run_test("Get Blogs", "GET", "api/blogs", 200)
        if success and isinstance(response, list):
            print(f"   Found {len(response)} blogs")
            if len(response) == 3:
                print("✅ Correct number of blogs (3)")
                # Verify blog structure
                for i, blog in enumerate(response):
                    required_fields = ['id', 'title', 'slug', 'excerpt', 'content', 'author', 'category']
                    if all(field in blog for field in required_fields):
                        print(f"   ✅ Blog {i+1}: {blog['title'][:30]}... - Structure valid")
                    else:
                        print(f"   ❌ Blog {i+1}: Missing required fields")
                return True
            else:
                print(f"❌ Expected 3 blogs, got {len(response)}")
                return False
        return success

    def test_admin_login(self):
        """Test admin login"""
        login_data = {
            "email": "admin@agency.com",
            "password": "Admin@123"
        }
        success, response = self.run_test("Admin Login", "POST", "api/auth/login", 200, login_data)
        if success and 'access_token' in response:
            self.token = response['access_token']
            print("✅ Token received and stored")
            print(f"   Token type: {response.get('token_type', 'N/A')}")
            return True
        return success

    def test_protected_stats(self):
        """Test protected stats endpoint"""
        if not self.token:
            print("❌ No token available for protected endpoint test")
            return False
        
        success, response = self.run_test("Get Stats (Protected)", "GET", "api/stats", 200)
        if success:
            expected_keys = ['totalBlogs', 'totalServices', 'totalMessages', 'unreadMessages']
            if all(key in response for key in expected_keys):
                print("✅ All expected stats keys present")
                print(f"   Total Blogs: {response['totalBlogs']}")
                print(f"   Total Services: {response['totalServices']}")
                print(f"   Total Messages: {response['totalMessages']}")
                print(f"   Unread Messages: {response['unreadMessages']}")
                return True
            else:
                print(f"❌ Missing stats keys. Expected: {expected_keys}, Got: {list(response.keys())}")
        return success

    def test_contact_form(self):
        """Test contact form submission"""
        contact_data = {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "+1234567890",
            "service": "Website Development",
            "message": "This is a test message from automated testing."
        }
        success, response = self.run_test("Contact Form Submission", "POST", "api/contact", 200, contact_data)
        if success:
            required_fields = ['id', 'name', 'email', 'message', 'read', 'createdAt']
            if all(field in response for field in required_fields):
                print("✅ Contact form response structure valid")
                print(f"   Contact ID: {response['id']}")
                print(f"   Read status: {response['read']}")
                return True
            else:
                print(f"❌ Contact response missing fields")
        return success

    def test_blog_by_slug(self):
        """Test getting a specific blog by slug"""
        # First get blogs to find a slug
        success, blogs = self.run_test("Get Blogs for Slug Test", "GET", "api/blogs", 200)
        if success and blogs and len(blogs) > 0:
            slug = blogs[0].get('slug')
            if slug:
                success, blog = self.run_test(f"Get Blog by Slug ({slug})", "GET", f"api/blogs/{slug}", 200)
                if success:
                    print(f"   ✅ Blog retrieved: {blog.get('title', 'N/A')}")
                    return True
        return False

    def test_invalid_login(self):
        """Test login with invalid credentials"""
        invalid_data = {
            "email": "wrong@email.com",
            "password": "wrongpassword"
        }
        success, response = self.run_test("Invalid Login", "POST", "api/auth/login", 401, invalid_data)
        if success:
            print("✅ Correctly rejected invalid credentials")
        return success

    def test_unauthorized_access(self):
        """Test accessing protected endpoint without token"""
        # Temporarily remove token
        temp_token = self.token
        self.token = None
        success, response = self.run_test("Unauthorized Stats Access", "GET", "api/stats", 401)
        self.token = temp_token  # Restore token
        if success:
            print("✅ Correctly rejected unauthorized access")
        return success

def main():
    print("🚀 Starting APIXEL Agency LOCAL API Tests")
    print("=" * 60)
    
    tester = APXIELLocalAPITester()
    
    # Run all tests
    tests = [
        ("Health Check", tester.test_health_check),
        ("Services API", tester.test_get_services),
        ("Blogs API", tester.test_get_blogs),
        ("Admin Login", tester.test_admin_login),
        ("Protected Stats", tester.test_protected_stats),
        ("Contact Form", tester.test_contact_form),
        ("Blog by Slug", tester.test_blog_by_slug),
        ("Invalid Login", tester.test_invalid_login),
        ("Unauthorized Access", tester.test_unauthorized_access),
    ]
    
    for test_name, test_func in tests:
        try:
            test_func()
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {str(e)}")
            tester.failed_tests.append({
                "test": test_name,
                "error": str(e)
            })
    
    # Print summary
    print("\n" + "=" * 60)
    print("📊 LOCAL BACKEND TEST SUMMARY")
    print("=" * 60)
    print(f"Tests Run: {tester.tests_run}")
    print(f"Tests Passed: {tester.tests_passed}")
    print(f"Tests Failed: {tester.tests_run - tester.tests_passed}")
    print(f"Success Rate: {(tester.tests_passed / tester.tests_run * 100):.1f}%")
    
    if tester.failed_tests:
        print("\n❌ FAILED TESTS:")
        for failure in tester.failed_tests:
            print(f"  - {failure.get('test', 'Unknown')}: {failure.get('error', failure.get('response', 'Unknown error'))}")
    else:
        print("\n✅ ALL TESTS PASSED!")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())