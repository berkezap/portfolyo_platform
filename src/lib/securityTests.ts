import { sanitizeString, sanitizeHtml } from './validation'
import { isSuspiciousIP, isSuspiciousUserAgent } from './securityMonitoring'

// Güvenlik testleri
export const securityTests = {
  // XSS koruması testleri
  testXSSProtection: () => {
    const maliciousInputs = [
      '<script>alert("xss")</script>',
      'javascript:alert("xss")',
      'onclick="alert(\'xss\')"',
      '<img src="x" onerror="alert(\'xss\')">',
      '<iframe src="javascript:alert(\'xss\')"></iframe>'
    ]
    
    const results = maliciousInputs.map(input => ({
      input,
      sanitized: sanitizeString(input),
      isClean: !sanitizeString(input).includes('<script>') && 
               !sanitizeString(input).includes('javascript:') &&
               !sanitizeString(input).includes('onclick=')
    }))
    
    return {
      test: 'XSS Protection',
      passed: results.every(r => r.isClean),
      results
    }
  },
  
  // HTML sanitization testleri
  testHTMLSanitization: () => {
    const maliciousHTML = [
      '<script>alert("xss")</script><p>Hello</p>',
      '<iframe src="http://evil.com"></iframe>',
      '<object data="javascript:alert(\'xss\')"></object>',
      '<embed src="javascript:alert(\'xss\')"></embed>'
    ]
    
    const results = maliciousHTML.map(html => ({
      input: html,
      sanitized: sanitizeHtml(html),
      isClean: !sanitizeHtml(html).includes('<script>') &&
               !sanitizeHtml(html).includes('<iframe>') &&
               !sanitizeHtml(html).includes('<object>') &&
               !sanitizeHtml(html).includes('<embed>')
    }))
    
    return {
      test: 'HTML Sanitization',
      passed: results.every(r => r.isClean),
      results
    }
  },
  
  // IP kontrol testleri
  testIPDetection: () => {
    const testIPs = [
      { ip: '127.0.0.1', expected: false, description: 'Localhost' },
      { ip: '192.168.1.1', expected: false, description: 'Private IP' },
      { ip: '10.0.0.1', expected: false, description: 'Private IP' },
      { ip: '8.8.8.8', expected: false, description: 'Public IP' },
      { ip: '1.1.1.1', expected: false, description: 'Public IP' }
    ]
    
    const results = testIPs.map(({ ip, expected, description }) => ({
      ip,
      description,
      expected,
      actual: isSuspiciousIP(ip),
      passed: isSuspiciousIP(ip) === expected
    }))
    
    return {
      test: 'IP Detection',
      passed: results.every(r => r.passed),
      results
    }
  },
  
  // User-Agent kontrol testleri
  testUserAgentDetection: () => {
    const testUserAgents = [
      { ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', expected: false, description: 'Normal browser' },
      { ua: 'curl/7.68.0', expected: true, description: 'Curl bot' },
      { ua: 'python-requests/2.25.1', expected: true, description: 'Python bot' },
      { ua: 'Googlebot/2.1', expected: true, description: 'Google bot' },
      { ua: 'Mozilla/5.0 (compatible; Bingbot/2.0)', expected: true, description: 'Bing bot' }
    ]
    
    const results = testUserAgents.map(({ ua, expected, description }) => ({
      userAgent: ua,
      description,
      expected,
      actual: isSuspiciousUserAgent(ua),
      passed: isSuspiciousUserAgent(ua) === expected
    }))
    
    return {
      test: 'User-Agent Detection',
      passed: results.every(r => r.passed),
      results
    }
  }
}

// Tüm güvenlik testlerini çalıştır
export function runAllSecurityTests() {
  const tests = [
    securityTests.testXSSProtection(),
    securityTests.testHTMLSanitization(),
    securityTests.testIPDetection(),
    securityTests.testUserAgentDetection()
  ]
  
  const summary = {
    totalTests: tests.length,
    passedTests: tests.filter(t => t.passed).length,
    failedTests: tests.filter(t => !t.passed).length,
    tests
  }
  
  console.log('🔒 Security Test Results:', summary)
  
  if (summary.failedTests > 0) {
    console.error('❌ Some security tests failed!')
    tests.filter(t => !t.passed).forEach(test => {
      console.error(`Failed: ${test.test}`, test.results)
    })
  } else {
    console.log('✅ All security tests passed!')
  }
  
  return summary
}

// Development ortamında veya doğrudan çalıştırıldığında testleri çalıştır
if (require.main === module || process.env.NODE_ENV === 'development') {
  runAllSecurityTests()
} 