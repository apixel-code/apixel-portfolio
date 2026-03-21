import requests
import sys
import json
from datetime import datetime

class APXIELAPITester:
    def __init__(self, base_url="https://3236cc25-3db2-4b9c-b71a-3f5cecd39ced.preview.emergentagent.com"):
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
        print(f"   URL: {url}")
        
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
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
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
        return self.run_test("Contact Form Submission", "POST", "api/contact", 200, contact_data)

    def test_blog_by_slug(self):
        """Test getting a specific blog by slug"""
        # First get blogs to find a slug
        success, blogs = self.run_test("Get Blogs for Slug Test", "GET", "api/blogs", 200)
        if success and blogs and len(blogs) > 0:
            slug = blogs[0].get('slug')
            if slug:
                return self.run_test(f"Get Blog by Slug ({slug})", "GET", f"api/blogs/{slug}", 200)
        return False

    def test_invalid_login(self):
        """Test login with invalid credentials"""
        invalid_data = {
            "email": "wrong@email.com",
            "password": "wrongpassword"
        }
        return self.run_test("Invalid Login", "POST", "api/auth/login", 401, invalid_data)

def main():
    print("🚀 Starting APIXEL Agency API Tests")
    print("=" * 50)
    
    tester = APXIELAPITester()
    
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
    print("\n" + "=" * 50)
    print("📊 TEST SUMMARY")
    print("=" * 50)
    print(f"Tests Run: {tester.tests_run}")
    print(f"Tests Passed: {tester.tests_passed}")
    print(f"Tests Failed: {tester.tests_run - tester.tests_passed}")
    print(f"Success Rate: {(tester.tests_passed / tester.tests_run * 100):.1f}%")
    
    if tester.failed_tests:
        print("\n❌ FAILED TESTS:")
        for failure in tester.failed_tests:
            print(f"  - {failure.get('test', 'Unknown')}: {failure.get('error', failure.get('response', 'Unknown error'))}")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())