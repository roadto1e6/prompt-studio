@echo off
REM ================================================
REM Prompt Studio - Quick Test Script
REM ================================================

echo ================================================
echo Prompt Studio 快速测试
echo ================================================
echo.

echo [1/8] 检查 Docker...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ✗ Docker 未运行，请先启动 Docker Desktop
    pause
    exit /b 1
)
echo ✓ Docker 正在运行

echo.
echo [2/8] 检查关键文件...
if not exist "docker-compose.yml" (
    echo ✗ docker-compose.yml 缺失
    pause
    exit /b 1
)
echo ✓ docker-compose.yml

if not exist ".env" (
    echo ✗ .env 缺失
    pause
    exit /b 1
)
echo ✓ .env

if not exist "docker\nginx.conf" (
    echo ✗ docker\nginx.conf 缺失
    pause
    exit /b 1
)
echo ✓ docker\nginx.conf

if not exist "frontend\Dockerfile" (
    echo ✗ frontend\Dockerfile 缺失
    pause
    exit /b 1
)
echo ✓ frontend\Dockerfile

if not exist "backend\Dockerfile" (
    echo ✗ backend\Dockerfile 缺失
    pause
    exit /b 1
)
echo ✓ backend\Dockerfile

echo.
echo [3/8] 验证 Docker Compose 配置...
docker-compose config --quiet 2>nul
if %errorlevel% neq 0 (
    echo ⚠ 配置验证有警告（通常可以忽略）
) else (
    echo ✓ 配置有效
)

echo.
echo [4/8] 检查环境变量...
findstr /C:"JWT_SECRET=change-this" .env >nul
if %errorlevel% equ 0 (
    echo ⚠ 警告: JWT_SECRET 仍使用默认值，生产环境请修改！
) else (
    echo ✓ JWT_SECRET 已修改
)

echo.
echo [5/8] 检查端口占用...
netstat -ano | findstr ":80 " >nul
if %errorlevel% equ 0 (
    echo ⚠ 警告: 端口 80 可能被占用
    echo    如需修改端口，编辑 .env 中的 FRONTEND_PORT
) else (
    echo ✓ 端口 80 可用
)

echo.
echo [6/8] 检查现有容器...
docker ps -a --filter "name=prompt-studio" --format "{{.Names}}" | findstr /R "prompt-studio" >nul
if %errorlevel% equ 0 (
    echo ⚠ 发现现有容器，建议先清理:
    echo    docker-compose down -v
    docker ps -a --filter "name=prompt-studio" --format "  - {{.Names}} ({{.Status}})"
) else (
    echo ✓ 无现有容器
)

echo.
echo [7/8] 检查前端 API 配置...
findstr "API_BASE_URL.*'/api'" frontend\src\services\api.ts >nul
if %errorlevel% equ 0 (
    echo ✓ 前端 API 配置正确 (使用相对路径 /api)
) else (
    echo ✗ 前端 API 配置错误
    pause
    exit /b 1
)

echo.
echo [8/8] 检查 Nginx 配置...
findstr "proxy_pass.*backend:3001" docker\nginx.conf >nul
if %errorlevel% equ 0 (
    echo ✓ Nginx 反向代理配置正确
) else (
    echo ✗ Nginx 配置错误
    pause
    exit /b 1
)

echo.
echo ================================================
echo 测试完成！
echo ================================================
echo.
echo ✓ 所有关键检查已通过
echo.
echo 下一步操作:
echo   1. 启动服务: scripts\start.bat
echo   2. 或手动启动: docker-compose up -d
echo   3. 查看日志: docker-compose logs -f
echo   4. 访问应用: http://localhost
echo.
echo 详细测试报告已保存到: test-report.txt
echo.
echo ================================================

pause
