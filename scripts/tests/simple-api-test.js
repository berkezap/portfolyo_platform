const http = require('http');
const https = require('https');

// Test configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const CONCURRENT_REQUESTS = 5;
const TEST_DURATION = 30; // seconds

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// Test endpoints (public only for now)
const endpoints = [
  { path: '/api/test-db', method: 'GET', name: 'Database Health Check' },
  { path: '/api/sentry-example-api', method: 'GET', name: 'Sentry Test' },
  { path: '/api/auth/session', method: 'GET', name: 'Auth Session' }
];

// Test data for portfolio generation
const portfolioData = JSON.stringify({
  templateName: 'modern-developer',
  selectedRepos: ['test-repo-1'],
  cvUrl: 'https://example.com/cv.pdf'
});

// Helper function to make HTTP requests
function makeRequest(options) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        resolve({
          statusCode: res.statusCode,
          duration: duration,
          data: data,
          headers: res.headers
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.setTimeout(10000); // 10 second timeout
    
    if (options.data) {
      req.write(options.data);
    }
    
    req.end();
  });
}

// Test a single endpoint
async function testEndpoint(endpoint) {
  console.log(`${colors.blue}Testing ${endpoint.name}...${colors.reset}`);
  
  const results = [];
  const promises = [];
  
  // Make concurrent requests
  for (let i = 0; i < CONCURRENT_REQUESTS; i++) {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: endpoint.path,
      method: endpoint.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'PortfolYO-API-Test/1.0',
        // Add authentication headers for protected endpoints
        ...(endpoint.requiresAuth && {
          'Cookie': 'next-auth.session-token=mock-session; next-auth.csrf-token=mock-csrf'
        })
      }
    };
    
    if (endpoint.data) {
      options.headers['Content-Length'] = Buffer.byteLength(endpoint.data);
    }
    
    const promise = makeRequest(options)
      .then(result => {
        results.push(result);
        return result;
      })
      .catch(error => {
        const errorResult = {
          statusCode: 0,
          duration: 0,
          error: error.message
        };
        results.push(errorResult);
        return errorResult;
      });
    
    promises.push(promise);
  }
  
  // Wait for all requests to complete
  await Promise.all(promises);
  
  // Calculate statistics
  const successfulRequests = results.filter(r => r.statusCode === 200 || r.statusCode === 401);
  const failedRequests = results.filter(r => r.statusCode >= 500);
  const errorRequests = results.filter(r => r.error);
  
  const responseTimes = results
    .filter(r => r.duration > 0)
    .map(r => r.duration)
    .sort((a, b) => a - b);
  
  const avgTime = responseTimes.length > 0 
    ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length 
    : 0;
  
  const p95Time = responseTimes.length > 0 
    ? responseTimes[Math.floor(responseTimes.length * 0.95)] 
    : 0;
  
  // Print results
  console.log(`  ${colors.green}✓ Success: ${successfulRequests.length}${colors.reset}`);
  console.log(`  ${colors.red}✗ Errors: ${failedRequests.length + errorRequests.length}${colors.reset}`);
  console.log(`  ${colors.yellow}⏱️  Avg Response Time: ${avgTime.toFixed(2)}ms${colors.reset}`);
  console.log(`  ${colors.yellow}📊 95th Percentile: ${p95Time.toFixed(2)}ms${colors.reset}`);
  console.log(`  ${colors.blue}📈 Success Rate: ${((successfulRequests.length / results.length) * 100).toFixed(1)}%${colors.reset}`);
  console.log('');
  
  return {
    endpoint: endpoint.name,
    totalRequests: results.length,
    successfulRequests: successfulRequests.length,
    failedRequests: failedRequests.length + errorRequests.length,
    avgTime: avgTime,
    p95Time: p95Time,
    successRate: (successfulRequests.length / results.length) * 100
  };
}

// Test portfolio generation (heavier operation)
async function testPortfolioGeneration() {
  console.log(`${colors.blue}Testing Portfolio Generation (Heavy Operation)...${colors.reset}`);
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/portfolio/generate',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(portfolioData),
      'User-Agent': 'PortfolYO-API-Test/1.0'
    }
  };
  
  try {
    const startTime = Date.now();
    const result = await makeRequest(options);
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`  ${colors.green}✓ Status: ${result.statusCode}${colors.reset}`);
    console.log(`  ${colors.yellow}⏱️  Response Time: ${duration}ms${colors.reset}`);
    console.log(`  ${colors.blue}📊 API Response Time: ${result.duration}ms${colors.reset}`);
    console.log('');
    
    return {
      endpoint: 'Portfolio Generation',
      statusCode: result.statusCode,
      duration: duration,
      apiDuration: result.duration
    };
  } catch (error) {
    console.log(`  ${colors.red}✗ Error: ${error.message}${colors.reset}`);
    console.log('');
    return {
      endpoint: 'Portfolio Generation',
      error: error.message
    };
  }
}

// Main test function
async function runTests() {
  console.log(`${colors.blue}🚀 PortfolYO API Performance Test${colors.reset}`);
  console.log(`${colors.blue}📍 Target URL: ${BASE_URL}${colors.reset}`);
  console.log(`${colors.blue}👥 Concurrent Requests: ${CONCURRENT_REQUESTS}${colors.reset}`);
  console.log(`${colors.blue}⏱️  Test Duration: ${TEST_DURATION}s${colors.reset}`);
  console.log('');
  
  const startTime = Date.now();
  const results = [];
  
  // Test each endpoint
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    results.push(result);
  }
  
  // Test portfolio generation
  const generationResult = await testPortfolioGeneration();
  results.push(generationResult);
  
  const endTime = Date.now();
  const totalDuration = endTime - startTime;
  
  // Print summary
  console.log(`${colors.green}📊 Performance Test Summary${colors.reset}`);
  console.log('==================================');
  
  let totalRequests = 0;
  let totalSuccess = 0;
  let totalFailures = 0;
  let avgResponseTime = 0;
  let maxResponseTime = 0;
  
  results.forEach(result => {
    if (result.totalRequests) {
      console.log(`${colors.blue}${result.endpoint}${colors.reset}`);
      console.log(`  Success Rate: ${result.successRate.toFixed(1)}%`);
      console.log(`  Avg Time: ${result.avgTime.toFixed(2)}ms`);
      console.log(`  P95 Time: ${result.p95Time.toFixed(2)}ms`);
      console.log('');
      
      totalRequests += result.totalRequests;
      totalSuccess += result.successfulRequests;
      totalFailures += result.failedRequests;
      avgResponseTime += result.avgTime;
      maxResponseTime = Math.max(maxResponseTime, result.p95Time);
    } else if (result.duration) {
      console.log(`${colors.blue}${result.endpoint}${colors.reset}`);
      console.log(`  Status: ${result.statusCode}`);
      console.log(`  Duration: ${result.duration}ms`);
      console.log('');
    }
  });
  
  // Overall statistics
  console.log(`${colors.yellow}💡 Overall Statistics:${colors.reset}`);
  console.log('====================================');
  console.log(`Total Requests: ${totalRequests}`);
  console.log(`Overall Success Rate: ${((totalSuccess / totalRequests) * 100).toFixed(1)}%`);
  console.log(`Average Response Time: ${(avgResponseTime / results.length).toFixed(2)}ms`);
  console.log(`Maximum P95 Response Time: ${maxResponseTime.toFixed(2)}ms`);
  console.log(`Test Duration: ${totalDuration}ms`);
  
  // Performance recommendations
  console.log('');
  console.log(`${colors.yellow}💡 Performance Recommendations:${colors.reset}`);
  console.log('====================================');
  
  results.forEach(result => {
    if (result.avgTime > 1000) {
      console.log(`⚠️  ${result.endpoint} is slow (${result.avgTime.toFixed(2)}ms avg) - consider optimization`);
    }
    if (result.p95Time > 2000) {
      console.log(`⚠️  ${result.endpoint} has high latency (${result.p95Time.toFixed(2)}ms p95) - check for bottlenecks`);
    }
    if (result.successRate < 80) {
      console.log(`⚠️  ${result.endpoint} has low success rate (${result.successRate.toFixed(1)}%) - investigate errors`);
    }
  });
  
  console.log('');
  console.log(`${colors.green}✅ Performance test completed!${colors.reset}`);
}

// Run the tests
runTests().catch(console.error); 