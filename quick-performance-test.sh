#!/bin/bash

# PortfolYO API Quick Performance Test
# This script provides a quick way to test API performance without k6

BASE_URL=${1:-"http://localhost:3000"}
TEST_DURATION=${2:-30}  # seconds
CONCURRENT_USERS=${3:-10}

echo "🚀 PortfolYO API Quick Performance Test"
echo "📍 Target URL: $BASE_URL"
echo "⏱️  Test Duration: ${TEST_DURATION}s"
echo "👥 Concurrent Users: $CONCURRENT_USERS"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test endpoints
ENDPOINTS=(
    "/api/test-db"
    "/api/portfolio/list"
    "/api/github/repos"
    "/api/upload/cv"
)

# Test data for POST requests
PORTFOLIO_DATA='{
    "templateName": "modern-developer",
    "selectedRepos": ["test-repo-1"],
    "cvUrl": "https://example.com/cv.pdf"
}'

UPLOAD_DATA='{
    "fileName": "test-cv.pdf",
    "fileType": "application/pdf"
}'

# Function to test an endpoint
test_endpoint() {
    local endpoint=$1
    local method=${2:-GET}
    local data=${3:-""}
    
    local start_time=$(date +%s%N)
    
    if [ "$method" = "POST" ]; then
        response=$(curl -s -w "%{http_code}|%{time_total}" -X POST \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$BASE_URL$endpoint" 2>/dev/null)
    else
        response=$(curl -s -w "%{http_code}|%{time_total}" \
            "$BASE_URL$endpoint" 2>/dev/null)
    fi
    
    local end_time=$(date +%s%N)
    local duration=$(( (end_time - start_time) / 1000000 ))  # Convert to milliseconds
    if [ "$duration" -lt 0 ]; then
        duration=0
    fi
    
    echo "$response|$duration"
}

# Function to run concurrent tests
run_concurrent_test() {
    local endpoint=$1
    local method=${2:-GET}
    local data=${3:-""}
    local count=$4
    
    local results=()
    local pids=()
    
    echo -e "${BLUE}Testing $method $endpoint with $count concurrent requests...${NC}"
    
    for i in $(seq 1 $count); do
        (
            result=$(test_endpoint "$endpoint" "$method" "$data")
            echo "$result" > "/tmp/test_result_$i"
        ) &
        pids+=($!)
    done
    
    # Wait for all processes to complete
    for pid in "${pids[@]}"; do
        wait $pid
    done
    
    # Collect results
    local total_time=0
    local success_count=0
    local error_count=0
    local response_times=()
    
    for i in $(seq 1 $count); do
        if [ -f "/tmp/test_result_$i" ]; then
            result=$(cat "/tmp/test_result_$i")
            rm "/tmp/test_result_$i"
            
            IFS='|' read -r status_code curl_time duration <<< "$result"
            
            response_times+=($duration)
            total_time=$((total_time + duration))
            
            if [ "$status_code" = "200" ] || [ "$status_code" = "401" ]; then
                success_count=$((success_count + 1))
            else
                error_count=$((error_count + 1))
            fi
        fi
    done
    
    # Calculate statistics
    local avg_time=$((total_time / count))
    local sorted_times=($(printf '%s\n' "${response_times[@]}" | sort -n))
    local p95_index=$((count * 95 / 100))
    local p95_time=${sorted_times[$p95_index]}
    
    echo -e "  ${GREEN}✓ Success: $success_count${NC}"
    echo -e "  ${RED}✗ Errors: $error_count${NC}"
    echo -e "  ${YELLOW}⏱️  Avg Response Time: ${avg_time}ms${NC}"
    echo -e "  ${YELLOW}📊 95th Percentile: ${p95_time}ms${NC}"
    echo ""
    
    # Store results for summary
    echo "$endpoint|$method|$success_count|$error_count|$avg_time|$p95_time" >> /tmp/performance_summary
}

# Main test execution
echo -e "${BLUE}Starting performance tests...${NC}"
echo ""

# Clear previous results
rm -f /tmp/performance_summary

# Test each endpoint
for endpoint in "${ENDPOINTS[@]}"; do
    case $endpoint in
        "/api/upload/cv")
            run_concurrent_test "$endpoint" "POST" "$UPLOAD_DATA" $CONCURRENT_USERS
            ;;
        *)
            run_concurrent_test "$endpoint" "GET" "" $CONCURRENT_USERS
            ;;
    esac
done

# Run portfolio generation test (heavier operation)
echo -e "${BLUE}Testing portfolio generation (heavy operation)...${NC}"
run_concurrent_test "/api/portfolio/generate" "POST" "$PORTFOLIO_DATA" $((CONCURRENT_USERS / 2))

# Summary
echo -e "${GREEN}📊 Performance Test Summary${NC}"
echo "=================================="

if [ -f /tmp/performance_summary ]; then
    while IFS='|' read -r endpoint method success error avg_time p95_time; do
        echo -e "${BLUE}$method $endpoint${NC}"
        echo -e "  Success Rate: $((success * 100 / (success + error)))%"
        echo -e "  Avg Time: ${avg_time}ms"
        echo -e "  P95 Time: ${p95_time}ms"
        echo ""
    done < /tmp/performance_summary
    
    rm /tmp/performance_summary
fi

# Performance recommendations
echo -e "${YELLOW}💡 Performance Recommendations:${NC}"
echo "======================================"

# Check if any endpoints are slow
if [ -f /tmp/performance_summary ]; then
    while IFS='|' read -r endpoint method success error avg_time p95_time; do
        if [ "$avg_time" -gt 1000 ]; then
            echo -e "⚠️  $endpoint is slow (${avg_time}ms avg) - consider optimization"
        fi
        if [ "$p95_time" -gt 2000 ]; then
            echo -e "⚠️  $endpoint has high latency (${p95_time}ms p95) - check for bottlenecks"
        fi
    done < /tmp/performance_summary
fi

echo -e "${GREEN}✅ Performance test completed!${NC}" 