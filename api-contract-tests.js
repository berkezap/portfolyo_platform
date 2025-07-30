import http from 'k6/http';
import { check } from 'k6';

// Contract validation tests
export const options = {
  vus: 1,
  duration: '30s',
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// Schema validators
function validatePortfolioListResponse(response) {
  const body = JSON.parse(response.body);
  
  return check(body, {
    'has success field': (data) => typeof data.success === 'boolean',
    'has portfolios array': (data) => Array.isArray(data.portfolios),
    'has count field': (data) => typeof data.count === 'number',
    'portfolio items have required fields': (data) => {
      if (!data.portfolios || data.portfolios.length === 0) return true;
      const portfolio = data.portfolios[0];
      return (
        typeof portfolio.id === 'string' &&
        typeof portfolio.template === 'string' &&
        Array.isArray(portfolio.selectedRepos) &&
        typeof portfolio.createdAt === 'string'
      );
    }
  });
}

function validateGitHubReposResponse(response) {
  const body = JSON.parse(response.body);
  
  return check(body, {
    'has repos array': (data) => Array.isArray(data.repos),
    'has success field': (data) => typeof data.success === 'boolean',
    'has count field': (data) => typeof data.count === 'number',
    'repo items have required fields': (data) => {
      if (!data.repos || data.repos.length === 0) return true;
      const repo = data.repos[0];
      return (
        typeof repo.id === 'number' &&
        typeof repo.name === 'string' &&
        typeof repo.html_url === 'string' &&
        typeof repo.stargazers_count === 'number'
      );
    }
  });
}

function validatePortfolioGenerationResponse(response) {
  const body = JSON.parse(response.body);
  
  return check(body, {
    'has success field': (data) => typeof data.success === 'boolean',
    'has portfolio object': (data) => typeof data.portfolio === 'object',
    'portfolio has required fields': (data) => {
      if (!data.portfolio) return false;
      return (
        typeof data.portfolio.id === 'string' &&
        typeof data.portfolio.selected_template === 'string' &&
        Array.isArray(data.portfolio.selected_repos)
      );
    }
  });
}

function validateErrorResponse(response) {
  const body = JSON.parse(response.body);
  
  return check(body, {
    'has error field': (data) => typeof data.error === 'string',
    'error message is not empty': (data) => data.error.length > 0,
    'has appropriate status code': (response) => response.status >= 400
  });
}

// Test scenarios
export default function() {
  const headers = {
    'Content-Type': 'application/json',
    'X-Demo-Mode': 'true' // Demo mode header
  };

  // 1. Test portfolio list contract
  const listResponse = http.get(`${BASE_URL}/api/portfolio/list`, { headers });
  
  if (listResponse.status === 200) {
    validatePortfolioListResponse(listResponse);
  } else if (listResponse.status === 401) {
    validateErrorResponse(listResponse);
  } else {
    check(listResponse, {
      'unexpected status code': (r) => false,
    });
  }

  // 2. Test GitHub repos contract
  const reposResponse = http.get(`${BASE_URL}/api/github/repos`, { headers });
  
  if (reposResponse.status === 200) {
    validateGitHubReposResponse(reposResponse);
  } else if (reposResponse.status === 401) {
    validateErrorResponse(reposResponse);
  } else {
    check(reposResponse, {
      'unexpected status code': (r) => false,
    });
  }

  // 3. Test portfolio generation contract
  const portfolioData = {
    templateName: 'modern-developer',
    selectedRepos: ['test-repo-1'],
    cvUrl: 'https://example.com/cv.pdf'
  };
  
  const generateResponse = http.post(
    `${BASE_URL}/api/portfolio/generate`,
    JSON.stringify(portfolioData),
    { headers }
  );
  
  if (generateResponse.status === 200) {
    validatePortfolioGenerationResponse(generateResponse);
  } else if (generateResponse.status === 401 || generateResponse.status === 400) {
    validateErrorResponse(generateResponse);
  } else {
    check(generateResponse, {
      'unexpected status code': (r) => false,
    });
  }

  // 4. Test database health check contract
  const dbResponse = http.get(`${BASE_URL}/api/test-db`);
  
  check(dbResponse, {
    'database test has status field': (r) => {
      const body = JSON.parse(r.body);
      return typeof body.status === 'string';
    },
    'database test has message field': (r) => {
      const body = JSON.parse(r.body);
      return typeof body.message === 'string';
    }
  });

  // 5. Test CV upload contract
  const uploadData = {
    fileName: 'test-cv.pdf',
    fileType: 'application/pdf'
  };
  
  const uploadResponse = http.post(
    `${BASE_URL}/api/upload/cv`,
    JSON.stringify(uploadData),
    { headers }
  );
  
  if (uploadResponse.status === 200) {
    const body = JSON.parse(uploadResponse.body);
    check(body, {
      'has uploadUrl field': (data) => typeof data.uploadUrl === 'string',
      'has publicUrl field': (data) => typeof data.publicUrl === 'string',
      'uploadUrl is valid URL': (data) => data.uploadUrl.startsWith('http'),
      'publicUrl is valid URL': (data) => data.publicUrl.startsWith('http')
    });
  } else if (uploadResponse.status === 401) {
    validateErrorResponse(uploadResponse);
  }

  // 6. Test portfolio detail contract
  const detailResponse = http.get(`${BASE_URL}/api/portfolio/test-id`, { headers });
  
  if (detailResponse.status === 200) {
    const body = JSON.parse(detailResponse.body);
    check(body, {
      'has success field': (data) => typeof data.success === 'boolean',
      'has portfolio object': (data) => typeof data.portfolio === 'object',
      'portfolio has id field': (data) => typeof data.portfolio.id === 'string'
    });
  } else if (detailResponse.status === 404) {
    validateErrorResponse(detailResponse);
  }
}

// Setup function
export function setup() {
  console.log('📋 Starting PortfolYO API Contract Tests');
  console.log(`📍 Target URL: ${BASE_URL}`);
  console.log('🔍 Testing API Contracts:');
  console.log('  - Portfolio List Response Schema');
  console.log('  - GitHub Repos Response Schema');
  console.log('  - Portfolio Generation Response Schema');
  console.log('  - Error Response Schema');
  console.log('  - Database Health Check Schema');
  console.log('  - CV Upload Response Schema');
  console.log('  - Portfolio Detail Response Schema');
}

// Teardown function
export function teardown(data) {
  console.log('✅ PortfolYO API Contract Tests Completed');
  console.log('📊 Contract Validation Results:');
  if (data && data.metrics && data.metrics.checks) {
    console.log(`  - Total checks: ${data.metrics.checks.values.count}`);
    console.log(`  - Passed checks: ${data.metrics.checks.values.passes}`);
    console.log(`  - Failed checks: ${data.metrics.checks.values.fails}`);
    console.log(`  - Success rate: ${((data.metrics.checks.values.passes / data.metrics.checks.values.count) * 100).toFixed(2)}%`);
  } else {
    console.log('  - Test completed (metrics not available)');
  }
} 