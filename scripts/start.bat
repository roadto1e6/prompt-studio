@echo off
chcp 65001 >nul
REM Prompt Studio - 启动脚本 (Windows)

echo ================================
echo Prompt Studio - 一键部署
echo ================================

REM 检查 Docker
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] Docker 未运行，请先启动 Docker Desktop
    pause
    exit /b 1
)

REM 检测 docker compose 命令 (新版本 vs 旧版本)
docker compose version >nul 2>&1
if %errorlevel% equ 0 (
    set DOCKER_COMPOSE=docker compose
) else (
    set DOCKER_COMPOSE=docker-compose
)

REM 检查 .env
if not exist ".env" (
    echo [提示] 未找到 .env，从 .env.example 复制...
    copy .env.example .env >nul
    echo 请编辑 .env 文件配置必要参数后重新运行
    pause
    exit /b 1
)

echo.
echo [1/2] 构建并启动服务...
%DOCKER_COMPOSE% up -d --build

echo.
echo [2/2] 等待服务就绪...
echo (数据库迁移将在后端容器启动时自动执行)
timeout /t 15 /nobreak >nul

echo.
echo ================================
echo 部署完成!
echo ================================
echo.
echo 访问地址:
echo   前端: http://localhost
echo   API:  http://localhost/api
echo.
echo 常用命令:
echo   查看日志: %DOCKER_COMPOSE% logs -f
echo   停止服务: %DOCKER_COMPOSE% down
echo ================================
pause
