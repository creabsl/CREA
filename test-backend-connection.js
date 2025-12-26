const https = require('https');
const http = require('http');

const BACKEND_URL = 'https://api.crea.org.in';
const FRONTEND_URL = 'https://crea.org.in';

console.log('🔍 Testing Backend and Frontend Connection...\n');
console.log('='.repeat(50));

// Test 1: Backend Health Check
function testHealthCheck() {
  return new Promise((resolve) => {
    console.log('\n1️⃣  Testing Backend Health Check...');
    const url = `${BACKEND_URL}/health`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Backend is UP and responding');
          console.log('   Response:', data);
        } else {
          console.log('❌ Backend returned status:', res.statusCode);
        }
        resolve(res.statusCode === 200);
      });
    }).on('error', (err) => {
      console.log('❌ Backend Health Check FAILED');
      console.log('   Error:', err.message);
      resolve(false);
    });
  });
}

// Test 2: Check API Endpoints
function testAPIEndpoint(path, description) {
  return new Promise((resolve) => {
    console.log(`\n   Testing ${description}: ${BACKEND_URL}${path}`);
    
    https.get(`${BACKEND_URL}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`   ✅ ${description} - OK`);
          try {
            const json = JSON.parse(data);
            console.log(`   📊 Response: ${JSON.stringify(json).substring(0, 100)}...`);
          } catch {}
        } else if (res.statusCode === 401) {
          console.log(`   ⚠️  ${description} - Requires Authentication (Expected)`);
        } else {
          console.log(`   ❌ ${description} - Status ${res.statusCode}`);
        }
        resolve(res.statusCode);
      });
    }).on('error', (err) => {
      console.log(`   ❌ ${description} FAILED - ${err.message}`);
      resolve(0);
    });
  });
}

// Test 3: CORS Configuration
function testCORS() {
  return new Promise((resolve) => {
    console.log('\n3️⃣  Testing CORS Configuration...');
    
    const options = {
      hostname: 'api.crea.org.in',
      path: '/health',
      method: 'OPTIONS',
      headers: {
        'Origin': FRONTEND_URL,
        'Access-Control-Request-Method': 'GET'
      }
    };

    const req = https.request(options, (res) => {
      const corsHeader = res.headers['access-control-allow-origin'];
      if (corsHeader) {
        console.log('✅ CORS is configured');
        console.log('   Allowed Origin:', corsHeader);
        console.log('   Credentials:', res.headers['access-control-allow-credentials']);
      } else {
        console.log('❌ CORS headers not found - This will cause frontend issues!');
      }
      resolve(!!corsHeader);
    });

    req.on('error', (err) => {
      console.log('❌ CORS test failed:', err.message);
      resolve(false);
    });

    req.end();
  });
}

// Test 4: Check if uploads directory is accessible
function testUploadsAccess() {
  return new Promise((resolve) => {
    console.log('\n4️⃣  Testing Uploads Directory Access...');
    
    https.get(`${BACKEND_URL}/uploads/test.txt`, (res) => {
      // We expect either 404 (file doesn't exist but route works) or 401 (protected)
      if (res.statusCode === 404 || res.statusCode === 403) {
        console.log('✅ Uploads route is configured (404/403 expected for non-existent file)');
      } else if (res.statusCode === 401) {
        console.log('✅ Uploads directory is protected (requires authentication)');
      } else {
        console.log(`⚠️  Unexpected status code: ${res.statusCode}`);
      }
      resolve(true);
    }).on('error', (err) => {
      console.log('❌ Cannot access uploads route:', err.message);
      resolve(false);
    });
  });
}

// Run all tests
async function runTests() {
  console.log('\n📋 Configuration Check:');
  console.log('   Backend URL:', BACKEND_URL);
  console.log('   Frontend URL:', FRONTEND_URL);
  
  const healthOk = await testHealthCheck();
  
  if (!healthOk) {
    console.log('\n❌ CRITICAL: Backend is not responding!');
    console.log('   Please check:');
    console.log('   1. Is the backend server running on your VPS?');
    console.log('   2. Is the domain api.crea.org.in pointing to your VPS IP?');
    console.log('   3. Are firewall rules allowing traffic on the backend port?');
    console.log('   4. Is SSL certificate configured correctly?');
    return;
  }

  console.log('\n2️⃣  Testing API Endpoints...');
  await testAPIEndpoint('/api/stats/summary', 'Stats Summary');
  await testAPIEndpoint('/api/events', 'Events List');
  await testAPIEndpoint('/api/circulars', 'Circulars List');
  
  await testCORS();
  await testUploadsAccess();

  console.log('\n' + '='.repeat(50));
  console.log('\n📝 Summary and Recommendations:\n');
  
  console.log('If uploads are not working, check:');
  console.log('1. CORS - Frontend domain must be in CORS allowedOrigins');
  console.log('2. File size limits - Default is 10MB, check if exceeded');
  console.log('3. Authentication - User must be logged in for protected uploads');
  console.log('4. Network - Check browser console for specific error messages');
  console.log('5. VPS disk space - Ensure sufficient space for uploads');
  console.log('6. File permissions - Backend needs write access to uploads/');
  console.log('\nBackend .env should include:');
  console.log('   CLIENT_URL=https://crea.org.in');
  console.log('   MONGODB_URI=your_mongodb_connection_string');
  console.log('   JWT_SECRET=your_secret_key');
  console.log('   PORT=5001 (or your port)');
}

runTests();
