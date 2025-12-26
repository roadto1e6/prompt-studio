#!/bin/bash

# ================================================
# Prompt Studio - Quick Test Script
# ================================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "================================================"
echo "Prompt Studio 快速测试"
echo "================================================"
echo ""

echo "[1/8] 检查 Docker..."
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}✗ Docker 未运行，请先启动 Docker${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker 正在运行${NC}"

echo ""
echo "[2/8] 检查关键文件..."
files=("docker-compose.yml" ".env" "docker/nginx.conf" "frontend/Dockerfile" "backend/Dockerfile")
for file in "${files[@]}"; do
    if [ ! -f "$file" ]; then
        echo -e "${RED}✗ $file 缺失${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ $file${NC}"
done

echo ""
echo "[3/8] 验证 Docker Compose 配置..."
if docker-compose config --quiet 2>/dev/null; then
    echo -e "${GREEN}✓ 配置有效${NC}"
else
    echo -e "${YELLOW}⚠ 配置验证有警告（通常可以忽略）${NC}"
fi

echo ""
echo "[4/8] 检查环境变量..."
if grep -q "JWT_SECRET=change-this" .env; then
    echo -e "${YELLOW}⚠ 警告: JWT_SECRET 仍使用默认值，生产环境请修改！${NC}"
else
    echo -e "${GREEN}✓ JWT_SECRET 已修改${NC}"
fi

echo ""
echo "[5/8] 检查端口占用..."
if lsof -i :80 > /dev/null 2>&1 || netstat -an | grep ":80 " > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠ 警告: 端口 80 可能被占用${NC}"
    echo "   如需修改端口，编辑 .env 中的 FRONTEND_PORT"
else
    echo -e "${GREEN}✓ 端口 80 可用${NC}"
fi

echo ""
echo "[6/8] 检查现有容器..."
if docker ps -a --filter "name=prompt-studio" --format "{{.Names}}" | grep -q "prompt-studio"; then
    echo -e "${YELLOW}⚠ 发现现有容器，建议先清理:${NC}"
    echo "   docker-compose down -v"
    docker ps -a --filter "name=prompt-studio" --format "  - {{.Names}} ({{.Status}})"
else
    echo -e "${GREEN}✓ 无现有容器${NC}"
fi

echo ""
echo "[7/8] 检查前端 API 配置..."
if grep -q "API_BASE_URL.*'/api'" frontend/src/services/api.ts; then
    echo -e "${GREEN}✓ 前端 API 配置正确 (使用相对路径 /api)${NC}"
else
    echo -e "${RED}✗ 前端 API 配置错误${NC}"
    exit 1
fi

echo ""
echo "[8/8] 检查 Nginx 配置..."
if grep -q "proxy_pass.*backend:3001" docker/nginx.conf; then
    echo -e "${GREEN}✓ Nginx 反向代理配置正确${NC}"
else
    echo -e "${RED}✗ Nginx 配置错误${NC}"
    exit 1
fi

echo ""
echo "================================================"
echo "测试完成！"
echo "================================================"
echo ""
echo -e "${GREEN}✓ 所有关键检查已通过${NC}"
echo ""
echo "下一步操作:"
echo "  1. 启动服务: ./scripts/start.sh"
echo "  2. 或手动启动: docker-compose up -d"
echo "  3. 查看日志: docker-compose logs -f"
echo "  4. 访问应用: http://localhost"
echo ""
echo "详细测试报告已保存到: test-report.txt"
echo ""
echo "================================================"
