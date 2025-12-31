#!/bin/bash
# Prompt Studio - 启动脚本 (Linux/Mac)

set -e

echo "================================"
echo "Prompt Studio - 一键部署"
echo "================================"

# 检查 Docker
if ! docker info > /dev/null 2>&1; then
    echo "[错误] Docker 未运行，请先启动 Docker"
    exit 1
fi

# 检测 docker compose 命令 (新版本 vs 旧版本)
if docker compose version > /dev/null 2>&1; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

# 检查 .env
if [ ! -f ".env" ]; then
    echo "[提示] 未找到 .env，从 .env.example 复制..."
    cp .env.example .env
    echo "请编辑 .env 文件配置必要参数后重新运行"
    exit 1
fi

echo ""
echo "[1/2] 构建并启动服务..."
$DOCKER_COMPOSE up -d --build

echo ""
echo "[2/2] 等待服务就绪..."
echo "(数据库迁移将在后端容器启动时自动执行)"
sleep 15

echo ""
echo "================================"
echo "部署完成!"
echo "================================"
echo ""
echo "访问地址:"
echo "  前端: http://localhost"
echo "  API:  http://localhost/api"
echo ""
echo "常用命令:"
echo "  查看日志: $DOCKER_COMPOSE logs -f"
echo "  停止服务: $DOCKER_COMPOSE down"
echo "================================"
