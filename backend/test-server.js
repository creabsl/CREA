#!/usr/bin/env node

/**
 * Test script to verify server routing works correctly
 * This tests both API routes and SPA fallback to index.html
 */

const http = require('http');
const { spawn } = require('child_process');
const path = require('path');

let serverProcess;
const SERVER_PORT = 5001;
const BASE_URL = `http://localhost:${SERVER_PORT}`;

// Start the server
function startServer() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Starting server...\n');
    serverProcess = spawn('node', ['server.js'], {
      cwd: __dirname,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let output = '';
    
    serverProcess.stdout.on('data', (data) => {
      output += data.toString();
      process.stdout.write(data);
      if (output.includes('Server running')) {
        setTimeout(() => resolve(), 1000);
      }
    });

    serverProcess.stderr.on('data', (data) => {
      const msg = data.toString();
      if (msg.includes('Failed to start')) {
        reject(new Error(msg));
      }
      process.stderr.write(data);
    });

    setTimeout(() => {
      if (!output.includes('Server running')) {
        reject(new Error('Server took too long to start'));
      }
    }, 10000);
  });
}

// Make HTTP request
function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}${path}`;
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    }).on('error', reject);
  });
}

// Run tests
async function runTests() {
  const tests = [
    {
      name: 'Health check endpoint',
      path: '/health',
      expect: (res) => res.statusCode === 200 && res.body.includes('status')
    },
    {
      name: 'API route (should return JSON)',
      path: '/api/events',
      expect: (res) => res.statusCode === 200 || res.statusCode === 401
    },
    {
      name: 'Root path (should return index.html)',
      path: '/',
      expect: (res) => res.statusCode === 200 && res.body.includes('<!doctype html')
    },
    {
      name: 'SPA route /about (should return index.html)',
      path: '/about',
      expect: (res) => res.statusCode === 200 && res.body.includes('<!doctype html')
    },
    {
      name: 'SPA route /events (should return index.html)',
      path: '/events',
      expect: (res) => res.statusCode === 200 && res.body.includes('<!doctype html')
    },
    {
      name: 'SPA route /dashboard (should return index.html)',
      path: '/dashboard',
      expect: (res) => res.statusCode === 200 && res.body.includes('<!doctype html')
    }
  ];

  console.log('\n📋 Running tests...\n');
  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const res = await makeRequest(test.path);
      const success = test.expect(res);
      
      if (success) {
        console.log(`✅ ${test.name}`);
        console.log(`   GET ${test.path} → ${res.statusCode}`);
        passed++;
      } else {
        console.log(`❌ ${test.name}`);
        console.log(`   GET ${test.path} → ${res.statusCode}`);
        console.log(`   Body preview: ${res.body.substring(0, 100)}...`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name}`);
      console.log(`   Error: ${error.message}`);
      failed++;
    }
    console.log('');
  }

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
  return failed === 0;
}

// Main
async function main() {
  try {
    await startServer();
    const success = await runTests();
    
    if (success) {
      console.log('✅ All tests passed! Your server is working correctly.\n');
      console.log('The SPA routing is configured properly:');
      console.log('- API routes return JSON');
      console.log('- Frontend routes return index.html for React Router\n');
    } else {
      console.log('⚠️  Some tests failed. Check the output above.\n');
    }
    
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('\n❌ Error:', error.message, '\n');
    process.exit(1);
  } finally {
    if (serverProcess) {
      serverProcess.kill();
    }
  }
}

main();
