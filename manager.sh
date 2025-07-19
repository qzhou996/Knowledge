#!/bin/bash

# 设置颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 设置错误处理
set -e
trap 'handle_error $? $LINENO' ERR

# 错误处理函数
handle_error() {
    local exit_code=$1
    local line_number=$2
    echo -e "${RED}Error occurred in script at line $line_number with exit code $exit_code${NC}"
    cleanup
    exit $exit_code
}

# 清理函数
cleanup() {
    echo -e "${YELLOW}Cleaning up temporary files...${NC}"
    rm -f "$FILE_NAME"
}

# 检查系统架构
ARCH=$(uname -m)
case "$ARCH" in
    "x86_64"|"amd64")
        ARCH="x86_64"
        ;;
    "aarch64"|"arm64"|"armv8l")
        ARCH="aarch64"
        ;;
    *)
        echo -e "${RED}This installer only supports amd64 (x86_64) and arm64 (aarch64) architectures${NC}"
        echo -e "${RED}Current architecture: $ARCH${NC}"
        exit 1
        ;;
esac

# 检查root权限
if [[ $EUID -ne 0 ]]; then
    echo -e "${RED}This script must be run as root${NC}"
    exit 1
fi

echo -e "${GREEN}Architecture: $ARCH${NC}"

# 设置变量
if [[ "$ARCH" == "x86_64" ]]; then
    URL="https://release.baizhi.cloud/panda-wiki/installer_amd64"
elif [[ "$ARCH" == "aarch64" ]]; then
    URL="https://release.baizhi.cloud/panda-wiki/installer_arm64"
fi
FILE_NAME="/tmp/panda-wiki-installer"

echo -e "${GREEN}Starting Panda Wiki Installer${NC}"
echo -e "${YELLOW}Downloading installer...${NC}"

# 下载安装程序
if ! curl -4sSLk -o "$FILE_NAME" "$URL"; then
    echo -e "${RED}Failed to download installer${NC}"
    exit 1
fi

echo -e "${GREEN}Download completed${NC}"
echo -e "${YELLOW}Setting up installer...${NC}"

# 设置执行权限
chmod +x "$FILE_NAME"

echo -e "${GREEN}Starting installation...${NC}"

# 执行安装程序
if ! $FILE_NAME; then
    echo -e "${RED}Installation failed${NC}"
    cleanup
    exit 1
fi

echo -e "${GREEN}Installation completed successfully${NC}"
cleanup
exit 0
