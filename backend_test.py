import requests
import sys
from datetime import datetime

class ApixelAPITester:
    def __init__(self, base_url="https://apixel-admin-hub.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        if headers:
            test_headers.update(headers)
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, dict) and 'status' in response_data:
                        print(f"   Response: {response_data}")
                    elif isinstance(response_data, list):
                        print(f"   Response: List with {len(response_data)} items")
                except:
                    print(f"   Response: {response.text[:100]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")

            return success, response.json() if response.status_code < 400 else {}

        except requests.exceptions.RequestException as e:
            print(f"❌ Failed - Network Error: {str(e)}")
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test health check endpoint"""
        success, response = self.run_test(
            "Health Check",
            "GET",
            "api/health",
            200
        )
        return success

    def test_login(self, email, password):
        """Test admin login"""
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "api/auth/login",
            200,
            data={"email": email, "password": password}
        )
        if success and 'access_token' in response:
            self.token = response['access_token']
            print(f"   ✅ Token obtained successfully")
            return True
        return False

    def test_get_services(self):
        """Test get services endpoint"""
        success, response = self.run_test(
            "Get Services",
            "GET",
            "api/services",
            200
        )
        return success

    def test_get_blogs(self):
        """Test get blogs endpoint"""
        success, response = self.run_test(
            "Get Blogs",
            "GET",
            "api/blogs",
            200
        )
        return success

    def test_get_templates(self):
        """Test get templates endpoint"""
        success, response = self.run_test(
            "Get Templates",
            "GET",
            "api/templates",
            200
        )
        return success

    def test_contact_form(self):
        """Test contact form submission"""
        test_contact = {
            "name": f"Test User {datetime.now().strftime('%H%M%S')}",
            "email": "test@example.com",
            "phone": "+8801754407239",
            "service": "Website Development",
            "message": "This is a test message from automated testing."
        }
        
        success, response = self.run_test(
            "Contact Form Submission",
            "POST",
            "api/contact",
            200,
            data=test_contact
        )
        return success

    def test_admin_stats(self):
        """Test admin stats endpoint (requires auth)"""
        if not self.token:
            print("❌ Skipping admin stats test - no auth token")
            return False
            
        success, response = self.run_test(
            "Admin Stats",
            "GET",
            "api/stats",
            200
        )
        return success

def main():
    print("🚀 Starting Apixel Portfolio API Tests")
    print("=" * 50)
    
    # Setup
    tester = ApixelAPITester()
    
    # Test public endpoints first
    print("\n📋 Testing Public Endpoints...")
    tester.test_health_check()
    tester.test_get_services()
    tester.test_get_blogs()
    tester.test_get_templates()
    tester.test_contact_form()
    
    # Test admin endpoints
    print("\n🔐 Testing Admin Endpoints...")
    if tester.test_login("admin@agency.com", "Admin@123"):
        tester.test_admin_stats()
    else:
        print("❌ Admin login failed, skipping authenticated tests")

    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Final Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print(f"⚠️  {tester.tests_run - tester.tests_passed} tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())