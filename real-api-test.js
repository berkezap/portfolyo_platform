#!/usr/bin/env node

const https = require('https');
const http = require('http');

// Test configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // GitHub personal access token
const TEST_DURATION = 30000; // 30 seconds

console.log('🚀 PortfolYO Real API Performance Test');
console.log('📍 Target URL:', BASE_URL);
console.log('🔐 GitHub Token:', GITHUB_TOKEN ? '✅ Provided' : '❌ Missing');
console.log('⏱️  Test Duration:', TEST_DURATION / 1000, 'seconds');

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || !GITHUB_TOKEN;

if (!GITHUB_TOKEN && !DEMO_MODE) {
  console.log('\n❌ GitHub token required for real API testing');
  console.log('💡 Set GITHUB_TOKEN environment variable');
  console.log('💡 Or use demo mode for testing without authentication');
  process.exit(1);
}

if (DEMO_MODE) {
  console.log('🎭 Running in DEMO MODE (no authentication required)');
}

// Helper function to make HTTP requests
function makeRequest(options) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body: data,
          headers: res.headers,
          duration: Date.now() - startTime
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => reject(new Error('Request timeout')));
    
    if (options.data) {
      req.write(options.data);
    }
    
    req.end();
  });
}

// Test endpoints with real authentication
async function testEndpoint(endpoint, method = 'GET', data = null) {
  const startTime = Date.now();
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: endpoint,
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Cookie': `github_token=${GITHUB_TOKEN}`
    },
    timeout: 10000
  };

  if (data) {
    options.data = JSON.stringify(data);
  }

  try {
    const response = await makeRequest(options);
    const duration = Date.now() - startTime;
    
    return {
      endpoint,
      status: response.status,
      duration,
      success: response.status >= 200 && response.status < 300,
      body: response.body
    };
  } catch (error) {
    return {
      endpoint,
      status: 0,
      duration: Date.now() - startTime,
      success: false,
      error: error.message
    };
  }
}

// Test scenarios
async function runRealTests() {
  const results = [];
  const startTime = Date.now();
  
  console.log('\n🔍 Testing Real API Endpoints...\n');

  // Test 1: Database Health Check (no auth required)
  console.log('1️⃣ Testing Database Health Check...');
  const dbResult = await testEndpoint('/api/test-db');
  results.push(dbResult);
  console.log(`   Status: ${dbResult.status}, Time: ${dbResult.duration}ms`);

  // Test 2: GitHub Repos (requires auth)
  console.log('2️⃣ Testing GitHub Repos...');
  const reposResult = await testEndpoint('/api/github/repos');
  results.push(reposResult);
  console.log(`   Status: ${reposResult.status}, Time: ${reposResult.duration}ms`);

  // Test 3: Portfolio List (requires auth)
  console.log('3️⃣ Testing Portfolio List...');
  const listResult = await testEndpoint('/api/portfolio/list');
  results.push(listResult);
  console.log(`   Status: ${listResult.status}, Time: ${listResult.duration}ms`);

  // Test 4: CV Upload (requires auth)
  console.log('4️⃣ Testing CV Upload...');
  const uploadData = {
    fileName: 'test-cv.pdf',
    fileType: 'application/pdf'
  };
  const uploadResult = await testEndpoint('/api/upload/cv', 'POST', uploadData);
  results.push(uploadResult);
  console.log(`   Status: ${uploadResult.status}, Time: ${uploadResult.duration}ms`);

  // Test 5: Portfolio Generation (requires auth)
  console.log('5️⃣ Testing Portfolio Generation...');
  const generateData = {
    templateName: 'modern-developer',
    selectedRepos: ['test-repo'],
    cvUrl: 'https://example.com/cv.pdf'
  };
  const generateResult = await testEndpoint('/api/portfolio/generate', 'POST', generateData);
  results.push(generateResult);
  console.log(`   Status: ${generateResult.status}, Time: ${generateResult.duration}ms`);

  // Calculate statistics
  const successfulResults = results.filter(r => r.success);
  const failedResults = results.filter(r => !r.success);
  const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
  const maxDuration = Math.max(...results.map(r => r.duration));
  const minDuration = Math.min(...results.map(r => r.duration));

  // Print results
  console.log('\n📊 Real API Test Results');
  console.log('====================================');
  console.log(`Total Requests: ${results.length}`);
  console.log(`Successful: ${successfulResults.length}`);
  console.log(`Failed: ${failedResults.length}`);
  console.log(`Success Rate: ${((successfulResults.length / results.length) * 100).toFixed(1)}%`);
  console.log(`Average Response Time: ${avgDuration.toFixed(2)}ms`);
  console.log(`Min Response Time: ${minDuration}ms`);
  console.log(`Max Response Time: ${maxDuration}ms`);

  console.log('\n📋 Detailed Results:');
  results.forEach((result, index) => {
    const status = result.success ? '✅' : '❌';
    console.log(`${index + 1}. ${status} ${result.endpoint} - ${result.status} (${result.duration}ms)`);
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  });

  // Performance assessment
  console.log('\n💡 Performance Assessment:');
  if (successfulResults.length === results.length) {
    console.log('✅ All endpoints working perfectly!');
  } else {
    console.log('⚠️  Some endpoints failed - check authentication');
  }

  if (avgDuration < 500) {
    console.log('✅ Excellent response times');
  } else if (avgDuration < 1000) {
    console.log('⚠️  Good response times, room for improvement');
  } else {
    console.log('❌ Slow response times - optimization needed');
  }

  console.log('\n✅ Real API test completed!');
}

// Run the test
runRealTests().catch(console.error); 