import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const failureRate = new Rate('failures');

// Chaos testing configuration
export const options = {
  stages: [
    { duration: '1m', target: 5 },   // Normal load
    { duration: '2m', target: 20 },  // Increased load
    { duration: '1m', target: 5 },   // Back to normal
  ],
  thresholds: {
    failures: ['rate<0.3'], // Allow up to 30% failure rate during chaos
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// Chaos scenarios
function simulateNetworkLatency() {
  // Simulate network delays
  const delay = Math.random() * 2000; // 0-2 seconds
  sleep(delay / 1000);
}

function simulateIntermittentFailures() {
  // Simulate random failures
  if (Math.random() < 0.1) { // 10% chance of failure
    throw new Error('Simulated network failure');
  }
}

function testRateLimiting() {
  // Rapid-fire requests to test rate limiting
  const headers = { 'Content-Type': 'application/json' };
  
  for (let i = 0; i < 10; i++) {
    const response = http.get(`${BASE_URL}/api/github/repos`, { headers });
    
    check(response, {
      'rate limit handled gracefully': (r) => {
        return r.status === 200 || r.status === 401 || r.status === 429;
      },
    });
    
    failureRate.add(response.status >= 500);
  }
}

function testDatabaseConnectionDrops() {
  // Test database health endpoint under stress
  const responses = [];
  
  for (let i = 0; i < 5; i++) {
    const response = http.get(`${BASE_URL}/api/test-db`);
    responses.push(response);
    sleep(0.1);
  }
  
  const successCount = responses.filter(r => r.status === 200).length;
  const failureCount = responses.filter(r => r.status >= 500).length;
  
  check(responses, {
    'database remains mostly available': () => successCount >= 3,
    'database failures are handled gracefully': () => failureCount <= 2,
  });
}

function testConcurrentPortfolioGeneration() {
  // Test heavy operations under concurrent load
  const headers = { 'Content-Type': 'application/json' };
  const portfolioData = {
    templateName: 'modern-developer',
    selectedRepos: ['test-repo-1'],
    cvUrl: 'https://example.com/cv.pdf'
  };
  
  const promises = [];
  
  for (let i = 0; i < 3; i++) {
    const response = http.post(
      `${BASE_URL}/api/portfolio/generate`,
      JSON.stringify(portfolioData),
      { headers }
    );
    
    check(response, {
      'concurrent generation handled': (r) => {
        return r.status === 200 || r.status === 401 || r.status === 429;
      },
      'generation timeout handled': (r) => r.timings.duration < 30000,
    });
    
    failureRate.add(response.status >= 500);
  }
}

function testCacheInvalidation() {
  // Test cache behavior under load
  const headers = { 'Content-Type': 'application/json' };
  
  // Make multiple requests to the same endpoint
  const responses = [];
  
  for (let i = 0; i < 5; i++) {
    const response = http.get(`${BASE_URL}/api/portfolio/list`, { headers });
    responses.push(response);
    sleep(0.2);
  }
  
  // Check if response times are consistent (indicating caching)
  const responseTimes = responses.map(r => r.timings.duration);
  const avgTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
  const variance = responseTimes.reduce((acc, time) => acc + Math.pow(time - avgTime, 2), 0) / responseTimes.length;
  
  check(responses, {
    'cache provides consistent performance': () => variance < 10000, // Low variance indicates caching
    'all requests completed': () => responses.every(r => r.status === 200 || r.status === 401),
  });
}

function testErrorPropagation() {
  // Test how errors are propagated
  const headers = { 'Content-Type': 'application/json' };
  
  // Test with invalid data
  const invalidData = {
    templateName: '', // Invalid template
    selectedRepos: [], // Empty repos
  };
  
  const response = http.post(
    `${BASE_URL}/api/portfolio/generate`,
    JSON.stringify(invalidData),
    { headers }
  );
  
  check(response, {
    'invalid data handled gracefully': (r) => r.status === 400 || r.status === 401,
    'error message provided': (r) => {
      if (r.status >= 400) {
        const body = JSON.parse(r.body);
        return body.error && body.error.length > 0;
      }
      return true;
    },
  });
}

// Main test function
export default function() {
  try {
    // Simulate network issues
    simulateNetworkLatency();
    
    // Simulate intermittent failures
    simulateIntermittentFailures();
    
    // Test rate limiting
    if (Math.random() < 0.2) {
      testRateLimiting();
    }
    
    // Test database connection drops
    if (Math.random() < 0.3) {
      testDatabaseConnectionDrops();
    }
    
    // Test concurrent portfolio generation
    if (Math.random() < 0.1) {
      testConcurrentPortfolioGeneration();
    }
    
    // Test cache invalidation
    if (Math.random() < 0.2) {
      testCacheInvalidation();
    }
    
    // Test error propagation
    if (Math.random() < 0.15) {
      testErrorPropagation();
    }
    
    // Normal API calls
    const headers = { 'Content-Type': 'application/json' };
    
    const listResponse = http.get(`${BASE_URL}/api/portfolio/list`, { headers });
    const dbResponse = http.get(`${BASE_URL}/api/test-db`);
    
    check([listResponse, dbResponse], {
      'basic functionality maintained': (responses) => {
        return responses.every(r => r.status === 200 || r.status === 401);
      },
    });
    
    failureRate.add(listResponse.status >= 500 || dbResponse.status >= 500);
    
  } catch (error) {
    console.log('Chaos test error:', error.message);
    failureRate.add(true);
  }
  
  sleep(1);
}

// Setup function
export function setup() {
  console.log('🌪️ Starting PortfolYO Chaos Testing');
  console.log(`📍 Target URL: ${BASE_URL}`);
  console.log('🔥 Chaos Scenarios:');
  console.log('  - Network Latency Simulation');
  console.log('  - Intermittent Failures');
  console.log('  - Rate Limiting Stress Test');
  console.log('  - Database Connection Drops');
  console.log('  - Concurrent Portfolio Generation');
  console.log('  - Cache Invalidation Testing');
  console.log('  - Error Propagation Testing');
  console.log('📊 Resilience Targets:');
  console.log('  - Failure rate < 30% during chaos');
  console.log('  - Graceful degradation under load');
  console.log('  - Proper error handling');
  console.log('  - Cache consistency');
}

// Teardown function
export function teardown(data) {
  console.log('✅ PortfolYO Chaos Testing Completed');
  console.log('📊 Chaos Test Results:');
  if (data && data.metrics) {
    console.log(`  - Total requests: ${data.metrics.http_reqs.values.count}`);
    console.log(`  - Failure rate: ${(data.metrics.failures.values.rate * 100).toFixed(2)}%`);
    console.log(`  - Average response time: ${data.metrics.http_req_duration.values.avg}ms`);
    console.log(`  - 95th percentile: ${data.metrics.http_req_duration.values['p(95)']}ms`);
    
    if (data.metrics.failures.values.rate < 0.3) {
      console.log('🎉 System showed good resilience under chaos!');
    } else {
      console.log('⚠️ System needs improvement in chaos handling');
    }
  } else {
    console.log('  - Test completed (metrics not available)');
  }
} 