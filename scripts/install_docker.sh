#!/bin/bash

# Script to install Docker on Ubuntu/Debian systems
# This script installs Docker CE and Docker Compose

set -e

echo "🐋 Starting Docker installation..."

# Function to check if command exists
command_exists() {
    command -v "$@" > /dev/null 2>&1
}

# Function to get OS information
get_os_info() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$NAME
        VER=$VERSION_ID
    else
        echo "❌ Cannot determine OS version"
        exit 1
    fi
}

# Function to install Docker on Ubuntu/Debian
install_docker_ubuntu_debian() {
    echo "📦 Updating package index..."
    sudo apt-get update

    echo "🔧 Installing required packages..."
    sudo apt-get install -y \
        ca-certificates \
        curl \
        gnupg \
        lsb-release

    echo "🔑 Adding Docker's official GPG key..."
    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

    echo "📋 Setting up Docker repository..."
    echo \
        "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
        $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

    echo "📦 Updating package index with Docker packages..."
    sudo apt-get update

    echo "🐋 Installing Docker CE..."
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

    echo "👥 Adding current user to docker group..."
    sudo usermod -aG docker $USER

    echo "🚀 Starting and enabling Docker service..."
    sudo systemctl start docker
    sudo systemctl enable docker
}

# Function to install Docker Compose (standalone)
install_docker_compose() {
    echo "🔧 Installing Docker Compose..."
    
    # Get latest version of Docker Compose
    DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep -Po '"tag_name": "\K.*?(?=")')
    
    # Download and install Docker Compose
    sudo curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    
    # Create symlink for easier access
    sudo ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose
}

# Main installation process
main() {
    echo "🔍 Checking system information..."
    get_os_info
    
    echo "📋 Detected OS: $OS"
    
    # Check if Docker is already installed
    if command_exists docker; then
        echo "✅ Docker is already installed:"
        docker --version
        echo "🔄 Checking for updates..."
    else
        echo "📥 Docker not found. Installing..."
    fi
    
    # Install based on OS
    case "$OS" in
        "Ubuntu"*|"Debian"*)
            install_docker_ubuntu_debian
            ;;
        *)
            echo "❌ Unsupported OS: $OS"
            echo "This script supports Ubuntu and Debian systems only."
            exit 1
            ;;
    esac
    
    # Install Docker Compose if not available via plugin
    if ! command_exists docker-compose; then
        install_docker_compose
    fi
    
    echo "✅ Docker installation completed successfully!"
    echo ""
    echo "📋 Installed versions:"
    docker --version
    docker-compose --version
    echo ""
    echo "⚠️  Note: You may need to log out and log back in for group changes to take effect."
    echo "   Or run: newgrp docker"
    echo ""
    echo "🔧 To test the installation, run: docker run hello-world"
}

# Run main function
main "$@"