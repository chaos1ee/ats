# Installation and Setup Guide

## Overview

This guide provides comprehensive instructions for setting up and deploying the Kubernetes Health Report Dashboard system, which consists of two main components: a frontend static HTML dashboard and a PDF generation service using Puppeteer.

## Table of Contents

- [System Requirements](#system-requirements)
- [Project Structure](#project-structure)
- [Frontend Setup](#frontend-setup)
- [Printer Service Setup](#printer-service-setup)
- [Development Environment](#development-environment)
- [Production Deployment](#production-deployment)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Environment Variables](#environment-variables)
- [Docker Setup](#docker-setup)

## System Requirements

### Hardware Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | 2 cores | 4+ cores |
| RAM | 4GB | 8GB+ |
| Storage | 2GB | 10GB+ |
| Network | 100Mbps | 1Gbps |

### Software Requirements

#### Development Environment

- **Node.js**: Version 12.x or higher (LTS recommended)
- **npm**: Version 6.x or higher (comes with Node.js)
- **yarn**: Version 1.22.x or higher (optional, alternative to npm)
- **Git**: Version 2.x or higher

#### Production Environment

- **Node.js**: Version 14.x or higher (LTS recommended)
- **Process Manager**: PM2, systemd, or similar
- **Web Server**: Nginx, Apache, or similar (for frontend hosting)
- **Operating System**: Linux (Ubuntu 18.04+), macOS (10.14+), Windows (10+)

#### Browser Support

##### Frontend Dashboard
- **Chrome**: Version 70+
- **Firefox**: Version 65+
- **Safari**: Version 12+
- **Edge**: Version 79+

##### PDF Generation (Puppeteer)
- **Chromium**: Automatically managed by Puppeteer
- **Chrome**: Version 70+ (if using external Chrome installation)

## Project Structure

```
project-root/
├── frontend/                 # Static HTML dashboard
│   ├── index.html           # Main dashboard page
│   ├── css/                 # Stylesheets
│   │   ├── reset.css       # Browser reset
│   │   ├── common.css      # Reusable components
│   │   └── main.css        # Layout and specific styles
│   ├── js/                 # JavaScript files
│   │   ├── global.js       # Utility functions
│   │   ├── charts.js       # Chart library
│   │   └── main.js         # Application logic
│   └── img/                # Image assets
├── printer/                 # PDF generation service
│   ├── index.js            # Main application
│   ├── package.json        # Dependencies and scripts
│   └── yarn.lock           # Dependency lockfile
├── docs/                   # Documentation
└── README.md               # Project overview
```

## Frontend Setup

The frontend is a static HTML application that can be served by any web server or opened directly in a browser.

### Quick Start (Local Development)

```bash
# Navigate to the frontend directory
cd frontend

# Option 1: Open directly in browser
open index.html  # macOS
xdg-open index.html  # Linux
start index.html  # Windows

# Option 2: Use a simple HTTP server
npx http-server .
# or
python -m http.server 8000
# or
python3 -m http.server 8000
```

### Web Server Setup

#### Using Nginx

```nginx
server {
    listen 80;
    server_name your-dashboard.example.com;
    root /path/to/frontend;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # Cache static assets
    location ~* \.(css|js|img|svg|png|jpg|jpeg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

#### Using Apache

```apache
<VirtualHost *:80>
    ServerName your-dashboard.example.com
    DocumentRoot /path/to/frontend
    DirectoryIndex index.html

    <Directory /path/to/frontend>
        AllowOverride None
        Require all granted
    </Directory>

    # Cache static assets
    <LocationMatch "\.(css|js|img|svg|png|jpg|jpeg)$">
        ExpiresActive On
        ExpiresDefault "access plus 1 year"
    </LocationMatch>
</VirtualHost>
```

### CDN Setup (Optional)

For production deployments with global access:

```bash
# Upload to AWS S3 + CloudFront
aws s3 sync frontend/ s3://your-bucket-name/
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"

# Upload to Google Cloud Storage + CDN
gsutil -m rsync -r -d frontend/ gs://your-bucket-name/
gcloud compute url-maps invalidate-cdn-cache your-url-map --path "/*"

# Upload to Azure Blob Storage + CDN
az storage blob upload-batch --source frontend/ --destination '$web' --account-name yourstorageaccount
az cdn endpoint purge --name your-endpoint --profile-name your-profile --resource-group your-group --content-paths "/*"
```

## Printer Service Setup

The printer service converts web pages to PDF using Puppeteer and Node.js.

### Installation

```bash
# Navigate to the printer directory
cd printer

# Install dependencies using yarn (recommended)
yarn install

# OR install using npm
npm install
```

### Dependency Installation Details

The main dependencies are:

```json
{
  "puppeteer": "^2.0.0",    // Browser automation
  "yargs": "^15.0.2",       // Command line parsing
  "shelljs": "^0.8.3",      // Shell operations
  "path": "^0.12.7"         // Path utilities
}
```

#### Puppeteer Installation Notes

Puppeteer downloads Chromium (~170MB) during installation:

```bash
# Standard installation (downloads Chromium)
yarn install

# Skip Chromium download (if using system Chrome)
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true yarn install

# Specify custom Chromium download location
PUPPETEER_CACHE_DIR=/custom/path yarn install
```

### Basic Usage

```bash
# Convert a webpage to PDF
node index.js --target https://example.com

# Specify output file
node index.js --target https://example.com --output report.pdf

# Convert local file
node index.js --target file:///absolute/path/to/local.html --output local.pdf

# Get help
node index.js --help
```

### Building Standalone Executable

Create a standalone executable that doesn't require Node.js installation:

```bash
# Build for current platform
yarn run build

# The executable will be created in the build/ directory
ls build/
# Output: printer-linux, printer-macos, or printer-win.exe

# Run the standalone executable
./build/printer-linux --target https://example.com --output report.pdf
```

#### Multi-Platform Build

For building executables for multiple platforms:

```bash
# Install pkg globally for advanced usage
npm install -g pkg

# Build for specific platforms
pkg package.json --target node14-linux-x64 --output build/printer-linux
pkg package.json --target node14-macos-x64 --output build/printer-macos
pkg package.json --target node14-win-x64 --output build/printer-win.exe

# Build for all platforms
pkg package.json --target node14-linux-x64,node14-macos-x64,node14-win-x64 --output build/
```

## Development Environment

### Setup for Development

```bash
# Clone the repository
git clone <repository-url>
cd project-name

# Set up frontend (no build step required)
cd frontend
# Frontend is ready to use

# Set up printer service
cd ../printer
yarn install

# Verify installation
node index.js --help
```

### Development Workflow

#### Frontend Development

```bash
# Start a development server
cd frontend
npx http-server . -p 8080

# Or use Live Server extension in VS Code
# Open index.html and start Live Server
```

#### Printer Service Development

```bash
# Test with local frontend
cd printer
node index.js --target http://localhost:8080 --output test.pdf

# Test with remote URL
node index.js --target https://httpbin.org/html --output test.pdf

# Debug mode (if implementing)
DEBUG=1 node index.js --target https://example.com
```

#### Integrated Development

```bash
# Terminal 1: Start frontend server
cd frontend && npx http-server . -p 8080

# Terminal 2: Generate PDF from local frontend
cd printer && node index.js --target http://localhost:8080 --output dashboard.pdf
```

### Code Editing Setup

#### VS Code Configuration

Create `.vscode/settings.json`:

```json
{
  "eslint.workingDirectories": ["printer"],
  "html.format.indentInnerHtml": true,
  "css.validate": true,
  "javascript.validate.enable": true,
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "files.associations": {
    "*.css": "css",
    "*.js": "javascript"
  }
}
```

Create `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "ms-vscode.vscode-eslint",
    "ritwickdey.liveserver",
    "bradlc.vscode-tailwindcss",
    "formulahendry.auto-rename-tag"
  ]
}
```

## Production Deployment

### Frontend Deployment

#### Static Hosting

```bash
# Deploy to Netlify
npm install -g netlify-cli
cd frontend
netlify deploy --prod --dir .

# Deploy to Vercel
npm install -g vercel
cd frontend
vercel --prod

# Deploy to GitHub Pages
# Push frontend/ contents to gh-pages branch
```

#### Docker Deployment (Frontend)

Create `frontend/Dockerfile`:

```dockerfile
FROM nginx:alpine

# Copy frontend files
COPY . /usr/share/nginx/html

# Copy custom nginx config (optional)
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Build and run:

```bash
cd frontend
docker build -t dashboard-frontend .
docker run -p 80:80 dashboard-frontend
```

### Printer Service Deployment

#### PM2 Process Management

```bash
# Install PM2 globally
npm install -g pm2

# Create ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'printer-service',
    script: 'index.js',
    cwd: './printer',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# Start the service
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Set up auto-start on boot
pm2 startup
```

#### Systemd Service

Create `/etc/systemd/system/printer-service.service`:

```ini
[Unit]
Description=PDF Printer Service
After=network.target

[Service]
Type=simple
User=nodejs
WorkingDirectory=/opt/printer-service/printer
ExecStart=/usr/bin/node index.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable printer-service
sudo systemctl start printer-service
sudo systemctl status printer-service
```

#### Docker Deployment (Printer Service)

Create `printer/Dockerfile`:

```dockerfile
FROM node:14-alpine

# Install dependencies for Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Set Puppeteer to use installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install --production

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S printer -u 1001

# Change ownership
RUN chown -R printer:nodejs /app
USER printer

# Expose port (if running as service)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node --version || exit 1

# Default command
CMD ["node", "index.js", "--help"]
```

Build and run:

```bash
cd printer
docker build -t printer-service .

# Run as command-line tool
docker run --rm -v $(pwd)/output:/app/output printer-service \
  node index.js --target https://example.com --output /app/output/report.pdf

# Run as service (if implementing HTTP API)
docker run -d -p 3000:3000 --name printer-service printer-service
```

## Configuration

### Environment Variables

#### Frontend Configuration

```bash
# Optional: API endpoints for dynamic data
export API_BASE_URL=https://api.example.com
export ENVIRONMENT=production
export VERSION=1.0.0
```

#### Printer Service Configuration

```bash
# Puppeteer configuration
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome
export PUPPETEER_CACHE_DIR=/tmp/puppeteer
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Application configuration
export NODE_ENV=production
export LOG_LEVEL=info
export OUTPUT_DIR=/var/lib/pdf-output
export MAX_CONCURRENT_JOBS=5

# Chrome flags for different environments
export CHROME_FLAGS="--no-sandbox,--disable-setuid-sandbox,--disable-dev-shm-usage"
```

### Configuration Files

#### Printer Service Config

Create `printer/config.json`:

```json
{
  "puppeteer": {
    "headless": true,
    "args": [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--disable-gpu"
    ]
  },
  "pdf": {
    "format": "A4",
    "scale": 0.95,
    "printBackground": true,
    "displayHeaderFooter": true,
    "margin": {
      "top": "20px",
      "bottom": "40px",
      "left": "20px",
      "right": "20px"
    }
  },
  "server": {
    "timeout": 30000,
    "maxConcurrent": 5
  }
}
```

Load config in your application:

```javascript
const config = require('./config.json');

const puppeteerConfig = {
  headless: config.puppeteer.headless,
  args: config.puppeteer.args,
  ...
};
```

### Nginx Reverse Proxy (Optional)

If implementing printer service as HTTP API:

```nginx
upstream printer_service {
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;  # Multiple instances
}

server {
    listen 80;
    server_name printer.example.com;

    location / {
        proxy_pass http://printer_service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeout for long PDF generation
        proxy_read_timeout 300s;
        proxy_connect_timeout 30s;
        proxy_send_timeout 300s;
    }
}
```

## Docker Setup

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    volumes:
      - ./frontend:/usr/share/nginx/html:ro
    restart: unless-stopped

  printer:
    build:
      context: ./printer
      dockerfile: Dockerfile
    environment:
      - NODE_ENV=production
      - PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
    volumes:
      - ./output:/app/output
      - /tmp:/tmp
    restart: unless-stopped
    command: ["node", "index.js", "--help"]  # Override as needed

  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
      - printer
    restart: unless-stopped

volumes:
  output:
    driver: local
```

Run with Docker Compose:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Scale printer service
docker-compose up -d --scale printer=3

# Stop all services
docker-compose down
```

### Kubernetes Deployment

Create `k8s/deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: dashboard-frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: dashboard-frontend
  template:
    metadata:
      labels:
        app: dashboard-frontend
    spec:
      containers:
      - name: frontend
        image: dashboard-frontend:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: printer-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: printer-service
  template:
    metadata:
      labels:
        app: printer-service
    spec:
      containers:
      - name: printer
        image: printer-service:latest
        env:
        - name: NODE_ENV
          value: "production"
        - name: PUPPETEER_EXECUTABLE_PATH
          value: "/usr/bin/chromium-browser"
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        volumeMounts:
        - name: output-volume
          mountPath: /app/output
      volumes:
      - name: output-volume
        persistentVolumeClaim:
          claimName: printer-output-pvc

---
apiVersion: v1
kind: Service
metadata:
  name: dashboard-frontend-service
spec:
  selector:
    app: dashboard-frontend
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

Deploy to Kubernetes:

```bash
kubectl apply -f k8s/
kubectl get pods
kubectl get services
```

## Troubleshooting

### Common Issues

#### Frontend Issues

**Issue**: Charts not rendering
```bash
# Check console for JavaScript errors
# Verify canvas elements exist
# Check Charts.js library loading
```

**Solution**:
```javascript
// Add error handling
try {
  new Chart("#my-chart", chartConfig);
} catch (error) {
  console.error("Chart initialization failed:", error);
}
```

**Issue**: CSS not loading properly
```bash
# Check file paths
# Verify MIME types in server configuration
# Check browser cache
```

#### Printer Service Issues

**Issue**: Puppeteer fails to launch
```bash
# Error: Failed to launch the browser process
```

**Solution**:
```bash
# Install missing dependencies (Linux)
sudo apt-get install -y \
  gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 \
  libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 \
  libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 \
  libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 \
  libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 \
  libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates \
  fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget

# Use --no-sandbox flag in Docker
export CHROME_FLAGS="--no-sandbox --disable-setuid-sandbox"
```

**Issue**: PDF generation timeout
```bash
# Error: Navigation timeout exceeded
```

**Solution**:
```javascript
// Increase timeout in code
await page.goto(url, { 
  waitUntil: 'networkidle2', 
  timeout: 60000  // 60 seconds
});

// Or use environment variable
export PUPPETEER_TIMEOUT=60000
```

**Issue**: Out of memory errors
```bash
# Error: ENOMEM or process killed
```

**Solution**:
```bash
# Increase memory limits
docker run -m 2g printer-service

# Or in Kubernetes
resources:
  limits:
    memory: "2Gi"

# Close browser instances promptly
await browser.close();
```

### Debug Mode

Enable debug logging:

```bash
# Printer service debug
DEBUG=puppeteer:* node index.js --target https://example.com

# Or set environment variable
export DEBUG=puppeteer:*,app:*
```

### Health Checks

#### Frontend Health Check

```bash
# Simple HTTP check
curl -f http://localhost:80/index.html || exit 1

# Check for specific content
curl -s http://localhost:80/index.html | grep -q "Kubernetes" || exit 1
```

#### Printer Service Health Check

```bash
# Basic functionality test
node index.js --target https://httpbin.org/html --output test.pdf
test -f test.pdf && echo "OK" || echo "FAIL"

# In Docker
docker exec printer-container node index.js --help
```

### Monitoring

#### Basic Monitoring Script

```bash
#!/bin/bash
# monitor.sh

check_frontend() {
  curl -f -s http://localhost:80/index.html > /dev/null
  echo "Frontend: $?"
}

check_printer() {
  cd printer
  timeout 30 node index.js --target https://httpbin.org/html --output /tmp/test.pdf
  echo "Printer: $?"
  rm -f /tmp/test.pdf
}

while true; do
  echo "$(date): Health check"
  check_frontend
  check_printer
  sleep 60
done
```

#### Resource Monitoring

```bash
# Monitor resource usage
docker stats --no-stream
htop
ps aux | grep node
```

This comprehensive installation and setup guide covers all aspects of deploying and maintaining the health report dashboard system in various environments.