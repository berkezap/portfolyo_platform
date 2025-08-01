#!/usr/bin/env node

/**
 * 🧪 Authenticated API Test Suite
 * Bu test suite authentication gerektiren endpoint'leri test eder
 * GitHub OAuth flow'u simulate eder
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { performance } = require('perf_hooks');

const BASE_URL = 'http://localhost:3000';

// Test configuration
const config = {
  maxRetries: 3,
  timeout: 10000,
  endpoints: [
    {
      name: 'Database Health Check',
      method: 'GET',
      path: '/api/test-db',
      requiresAuth: false,
      expectedStatus: 200
    },
    {
      name: 'Portfolio List',
      method: 'GET', 
      path: '/api/portfolio/list',
      requiresAuth: true,
      expectedStatus: 200
    },
    {
      name: 'GitHub Repos',
      method: 'GET',
      path: '/api/github/repos',
      requiresAuth: true,
      expectedStatus: 200
    },
    {
      name: 'Portfolio Generate',
      method: 'POST',
      path: '/api/portfolio/generate',
      requiresAuth: true,
      expectedStatus: 200,
      body: {
        templateName: 'modern-developer',
        selectedRepos: ['test-repo'],
        cvUrl: 'https://example.com/cv.pdf'
      }
    }
  ]
};

/**
 * Simulates authentication by creating a fake session
 * In a real scenario, this would be done through OAuth flow
 */
async function simulateAuthentication() {
  console.log('🔐 Simulating authentication...');
  
  // Get CSRF token first
  try {
    const csrfResponse = await fetch(`${BASE_URL}/api/auth/csrf`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (csrfResponse.ok) {
      const csrfData = await csrfResponse.json();
      console.log('✅ CSRF token obtained');
      return csrfData.csrfToken;
    }
  } catch (error) {
    console.log('⚠️ Could not get CSRF token:', error.message);
  }
  
  return null;
}

/**
 * Makes an authenticated request
 */
async function makeAuthenticatedRequest(endpoint, csrfToken = null) {
  const url = `${BASE_URL}${endpoint.path}`;
  const startTime = performance.now();
  
  const options = {
    method: endpoint.method,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'PortfolYO-API-Test/1.0'
    }
  };
  
  // Add CSRF token if available
  if (csrfToken && endpoint.requiresAuth) {
    options.headers['X-CSRF-Token'] = csrfToken;
  }
  
  // Add body for POST requests
  if (endpoint.body) {
    options.body = JSON.stringify(endpoint.body);
  }
  
  try {
    const response = await fetch(url, options);
    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);
    
    let responseData;
    try {
      responseData = await response.json();
    } catch {
      responseData = await response.text();
    }
    
    return {
      success: true,
      status: response.status,
      duration,
      data: responseData,
      url
    };
  } catch (error) {
    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);
    
    return {
      success: false,
      status: 0,
      duration,
      error: error.message,
      url
    };
  }
}

/**
 * Runs a single test
 */
async function runTest(endpoint, csrfToken) {
  console.log(`\n🧪 Testing: ${endpoint.name}`);
  console.log(`   ${endpoint.method} ${endpoint.path}`);
  
  const result = await makeAuthenticatedRequest(endpoint, csrfToken);
  
  if (result.success) {
    const statusColor = result.status === endpoint.expectedStatus ? '✅' : '⚠️';
    console.log(`   ${statusColor} Status: ${result.status} (expected: ${endpoint.expectedStatus})`);
    console.log(`   ⏱️  Duration: ${result.duration}ms`);
    
    if (endpoint.requiresAuth && result.status === 401) {
      console.log(`   🔒 Authentication required (as expected)`);
    } else if (result.status === endpoint.expectedStatus) {
      console.log(`   📊 Response: ${typeof result.data === 'object' ? JSON.stringify(result.data).substring(0, 100) + '...' : result.data}`);
    }
    
    return result.status === endpoint.expectedStatus;
  } else {
    console.log(`   ❌ Request failed: ${result.error}`);
    console.log(`   ⏱️  Duration: ${result.duration}ms`);
    return false;
  }
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('🚀 Starting Authenticated API Test Suite\n');
  console.log(`🌐 Base URL: ${BASE_URL}`);
  console.log(`📋 Total endpoints: ${config.endpoints.length}\n`);
  
  // Simulate authentication
  const csrfToken = await simulateAuthentication();
  
  let passedTests = 0;
  let totalTests = config.endpoints.length;
  const results = [];
  
  // Run tests
  for (const endpoint of config.endpoints) {
    const passed = await runTest(endpoint, csrfToken);
    results.push({ endpoint: endpoint.name, passed });
    if (passed) passedTests++;
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${passedTests}/${totalTests} (${Math.round(passedTests/totalTests*100)}%)`);
  console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);
  
  console.log('\n📋 Detailed Results:');
  results.forEach(result => {
    const icon = result.passed ? '✅' : '❌';
    console.log(`   ${icon} ${result.endpoint}`);
  });
  
  console.log('\n' + '='.repeat(60));
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed!');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed. Check authentication setup.');
    console.log('💡 Tip: Make sure development server is running and GitHub OAuth is configured.');
    process.exit(1);
  }
}

// Run the tests
if (require.main === module) {
  runTests().catch(error => {
    console.error('💥 Test runner crashed:', error);
    process.exit(1);
  });
}

module.exports = { runTests, makeAuthenticatedRequest };
