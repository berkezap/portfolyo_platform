#!/usr/bin/env node

/**
 * 🔐 Browser Authentication Simulator
 * Bu script browser authentication flow'unu simüle eder
 * NextAuth session'ını kullanarak API'leri test eder
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { performance } = require('perf_hooks');

const BASE_URL = 'http://localhost:3000';

/**
 * Browser authentication instructions
 */
function showAuthInstructions() {
  console.log('🔐 AUTHENTICATION INSTRUCTIONS');
  console.log('================================');
  console.log('1. Open your browser and go to: http://localhost:3000');
  console.log('2. Click "Sign in with GitHub" button');
  console.log('3. Complete GitHub OAuth flow');
  console.log('4. Once logged in, come back here and press ENTER');
  console.log('5. We will then test authenticated endpoints');
  console.log('\n⚠️  Make sure you stay logged in during the test!');
  console.log('================================\n');
}

/**
 * Waits for user to complete authentication
 */
function waitForAuthentication() {
  return new Promise((resolve) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question('Press ENTER after you have logged in via browser: ', () => {
      rl.close();
      resolve();
    });
  });
}

/**
 * Tests if user is authenticated by checking session
 */
async function checkAuthentication() {
  console.log('🔍 Checking authentication status...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/session`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (response.ok) {
      const session = await response.json();
      if (session && session.user) {
        console.log('✅ User is authenticated!');
        console.log(`👤 User: ${session.user.name || session.user.email}`);
        return true;
      } else {
        console.log('❌ No active session found');
        return false;
      }
    } else {
      console.log('❌ Could not check session');
      return false;
    }
  } catch (error) {
    console.log('❌ Error checking authentication:', error.message);
    return false;
  }
}

/**
 * Test authenticated endpoints
 */
async function testAuthenticatedEndpoints() {
  console.log('\n🧪 Testing authenticated endpoints...\n');
  
  const endpoints = [
    {
      name: 'Portfolio List',
      method: 'GET',
      path: '/api/portfolio/list'
    },
    {
      name: 'GitHub Repos',
      method: 'GET', 
      path: '/api/github/repos'
    }
  ];
  
  let passedTests = 0;
  
  for (const endpoint of endpoints) {
    console.log(`🧪 Testing: ${endpoint.name}`);
    console.log(`   ${endpoint.method} ${endpoint.path}`);
    
    const startTime = performance.now();
    
    try {
      const response = await fetch(`${BASE_URL}${endpoint.path}`, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      
      let responseData;
      try {
        responseData = await response.json();
      } catch {
        responseData = await response.text();
      }
      
      if (response.ok) {
        console.log(`   ✅ Status: ${response.status}`);
        console.log(`   ⏱️  Duration: ${duration}ms`);
        console.log(`   📊 Response: ${typeof responseData === 'object' ? JSON.stringify(responseData).substring(0, 100) + '...' : responseData}`);
        passedTests++;
      } else {
        console.log(`   ❌ Status: ${response.status}`);
        console.log(`   ⏱️  Duration: ${duration}ms`);
        console.log(`   🔒 Response: ${typeof responseData === 'object' ? JSON.stringify(responseData) : responseData}`);
      }
    } catch (error) {
      console.log(`   ❌ Request failed: ${error.message}`);
    }
    
    console.log('');
  }
  
  // Summary
  console.log('='.repeat(60));
  console.log('📊 AUTHENTICATED TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${passedTests}/${endpoints.length} (${Math.round(passedTests/endpoints.length*100)}%)`);
  console.log(`❌ Failed: ${endpoints.length - passedTests}/${endpoints.length}`);
  console.log('='.repeat(60));
  
  return passedTests === endpoints.length;
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Browser Authentication Test Suite\n');
  
  // Show authentication instructions
  showAuthInstructions();
  
  // Wait for user to authenticate
  await waitForAuthentication();
  
  // Check if authentication was successful
  const isAuthenticated = await checkAuthentication();
  
  if (!isAuthenticated) {
    console.log('\n❌ Authentication failed or session not found');
    console.log('💡 Please try again and make sure you complete the GitHub OAuth flow');
    process.exit(1);
  }
  
  // Test authenticated endpoints
  const allTestsPassed = await testAuthenticatedEndpoints();
  
  if (allTestsPassed) {
    console.log('\n🎉 All authenticated tests passed!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some authenticated tests failed');
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Test runner crashed:', error);
    process.exit(1);
  });
}
