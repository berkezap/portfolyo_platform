import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

// Test configuration
export const options = {
  stages: [
    { duration: '2m', target: 10 }, // Ramp up
    { duration: '5m', target: 10 }, // Steady load
    { duration: '2m', target: 50 }, // Spike test
    { duration: '5m', target: 50 }, // High load
    { duration: '2m', target: 0 },  // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% of requests must complete below 1s
    http_req_failed: ['rate<0.1'],     // Error rate must be below 10%
    errors: ['rate<0.1'],
  },
};

// Test data
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const TEST_USER_EMAIL = 'test@example.com';

// Helper functions
function getAuthHeaders() {
  // Demo mode için basit headers
  return {
    'Content-Type': 'application/json',
    'X-Demo-Mode': 'true' // Demo mode header
  };
}

function generatePortfolioData() {
  return {
    templateName: 'modern-developer',
    selectedRepos: ['test-repo-1', 'test-repo-2'],
    cvUrl: 'https://example.com/cv.pdf',
    userBio: 'Test bio',
    userEmail: TEST_USER_EMAIL,
    linkedinUrl: 'https://linkedin.com/in/testuser'
  };
}

// Test scenarios
export default function() {
  const headers = getAuthHeaders();
  
  // 1. Test portfolio list endpoint
  const listResponse = http.get(`${BASE_URL}/api/portfolio/list`, { headers });
  check(listResponse, {
    'portfolio list status is 200 or 401': (r) => r.status === 200 || r.status === 401,
    'portfolio list response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  // 2. Test GitHub repos endpoint
  const reposResponse = http.get(`${BASE_URL}/api/github/repos`, { headers });
  check(reposResponse, {
    'github repos status is 200 or 401': (r) => r.status === 200 || r.status === 401,
    'github repos response time < 2000ms': (r) => r.timings.duration < 2000,
  });
  
  // 3. Test portfolio generation (heavy operation)
  if (Math.random() < 0.1) { // 10% of requests
    const portfolioData = generatePortfolioData();
    const generateResponse = http.post(
      `${BASE_URL}/api/portfolio/generate`,
      JSON.stringify(portfolioData),
      { headers }
    );
    check(generateResponse, {
      'portfolio generation status is 200 or 401': (r) => r.status === 200 || r.status === 401,
      'portfolio generation response time < 10000ms': (r) => r.timings.duration < 10000,
    });
  }
  
  // 4. Test database health check
  const dbResponse = http.get(`${BASE_URL}/api/test-db`);
  check(dbResponse, {
    'database test status is 200': (r) => r.status === 200,
    'database test response time < 200ms': (r) => r.timings.duration < 200,
  });
  
  // 5. Test CV upload URL generation
  if (Math.random() < 0.05) { // 5% of requests
    const uploadData = {
      fileName: 'test-cv.pdf',
      fileType: 'application/pdf'
    };
    const uploadResponse = http.post(
      `${BASE_URL}/api/upload/cv`,
      JSON.stringify(uploadData),
      { headers }
    );
    check(uploadResponse, {
      'upload url status is 200 or 401': (r) => r.status === 200 || r.status === 401,
      'upload url response time < 1000ms': (r) => r.timings.duration < 1000,
    });
  }
  
  // Record errors
  errorRate.add(
    listResponse.status >= 400 || 
    reposResponse.status >= 400 || 
    dbResponse.status >= 400
  );
  
  sleep(1);
}

// Setup function for test initialization
export function setup() {
  console.log('🚀 Starting PortfolYO API Load Test');
  console.log(`📍 Target URL: ${BASE_URL}`);
  console.log('📊 Test Configuration:');
  console.log('  - Ramp up: 2 minutes to 10 users');
  console.log('  - Steady load: 5 minutes at 10 users');
  console.log('  - Spike test: 2 minutes to 50 users');
  console.log('  - High load: 5 minutes at 50 users');
  console.log('  - Ramp down: 2 minutes to 0 users');
  console.log('📈 Performance Targets:');
  console.log('  - 95% of requests < 1000ms');
  console.log('  - Error rate < 10%');
  console.log('  - Portfolio generation < 10s');
  console.log('  - GitHub repos < 2s');
  console.log('  - Database test < 200ms');
}

// Teardown function
export function teardown(data) {
  console.log('✅ PortfolYO API Load Test Completed');
  console.log('📊 Final Results:');
  if (data && data.metrics) {
    console.log(`  - Total requests: ${data.metrics.http_reqs.values.count}`);
    console.log(`  - Average response time: ${data.metrics.http_req_duration.values.avg}ms`);
    console.log(`  - 95th percentile: ${data.metrics.http_req_duration.values['p(95)']}ms`);
    console.log(`  - Error rate: ${(data.metrics.http_req_failed.values.rate * 100).toFixed(2)}%`);
  } else {
    console.log('  - Test completed (metrics not available)');
  }
} 