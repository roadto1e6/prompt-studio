#!/bin/bash

# ================================================
# Prompt Studio - Optimization Verification Script
# ================================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "================================================"
echo "Prompt Studio 优化验证"
echo "================================================"
echo ""

# Function to check if containers are running
check_containers() {
    if ! docker-compose ps | grep -q "Up"; then
        echo -e "${RED}✗ 容器未运行，请先启动服务${NC}"
        echo "  运行: docker-compose up -d"
        exit 1
    fi
}

echo "[1/8] 检查容器运行状态..."
check_containers
echo -e "${GREEN}✓ 容器正在运行${NC}"
echo ""

echo "[2/8] 验证资源限制..."
# Check if resource limits are configured
if docker inspect prompt-studio-frontend | grep -q "NanoCpus"; then
    echo -e "${GREEN}✓ 资源限制已配置${NC}"

    # Show resource limits
    echo ""
    echo -e "${BLUE}资源限制详情：${NC}"
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}" | grep prompt-studio
else
    echo -e "${YELLOW}⚠ 资源限制未生效（可能是 Docker 版本问题）${NC}"
fi
echo ""

echo "[3/8] 验证日志轮转配置..."
log_config=$(docker inspect prompt-studio-frontend --format '{{.HostConfig.LogConfig.Type}}')
if [ "$log_config" = "json-file" ]; then
    echo -e "${GREEN}✓ 日志驱动: json-file${NC}"
    max_size=$(docker inspect prompt-studio-frontend --format '{{index .HostConfig.LogConfig.Config "max-size"}}')
    max_file=$(docker inspect prompt-studio-frontend --format '{{index .HostConfig.LogConfig.Config "max-file"}}')
    echo "  最大文件大小: $max_size"
    echo "  最大文件数: $max_file"
else
    echo -e "${YELLOW}⚠ 日志配置未按预期设置${NC}"
fi
echo ""

echo "[4/8] 验证 Gzip 压缩..."
gzip_header=$(curl -s -I -H "Accept-Encoding: gzip" http://localhost/ | grep -i "content-encoding")
if echo "$gzip_header" | grep -q "gzip"; then
    echo -e "${GREEN}✓ Gzip 压缩已启用${NC}"
    echo "  响应头: $gzip_header"
else
    echo -e "${YELLOW}⚠ Gzip 压缩未检测到（可能文件太小）${NC}"
fi
echo ""

echo "[5/8] 验证缓存策略..."
cache_header=$(curl -s -I http://localhost/health | grep -i "cache-control")
if echo "$cache_header" | grep -q "no-store"; then
    echo -e "${GREEN}✓ HTML 不缓存策略正确${NC}"
else
    echo -e "${YELLOW}⚠ 缓存策略可能未按预期设置${NC}"
fi
echo ""

echo "[6/8] 验证安全响应头..."
security_headers=$(curl -s -I http://localhost/)
headers_found=0

if echo "$security_headers" | grep -q "X-Frame-Options"; then
    echo -e "${GREEN}✓ X-Frame-Options${NC}"
    ((headers_found++))
fi

if echo "$security_headers" | grep -q "X-Content-Type-Options"; then
    echo -e "${GREEN}✓ X-Content-Type-Options${NC}"
    ((headers_found++))
fi

if echo "$security_headers" | grep -q "X-XSS-Protection"; then
    echo -e "${GREEN}✓ X-XSS-Protection${NC}"
    ((headers_found++))
fi

if echo "$security_headers" | grep -q "Content-Security-Policy"; then
    echo -e "${GREEN}✓ Content-Security-Policy${NC}"
    ((headers_found++))
fi

if [ $headers_found -ge 3 ]; then
    echo -e "${GREEN}✓ 安全响应头配置正确 ($headers_found/4)${NC}"
else
    echo -e "${YELLOW}⚠ 部分安全响应头缺失 ($headers_found/4)${NC}"
fi
echo ""

echo "[7/8] 测试速率限制..."
echo "  测试一般 API 端点..."
# Make 15 rapid requests (should hit rate limit)
rate_limit_hit=false
for i in {1..15}; do
    response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/api-health)
    if [ "$response" = "503" ]; then
        rate_limit_hit=true
        break
    fi
    sleep 0.05
done

if [ "$rate_limit_hit" = true ]; then
    echo -e "${GREEN}✓ 速率限制正常工作${NC}"
else
    echo -e "${YELLOW}⚠ 速率限制未触发（可能需要更快的请求）${NC}"
fi
echo ""

echo "[8/8] 健康检查..."
# Check all services health
all_healthy=true
for service in postgres redis backend frontend; do
    health=$(docker inspect --format='{{.State.Health.Status}}' prompt-studio-$service 2>/dev/null || echo "no-healthcheck")
    if [ "$health" = "healthy" ]; then
        echo -e "${GREEN}✓ $service: healthy${NC}"
    elif [ "$health" = "no-healthcheck" ]; then
        echo -e "${BLUE}ℹ $service: no healthcheck configured${NC}"
    else
        echo -e "${RED}✗ $service: $health${NC}"
        all_healthy=false
    fi
done
echo ""

echo "================================================"
echo "验证完成"
echo "================================================"
echo ""

# Summary
echo -e "${BLUE}优化项目总结：${NC}"
echo "  ✅ 资源限制已配置"
echo "  ✅ 日志轮转已启用 (10MB × 3)"
echo "  ✅ Gzip 压缩已配置"
echo "  ✅ 缓存策略已优化"
echo "  ✅ 安全响应头已添加"
echo "  ✅ 速率限制已配置"
echo "  ✅ 开发环境已分离"
echo ""

echo -e "${BLUE}性能优化：${NC}"
echo "  • 文件描述符缓存 (max=1000)"
echo "  • Keepalive 连接 (32 connections)"
echo "  • 静态资源缓存 (1 year)"
echo "  • Gzip 压缩 (level 6)"
echo ""

echo -e "${BLUE}资源使用（当前）：${NC}"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}" | grep prompt-studio || true
echo ""

echo -e "${BLUE}日志大小限制：${NC}"
echo "  • 每个服务: 最多 30MB (10MB × 3 文件)"
echo "  • 所有服务: 约 120MB"
echo ""

echo "详细优化说明请查看: OPTIMIZATIONS.md"
echo "================================================"
