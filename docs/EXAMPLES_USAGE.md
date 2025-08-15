# Examples and Usage Guide

## Overview

This guide provides practical examples and real-world usage scenarios for the Kubernetes Health Report Dashboard system. It includes complete code samples, integration patterns, and best practices for both the frontend dashboard and PDF generation service.

## Table of Contents

- [Quick Start Examples](#quick-start-examples)
- [Frontend Dashboard Examples](#frontend-dashboard-examples)
- [Chart Integration Examples](#chart-integration-examples)
- [PDF Generation Examples](#pdf-generation-examples)
- [Integration Patterns](#integration-patterns)
- [Advanced Scenarios](#advanced-scenarios)
- [Automation Scripts](#automation-scripts)
- [Production Examples](#production-examples)
- [Troubleshooting Examples](#troubleshooting-examples)

## Quick Start Examples

### 1. Basic Setup and First PDF

```bash
# Clone and setup the project
git clone <repository-url>
cd health-report-dashboard

# Setup printer service
cd printer
yarn install

# Generate your first PDF
node index.js --target https://example.com --output my-first-report.pdf

# Setup frontend for local viewing
cd ../frontend
npx http-server . -p 8080

# Generate PDF from local frontend
cd ../printer
node index.js --target http://localhost:8080 --output dashboard-report.pdf
```

### 2. Frontend-Only Deployment

```bash
# Serve frontend with Python
cd frontend
python3 -m http.server 8000

# Or with Node.js
npx serve . -p 8000

# Or deploy to Netlify
npx netlify deploy --prod --dir .
```

### 3. Complete Docker Setup

```bash
# Build and run both services
docker-compose up -d

# Generate PDF using Docker
docker run --rm -v $(pwd)/output:/app/output printer-service \
  node index.js --target https://example.com --output /app/output/report.pdf
```

## Frontend Dashboard Examples

### 1. Creating a Custom Health Dashboard

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Custom Health Dashboard</title>
  <link rel="stylesheet" href="css/reset.css">
  <link rel="stylesheet" href="css/common.css">
  <link rel="stylesheet" href="css/main.css">
</head>
<body>
  <header class="header">
    <div class="header__logo-container">
      <img class="header__logo-container__logo" src="img/logo.svg" alt="Logo">
    </div>
    <h1 class="header__title">System Health Dashboard</h1>
  </header>

  <main class="content">
    <!-- System Overview Card -->
    <div class="card">
      <div class="card-header">
        <h2>System Overview</h2>
      </div>
      <ul class="cluster-status-list">
        <li class="cluster-status-list-item">
          <span class="cluster-status-list-item__name">Uptime:</span>
          <span class="cluster-status-list-item__value" id="uptime">Loading...</span>
        </li>
        <li class="cluster-status-list-item">
          <span class="cluster-status-list-item__name">Services:</span>
          <span class="cluster-status-list-item__value" id="service-count">Loading...</span>
        </li>
        <li class="cluster-status-list-item">
          <span class="cluster-status-list-item__name">CPU Usage:</span>
          <span class="cluster-status-list-item__value" id="cpu-usage">Loading...</span>
        </li>
        <li class="cluster-status-list-item">
          <span class="cluster-status-list-item__name">Memory Usage:</span>
          <span class="cluster-status-list-item__value" id="memory-usage">Loading...</span>
        </li>
      </ul>
    </div>

    <!-- Service Health Card -->
    <div class="card">
      <div class="card-header">
        <h2>Service Health</h2>
        <ul class="status-list">
          <li class="status-item excellent">Excellent</li>
          <li class="status-item success">Good</li>
          <li class="status-item warning">Warning</li>
          <li class="status-item error">Critical</li>
        </ul>
      </div>
      <div class="health-status-list-item">
        <div class="health-status-list-item__header">
          <h3>Application Services</h3>
          <ul class="status-list">
            <li class="status-item success">Good</li>
          </ul>
        </div>
        <div class="health-status-list-item__body">
          <canvas id="services-chart" width="534" height="200"></canvas>
        </div>
      </div>
    </div>

    <!-- Performance Metrics Table -->
    <div class="card">
      <div class="card-header">
        <h2>Performance Metrics</h2>
      </div>
      <table class="other-status-table">
        <thead>
          <tr>
            <th width="25%">Metric</th>
            <th width="25%">Current</th>
            <th width="25%">Target</th>
            <th width="25%">Status</th>
          </tr>
        </thead>
        <tbody id="metrics-table">
          <!-- Dynamic content will be inserted here -->
        </tbody>
      </table>
    </div>
  </main>

  <script src="js/global.js"></script>
  <script src="js/charts.js"></script>
  <script src="js/custom-dashboard.js"></script>
</body>
</html>
```

### 2. Custom JavaScript for Dynamic Data

Create `js/custom-dashboard.js`:

```javascript
// Custom dashboard logic
class HealthDashboard {
  constructor() {
    this.apiEndpoint = 'https://api.example.com/health';
    this.refreshInterval = 30000; // 30 seconds
    this.charts = new Map();
    
    this.init();
  }

  async init() {
    try {
      await this.loadInitialData();
      this.createCharts();
      this.startAutoRefresh();
    } catch (error) {
      console.error('Dashboard initialization failed:', error);
      this.showErrorState();
    }
  }

  async loadInitialData() {
    // Simulate API call or load from actual endpoint
    const data = await this.fetchHealthData();
    this.updateSystemOverview(data.system);
    this.updateMetricsTable(data.metrics);
    return data;
  }

  async fetchHealthData() {
    // In a real implementation, this would fetch from your API
    return {
      system: {
        uptime: '15 days, 3 hours',
        serviceCount: 42,
        cpuUsage: '23%',
        memoryUsage: '67%'
      },
      services: {
        web: { status: 'good', instances: 3, healthy: 3 },
        api: { status: 'good', instances: 5, healthy: 5 },
        database: { status: 'warning', instances: 2, healthy: 1 },
        cache: { status: 'excellent', instances: 3, healthy: 3 }
      },
      metrics: [
        { name: 'Response Time', current: '120ms', target: '<200ms', status: 'success' },
        { name: 'Throughput', current: '1,250 req/s', target: '>1,000 req/s', status: 'success' },
        { name: 'Error Rate', current: '0.02%', target: '<0.1%', status: 'excellent' },
        { name: 'Availability', current: '99.95%', target: '>99.9%', status: 'excellent' }
      ]
    };
  }

  updateSystemOverview(system) {
    document.getElementById('uptime').textContent = system.uptime;
    document.getElementById('service-count').textContent = system.serviceCount;
    document.getElementById('cpu-usage').textContent = system.cpuUsage;
    document.getElementById('memory-usage').textContent = system.memoryUsage;
  }

  updateMetricsTable(metrics) {
    const tbody = document.getElementById('metrics-table');
    tbody.innerHTML = '';

    metrics.forEach(metric => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${metric.name}</td>
        <td>${metric.current}</td>
        <td>${metric.target}</td>
        <td>
          <div class="status-item ${metric.status}">${this.getStatusText(metric.status)}</div>
        </td>
      `;
      tbody.appendChild(row);
    });
  }

  getStatusText(status) {
    const statusMap = {
      excellent: 'Excellent',
      success: 'Good',
      warning: 'Warning',
      error: 'Critical'
    };
    return statusMap[status] || 'Unknown';
  }

  async createCharts() {
    // Service distribution chart
    const serviceData = await this.getServiceData();
    
    this.charts.set('services', new Chart("#services-chart", {
      type: "doughnut",
      legend: serviceData.labels,
      data: serviceData.values,
      label: { 
        text: `${serviceData.total}`, 
        color: COLORS[1] 
      }
    }));
  }

  async getServiceData() {
    const data = await this.fetchHealthData();
    const services = data.services;
    
    return {
      labels: Object.keys(services),
      values: Object.values(services).map(s => s.instances),
      total: Object.values(services).reduce((sum, s) => sum + s.instances, 0)
    };
  }

  startAutoRefresh() {
    setInterval(async () => {
      try {
        await this.loadInitialData();
        console.log('Dashboard updated:', new Date().toLocaleTimeString());
      } catch (error) {
        console.error('Auto-refresh failed:', error);
      }
    }, this.refreshInterval);
  }

  showErrorState() {
    document.querySelector('.content').innerHTML = `
      <div class="card">
        <div class="card-header">
          <h2>Dashboard Error</h2>
        </div>
        <p>Failed to load dashboard data. Please check your connection and try again.</p>
        <button onclick="location.reload()">Retry</button>
      </div>
    `;
  }
}

// Initialize dashboard when page loads
window.addEventListener('load', () => {
  new HealthDashboard();
});
```

## Chart Integration Examples

### 1. Multiple Chart Types

```javascript
// Advanced chart creation with error handling
class ChartManager {
  constructor() {
    this.charts = new Map();
    this.defaultColors = ['#e54545', '#0abf5b', '#006eff', '#ff9d00'];
  }

  createDoughnutChart(selector, config) {
    try {
      const chart = new Chart(selector, {
        type: 'doughnut',
        legend: config.legend,
        data: config.data,
        label: config.label || { text: this.calculateTotal(config.data), color: this.defaultColors[1] }
      });
      
      this.charts.set(selector, chart);
      return chart;
    } catch (error) {
      console.error(`Failed to create doughnut chart ${selector}:`, error);
      this.showChartError(selector);
    }
  }

  createBarChart(selector, value) {
    try {
      const chart = new Chart(selector, {
        type: 'bar',
        data: this.normalizeValue(value)
      });
      
      this.charts.set(selector, chart);
      return chart;
    } catch (error) {
      console.error(`Failed to create bar chart ${selector}:`, error);
      this.showChartError(selector);
    }
  }

  createMultipleCharts(configs) {
    const results = {};
    
    configs.forEach(config => {
      if (config.type === 'doughnut') {
        results[config.selector] = this.createDoughnutChart(config.selector, config);
      } else if (config.type === 'bar') {
        results[config.selector] = this.createBarChart(config.selector, config.value);
      }
    });
    
    return results;
  }

  calculateTotal(data) {
    return sum(data).toLocaleString();
  }

  normalizeValue(value) {
    // Ensure value is between 0 and 1
    if (typeof value === 'string') {
      value = parseFloat(value.replace('%', '')) / 100;
    }
    return Math.max(0, Math.min(1, value));
  }

  showChartError(selector) {
    const canvas = document.querySelector(selector);
    if (canvas) {
      const parent = canvas.parentElement;
      parent.innerHTML = `
        <div class="chart-error" style="text-align: center; padding: 20px; color: #666;">
          <p>Chart unavailable</p>
          <small>Please check console for details</small>
        </div>
      `;
    }
  }

  updateChart(selector, newData) {
    // Since charts are static, we need to recreate them
    const canvas = document.querySelector(selector);
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Recreate based on stored configuration
      if (this.charts.has(selector)) {
        this.charts.delete(selector);
      }
    }
  }

  destroyAll() {
    this.charts.clear();
  }
}

// Usage example
const chartManager = new ChartManager();

// Create multiple charts at once
const chartConfigs = [
  {
    selector: '#cpu-chart',
    type: 'doughnut',
    legend: ['Used', 'Available'],
    data: [30, 70],
    label: { text: '30%', color: '#ff9d00' }
  },
  {
    selector: '#memory-chart',
    type: 'doughnut',
    legend: ['Used', 'Cache', 'Available'],
    data: [40, 25, 35],
    label: { text: '65%', color: '#e54545' }
  },
  {
    selector: '#disk-progress',
    type: 'bar',
    value: 0.75
  }
];

chartManager.createMultipleCharts(chartConfigs);
```

### 2. Responsive Chart Container

```html
<!-- Responsive chart container -->
<div class="chart-container" id="responsive-chart-container">
  <canvas id="responsive-chart"></canvas>
</div>

<style>
.chart-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.chart-container canvas {
  width: 100% !important;
  height: auto !important;
  max-width: 100%;
}

@media (max-width: 768px) {
  .chart-container {
    max-width: 100%;
    padding: 0 10px;
  }
}
</style>

<script>
function createResponsiveChart() {
  const container = document.getElementById('responsive-chart-container');
  const canvas = document.getElementById('responsive-chart');
  
  // Set canvas size based on container
  const containerWidth = container.clientWidth;
  const aspectRatio = 0.6; // height/width ratio
  
  canvas.width = containerWidth;
  canvas.height = containerWidth * aspectRatio;
  
  // Create chart
  new Chart('#responsive-chart', {
    type: 'doughnut',
    legend: ['Desktop', 'Mobile', 'Tablet'],
    data: [60, 30, 10],
    label: { text: 'Users', color: '#333' }
  });
}

// Create chart on load and resize
window.addEventListener('load', createResponsiveChart);
window.addEventListener('resize', debounce(createResponsiveChart, 300));

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
</script>
```

## PDF Generation Examples

### 1. Basic PDF Generation Script

```javascript
// pdf-generator.js - Enhanced PDF generation utility
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs').promises;

class PDFGenerator {
  constructor(options = {}) {
    this.browser = null;
    this.defaultOptions = {
      format: 'A4',
      scale: 0.95,
      printBackground: true,
      displayHeaderFooter: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '40px',
        left: '20px'
      },
      ...options
    };
  }

  async init() {
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
  }

  async generatePDF(url, outputPath, customOptions = {}) {
    if (!this.browser) {
      await this.init();
    }

    const page = await this.browser.newPage();
    
    try {
      // Set viewport for consistent rendering
      await page.setViewport({ width: 1200, height: 800 });
      
      // Navigate to page
      console.log(`Loading page: ${url}`);
      await page.goto(url, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      // Wait for charts to render
      await this.waitForCharts(page);

      // Set print media type
      await page.emulateMediaType('print');

      // Generate PDF
      const options = { ...this.defaultOptions, ...customOptions };
      const pdfBuffer = await page.pdf({
        path: outputPath,
        ...options,
        footerTemplate: this.getFooterTemplate()
      });

      console.log(`PDF generated: ${outputPath}`);
      return pdfBuffer;

    } catch (error) {
      console.error('PDF generation failed:', error);
      throw error;
    } finally {
      await page.close();
    }
  }

  async waitForCharts(page) {
    // Wait for canvas elements to be present and rendered
    await page.waitForFunction(() => {
      const canvases = document.querySelectorAll('canvas');
      if (canvases.length === 0) return true; // No charts to wait for
      
      return Array.from(canvases).every(canvas => {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Check if canvas has content (not all transparent)
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] !== 0) return true; // Found non-transparent pixel
        }
        return false;
      });
    }, { timeout: 10000 });
    
    // Additional wait for animations to complete
    await page.waitForTimeout(1000);
  }

  getFooterTemplate() {
    return `
      <div style="font-size: 10px; color: #666; text-align: center; width: 100%; margin: 0 20px;">
        <span>Generated on ${new Date().toLocaleDateString()} - Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
      </div>
    `;
  }

  async generateMultiplePDFs(urls, outputDir) {
    const results = [];
    
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const filename = `report-${i + 1}-${Date.now()}.pdf`;
      const outputPath = path.join(outputDir, filename);
      
      try {
        await this.generatePDF(url, outputPath);
        results.push({ url, outputPath, success: true });
      } catch (error) {
        console.error(`Failed to generate PDF for ${url}:`, error);
        results.push({ url, outputPath, success: false, error: error.message });
      }
    }
    
    return results;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

// Usage examples
async function examples() {
  const generator = new PDFGenerator();

  try {
    // Basic PDF generation
    await generator.generatePDF(
      'http://localhost:8080',
      'dashboard-report.pdf'
    );

    // PDF with custom options
    await generator.generatePDF(
      'https://example.com',
      'custom-report.pdf',
      {
        format: 'A3',
        landscape: true,
        scale: 0.8
      }
    );

    // Generate multiple PDFs
    const urls = [
      'http://localhost:8080',
      'http://localhost:8080#node',
      'http://localhost:8080#master'
    ];
    
    const results = await generator.generateMultiplePDFs(urls, './reports');
    console.log('Batch generation results:', results);

  } finally {
    await generator.close();
  }
}

module.exports = PDFGenerator;

// Run examples if called directly
if (require.main === module) {
  examples().catch(console.error);
}
```

### 2. Scheduled PDF Generation

```javascript
// scheduled-reports.js - Automated report generation
const cron = require('node-cron');
const PDFGenerator = require('./pdf-generator');
const path = require('path');
const fs = require('fs').promises;

class ScheduledReports {
  constructor(config) {
    this.config = {
      outputDir: './reports',
      dashboardUrl: 'http://localhost:8080',
      schedule: '0 9 * * 1', // Every Monday at 9 AM
      retention: 30, // Keep reports for 30 days
      ...config
    };
    
    this.generator = new PDFGenerator();
    this.isRunning = false;
  }

  async init() {
    // Ensure output directory exists
    await fs.mkdir(this.config.outputDir, { recursive: true });
    
    // Schedule the report generation
    cron.schedule(this.config.schedule, () => {
      this.generateScheduledReport();
    });
    
    console.log(`Scheduled reports initialized. Next run: ${this.config.schedule}`);
  }

  async generateScheduledReport() {
    if (this.isRunning) {
      console.log('Report generation already in progress, skipping...');
      return;
    }

    this.isRunning = true;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `weekly-report-${timestamp}.pdf`;
    const outputPath = path.join(this.config.outputDir, filename);

    try {
      console.log('Starting scheduled report generation...');
      
      await this.generator.generatePDF(
        this.config.dashboardUrl,
        outputPath,
        {
          headerTemplate: this.getHeaderTemplate(),
          footerTemplate: this.getFooterTemplate()
        }
      );

      console.log(`Scheduled report generated: ${filename}`);
      
      // Send notification (email, Slack, etc.)
      await this.sendNotification(outputPath);
      
      // Clean up old reports
      await this.cleanupOldReports();

    } catch (error) {
      console.error('Scheduled report generation failed:', error);
      await this.sendErrorNotification(error);
    } finally {
      this.isRunning = false;
    }
  }

  getHeaderTemplate() {
    return `
      <div style="font-size: 12px; color: #333; text-align: center; width: 100%; margin: 0 20px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
        <h3 style="margin: 0;">Weekly Health Report</h3>
        <p style="margin: 5px 0 0 0;">Generated: ${new Date().toLocaleDateString()}</p>
      </div>
    `;
  }

  getFooterTemplate() {
    return `
      <div style="font-size: 10px; color: #666; text-align: center; width: 100%; margin: 0 20px;">
        <span>Confidential - Internal Use Only - Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
      </div>
    `;
  }

  async sendNotification(reportPath) {
    // Example notification via webhook
    const stats = await fs.stat(reportPath);
    const notification = {
      text: `Weekly health report generated successfully`,
      attachments: [{
        color: 'good',
        fields: [
          { title: 'File', value: path.basename(reportPath), short: true },
          { title: 'Size', value: `${(stats.size / 1024).toFixed(1)} KB`, short: true },
          { title: 'Generated', value: new Date().toLocaleString(), short: true }
        ]
      }]
    };

    // Send to Slack, Teams, email, etc.
    console.log('Notification sent:', notification);
  }

  async sendErrorNotification(error) {
    const notification = {
      text: `❌ Weekly health report generation failed`,
      attachments: [{
        color: 'danger',
        fields: [
          { title: 'Error', value: error.message, short: false },
          { title: 'Time', value: new Date().toLocaleString(), short: true }
        ]
      }]
    };

    console.error('Error notification:', notification);
  }

  async cleanupOldReports() {
    try {
      const files = await fs.readdir(this.config.outputDir);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.config.retention);

      for (const file of files) {
        if (!file.endsWith('.pdf')) continue;
        
        const filePath = path.join(this.config.outputDir, file);
        const stats = await fs.stat(filePath);
        
        if (stats.mtime < cutoffDate) {
          await fs.unlink(filePath);
          console.log(`Deleted old report: ${file}`);
        }
      }
    } catch (error) {
      console.error('Cleanup failed:', error);
    }
  }

  async generateManualReport() {
    return this.generateScheduledReport();
  }

  async close() {
    await this.generator.close();
  }
}

// Usage
const scheduler = new ScheduledReports({
  outputDir: './weekly-reports',
  dashboardUrl: 'http://localhost:8080',
  schedule: '0 9 * * 1', // Monday 9 AM
  retention: 60 // Keep for 2 months
});

scheduler.init();

module.exports = ScheduledReports;
```

## Integration Patterns

### 1. REST API Integration

```javascript
// api-integration.js - Connect dashboard to real data
class APIIntegration {
  constructor(baseUrl, apiKey) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const cacheKey = url + JSON.stringify(options);
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Cache the response
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async getSystemHealth() {
    return this.makeRequest('/api/v1/health/system');
  }

  async getServiceMetrics() {
    return this.makeRequest('/api/v1/metrics/services');
  }

  async getPerformanceData(timeRange = '1h') {
    return this.makeRequest(`/api/v1/metrics/performance?range=${timeRange}`);
  }

  async getAlerts() {
    return this.makeRequest('/api/v1/alerts/active');
  }

  clearCache() {
    this.cache.clear();
  }
}

// Dashboard integration
class LiveDashboard {
  constructor(apiBaseUrl, apiKey) {
    this.api = new APIIntegration(apiBaseUrl, apiKey);
    this.charts = new Map();
    this.updateInterval = 30000; // 30 seconds
    this.isUpdating = false;
  }

  async init() {
    await this.loadInitialData();
    this.startAutoUpdate();
  }

  async loadInitialData() {
    try {
      const [systemHealth, serviceMetrics, performance] = await Promise.all([
        this.api.getSystemHealth(),
        this.api.getServiceMetrics(),
        this.api.getPerformanceData()
      ]);

      this.updateSystemHealth(systemHealth);
      this.updateServiceCharts(serviceMetrics);
      this.updatePerformanceMetrics(performance);
      
    } catch (error) {
      console.error('Failed to load initial data:', error);
      this.showErrorState(error);
    }
  }

  updateSystemHealth(data) {
    // Update system overview cards
    document.getElementById('cpu-usage').textContent = `${data.cpu}%`;
    document.getElementById('memory-usage').textContent = `${data.memory}%`;
    document.getElementById('disk-usage').textContent = `${data.disk}%`;
    document.getElementById('uptime').textContent = data.uptime;

    // Update progress bars
    new Chart('#cpu-bar', { type: 'bar', data: data.cpu / 100 });
    new Chart('#memory-bar', { type: 'bar', data: data.memory / 100 });
    new Chart('#disk-bar', { type: 'bar', data: data.disk / 100 });
  }

  updateServiceCharts(metrics) {
    // Service status distribution
    const statusCounts = metrics.reduce((acc, service) => {
      acc[service.status] = (acc[service.status] || 0) + 1;
      return acc;
    }, {});

    new Chart('#service-status-chart', {
      type: 'doughnut',
      legend: Object.keys(statusCounts),
      data: Object.values(statusCounts),
      label: { text: `${metrics.length}`, color: COLORS[1] }
    });

    // Service response times
    const responseTimes = metrics.map(s => s.responseTime);
    new Chart('#response-time-chart', {
      type: 'doughnut',
      legend: metrics.map(s => s.name),
      data: responseTimes,
      label: { text: 'Avg', color: COLORS[2] }
    });
  }

  updatePerformanceMetrics(data) {
    const tbody = document.getElementById('performance-table');
    tbody.innerHTML = '';

    data.metrics.forEach(metric => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${metric.name}</td>
        <td>${metric.current}</td>
        <td>${metric.target}</td>
        <td>
          <div class="status-item ${metric.status}">${metric.statusText}</div>
        </td>
      `;
      tbody.appendChild(row);
    });
  }

  startAutoUpdate() {
    setInterval(async () => {
      if (this.isUpdating) return;
      
      this.isUpdating = true;
      try {
        await this.loadInitialData();
        this.updateTimestamp();
      } catch (error) {
        console.error('Auto-update failed:', error);
      } finally {
        this.isUpdating = false;
      }
    }, this.updateInterval);
  }

  updateTimestamp() {
    const timestampElement = document.getElementById('last-updated');
    if (timestampElement) {
      timestampElement.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
    }
  }

  showErrorState(error) {
    const errorBanner = document.createElement('div');
    errorBanner.className = 'error-banner';
    errorBanner.innerHTML = `
      <div style="background: #fee; border: 1px solid #fcc; padding: 10px; margin: 10px; border-radius: 4px;">
        <strong>Dashboard Error:</strong> ${error.message}
        <button onclick="location.reload()" style="float: right;">Retry</button>
      </div>
    `;
    
    document.querySelector('.content').prepend(errorBanner);
  }
}

// Initialize live dashboard
window.addEventListener('load', () => {
  const liveDashboard = new LiveDashboard(
    'https://api.your-monitoring-system.com',
    'your-api-key-here'
  );
  
  liveDashboard.init().catch(console.error);
});
```

### 2. WebSocket Real-time Updates

```javascript
// websocket-integration.js - Real-time dashboard updates
class RealtimeDashboard {
  constructor(websocketUrl) {
    this.websocketUrl = websocketUrl;
    this.ws = null;
    this.reconnectInterval = 5000;
    this.maxReconnectAttempts = 10;
    this.reconnectAttempts = 0;
    this.charts = new Map();
    
    this.connect();
  }

  connect() {
    try {
      this.ws = new WebSocket(this.websocketUrl);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        this.showConnectionStatus('connected');
      };

      this.ws.onmessage = (event) => {
        this.handleMessage(JSON.parse(event.data));
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.showConnectionStatus('disconnected');
        this.scheduleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.showConnectionStatus('error');
      };

    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      this.scheduleReconnect();
    }
  }

  handleMessage(data) {
    switch (data.type) {
      case 'system_metrics':
        this.updateSystemMetrics(data.payload);
        break;
      case 'service_status':
        this.updateServiceStatus(data.payload);
        break;
      case 'alert':
        this.showAlert(data.payload);
        break;
      case 'performance_update':
        this.updatePerformanceCharts(data.payload);
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  }

  updateSystemMetrics(metrics) {
    // Update real-time CPU usage
    if (metrics.cpu !== undefined) {
      new Chart('#cpu-realtime-bar', {
        type: 'bar',
        data: metrics.cpu / 100
      });
      document.getElementById('cpu-value').textContent = `${metrics.cpu}%`;
    }

    // Update memory usage
    if (metrics.memory !== undefined) {
      new Chart('#memory-realtime-bar', {
        type: 'bar',
        data: metrics.memory / 100
      });
      document.getElementById('memory-value').textContent = `${metrics.memory}%`;
    }

    // Update network I/O
    if (metrics.network) {
      document.getElementById('network-in').textContent = this.formatBytes(metrics.network.in);
      document.getElementById('network-out').textContent = this.formatBytes(metrics.network.out);
    }
  }

  updateServiceStatus(services) {
    const serviceContainer = document.getElementById('services-realtime');
    
    services.forEach(service => {
      const serviceElement = document.getElementById(`service-${service.id}`);
      if (serviceElement) {
        const statusElement = serviceElement.querySelector('.service-status');
        statusElement.className = `service-status status-item ${service.status}`;
        statusElement.textContent = service.statusText;
        
        // Update response time
        const responseTimeElement = serviceElement.querySelector('.response-time');
        if (responseTimeElement) {
          responseTimeElement.textContent = `${service.responseTime}ms`;
        }
      }
    });
  }

  showAlert(alert) {
    const alertContainer = document.getElementById('alerts-container') || this.createAlertContainer();
    
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${alert.severity}`;
    alertElement.innerHTML = `
      <div class="alert-header">
        <span class="alert-title">${alert.title}</span>
        <button class="alert-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
      <div class="alert-body">${alert.message}</div>
      <div class="alert-time">${new Date(alert.timestamp).toLocaleTimeString()}</div>
    `;
    
    alertContainer.appendChild(alertElement);
    
    // Auto-remove after 10 seconds for non-critical alerts
    if (alert.severity !== 'critical') {
      setTimeout(() => {
        if (alertElement.parentElement) {
          alertElement.remove();
        }
      }, 10000);
    }
  }

  createAlertContainer() {
    const container = document.createElement('div');
    container.id = 'alerts-container';
    container.className = 'alerts-container';
    document.querySelector('.content').prepend(container);
    return container;
  }

  updatePerformanceCharts(data) {
    // Update throughput chart
    if (data.throughput) {
      new Chart('#throughput-chart', {
        type: 'doughnut',
        legend: ['Current Hour', 'Previous Hour'],
        data: [data.throughput.current, data.throughput.previous],
        label: { text: 'Req/s', color: COLORS[1] }
      });
    }

    // Update error rate
    if (data.errorRate !== undefined) {
      new Chart('#error-rate-bar', {
        type: 'bar',
        data: data.errorRate / 100
      });
      document.getElementById('error-rate-value').textContent = `${data.errorRate}%`;
    }
  }

  showConnectionStatus(status) {
    const statusElement = document.getElementById('connection-status');
    if (statusElement) {
      statusElement.className = `connection-status ${status}`;
      statusElement.textContent = status;
    }
  }

  scheduleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnection attempt ${this.reconnectAttempts} in ${this.reconnectInterval}ms`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectInterval);
    } else {
      console.error('Max reconnection attempts reached');
      this.showConnectionStatus('failed');
    }
  }

  formatBytes(bytes) {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Initialize real-time dashboard
const realtimeDashboard = new RealtimeDashboard('ws://localhost:8080/ws');

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  realtimeDashboard.disconnect();
});
```

## Advanced Scenarios

### 1. Multi-Environment Dashboard

```html
<!-- multi-environment.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Multi-Environment Health Dashboard</title>
  <link rel="stylesheet" href="css/reset.css">
  <link rel="stylesheet" href="css/common.css">
  <link rel="stylesheet" href="css/main.css">
  <style>
    .environment-tabs {
      display: flex;
      background: #f5f5f5;
      border-bottom: 1px solid #ddd;
      margin-bottom: 20px;
    }
    
    .environment-tab {
      padding: 10px 20px;
      cursor: pointer;
      border: none;
      background: none;
      font-size: 14px;
    }
    
    .environment-tab.active {
      background: #007cba;
      color: white;
    }
    
    .environment-content {
      display: none;
    }
    
    .environment-content.active {
      display: block;
    }
  </style>
</head>
<body>
  <header class="header">
    <div class="header__logo-container">
      <img class="header__logo-container__logo" src="img/logo.svg" alt="Logo">
    </div>
    <h1 class="header__title">Multi-Environment Health Dashboard</h1>
  </header>

  <main class="content">
    <!-- Environment Tabs -->
    <div class="environment-tabs">
      <button class="environment-tab active" data-env="production">Production</button>
      <button class="environment-tab" data-env="staging">Staging</button>
      <button class="environment-tab" data-env="development">Development</button>
    </div>

    <!-- Production Environment -->
    <div class="environment-content active" id="production-content">
      <div class="card">
        <div class="card-header">
          <h2>Production System Status</h2>
        </div>
        <canvas id="production-chart" width="534" height="200"></canvas>
      </div>
    </div>

    <!-- Staging Environment -->
    <div class="environment-content" id="staging-content">
      <div class="card">
        <div class="card-header">
          <h2>Staging System Status</h2>
        </div>
        <canvas id="staging-chart" width="534" height="200"></canvas>
      </div>
    </div>

    <!-- Development Environment -->
    <div class="environment-content" id="development-content">
      <div class="card">
        <div class="card-header">
          <h2>Development System Status</h2>
        </div>
        <canvas id="development-chart" width="534" height="200"></canvas>
      </div>
    </div>
  </main>

  <script src="js/global.js"></script>
  <script src="js/charts.js"></script>
  <script>
    class MultiEnvironmentDashboard {
      constructor() {
        this.environments = {
          production: {
            apiUrl: 'https://api.prod.example.com',
            data: null,
            charts: new Map()
          },
          staging: {
            apiUrl: 'https://api.staging.example.com',
            data: null,
            charts: new Map()
          },
          development: {
            apiUrl: 'https://api.dev.example.com',
            data: null,
            charts: new Map()
          }
        };
        
        this.currentEnvironment = 'production';
        this.init();
      }

      init() {
        this.setupTabs();
        this.loadEnvironmentData('production');
      }

      setupTabs() {
        const tabs = document.querySelectorAll('.environment-tab');
        tabs.forEach(tab => {
          tab.addEventListener('click', (e) => {
            const env = e.target.dataset.env;
            this.switchEnvironment(env);
          });
        });
      }

      switchEnvironment(env) {
        // Update active tab
        document.querySelectorAll('.environment-tab').forEach(tab => {
          tab.classList.remove('active');
        });
        document.querySelector(`[data-env="${env}"]`).classList.add('active');

        // Update active content
        document.querySelectorAll('.environment-content').forEach(content => {
          content.classList.remove('active');
        });
        document.getElementById(`${env}-content`).classList.add('active');

        this.currentEnvironment = env;
        this.loadEnvironmentData(env);
      }

      async loadEnvironmentData(env) {
        if (this.environments[env].data) {
          // Data already loaded
          return;
        }

        try {
          // Simulate API call
          const data = await this.fetchEnvironmentData(env);
          this.environments[env].data = data;
          this.createEnvironmentChart(env, data);
        } catch (error) {
          console.error(`Failed to load data for ${env}:`, error);
        }
      }

      async fetchEnvironmentData(env) {
        // Simulate different data for each environment
        const baseData = {
          production: {
            services: ['web', 'api', 'database', 'cache', 'queue'],
            values: [99, 98, 95, 100, 97],
            status: 'excellent'
          },
          staging: {
            services: ['web', 'api', 'database', 'cache'],
            values: [85, 90, 88, 92],
            status: 'good'
          },
          development: {
            services: ['web', 'api', 'database'],
            values: [70, 75, 80],
            status: 'warning'
          }
        };

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return baseData[env];
      }

      createEnvironmentChart(env, data) {
        const chartId = `#${env}-chart`;
        
        new Chart(chartId, {
          type: 'doughnut',
          legend: data.services,
          data: data.values,
          label: { 
            text: `${data.values.length}`, 
            color: COLORS[1] 
          }
        });
      }
    }

    // Initialize when page loads
    window.addEventListener('load', () => {
      new MultiEnvironmentDashboard();
    });
  </script>
</body>
</html>
```

### 2. Custom Report Templates

```javascript
// report-templates.js - Customizable report generation
class ReportTemplateEngine {
  constructor() {
    this.templates = new Map();
    this.registerDefaultTemplates();
  }

  registerDefaultTemplates() {
    // Executive Summary Template
    this.registerTemplate('executive-summary', {
      name: 'Executive Summary',
      sections: [
        { type: 'overview', title: 'System Overview' },
        { type: 'key-metrics', title: 'Key Performance Indicators' },
        { type: 'alerts', title: 'Critical Alerts' },
        { type: 'recommendations', title: 'Recommendations' }
      ],
      styling: {
        headerColor: '#2c3e50',
        accentColor: '#3498db',
        fontSize: '14px'
      }
    });

    // Technical Details Template
    this.registerTemplate('technical-details', {
      name: 'Technical Details',
      sections: [
        { type: 'system-health', title: 'System Health' },
        { type: 'service-metrics', title: 'Service Metrics' },
        { type: 'performance-charts', title: 'Performance Analysis' },
        { type: 'resource-usage', title: 'Resource Utilization' },
        { type: 'error-logs', title: 'Error Analysis' }
      ],
      styling: {
        headerColor: '#34495e',
        accentColor: '#e74c3c',
        fontSize: '12px'
      }
    });

    // Compliance Report Template
    this.registerTemplate('compliance', {
      name: 'Compliance Report',
      sections: [
        { type: 'compliance-overview', title: 'Compliance Status' },
        { type: 'security-metrics', title: 'Security Metrics' },
        { type: 'audit-trail', title: 'Audit Trail' },
        { type: 'policy-violations', title: 'Policy Violations' }
      ],
      styling: {
        headerColor: '#8e44ad',
        accentColor: '#9b59b6',
        fontSize: '13px'
      }
    });
  }

  registerTemplate(id, template) {
    this.templates.set(id, template);
  }

  async generateReport(templateId, data, options = {}) {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template '${templateId}' not found`);
    }

    const htmlContent = await this.renderTemplate(template, data, options);
    return htmlContent;
  }

  async renderTemplate(template, data, options) {
    const sections = await Promise.all(
      template.sections.map(section => this.renderSection(section, data, template.styling))
    );

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>${template.name}</title>
        <style>${this.generateCSS(template.styling)}</style>
      </head>
      <body>
        <div class="report-container">
          <header class="report-header">
            <h1>${template.name}</h1>
            <div class="report-meta">
              <p>Generated: ${new Date().toLocaleString()}</p>
              <p>Period: ${options.period || 'Last 24 hours'}</p>
            </div>
          </header>
          <main class="report-content">
            ${sections.join('\n')}
          </main>
          <footer class="report-footer">
            <p>Confidential - Internal Use Only</p>
          </footer>
        </div>
      </body>
      </html>
    `;
  }

  async renderSection(section, data, styling) {
    switch (section.type) {
      case 'overview':
        return this.renderOverviewSection(section, data);
      case 'key-metrics':
        return this.renderKeyMetricsSection(section, data);
      case 'performance-charts':
        return this.renderPerformanceChartsSection(section, data);
      case 'system-health':
        return this.renderSystemHealthSection(section, data);
      default:
        return `<section><h2>${section.title}</h2><p>Section not implemented</p></section>`;
    }
  }

  renderOverviewSection(section, data) {
    return `
      <section class="overview-section">
        <h2>${section.title}</h2>
        <div class="overview-grid">
          <div class="overview-item">
            <h3>System Status</h3>
            <div class="status-indicator ${data.overall_status}">${data.overall_status}</div>
          </div>
          <div class="overview-item">
            <h3>Uptime</h3>
            <div class="metric-value">${data.uptime}</div>
          </div>
          <div class="overview-item">
            <h3>Active Services</h3>
            <div class="metric-value">${data.active_services}/${data.total_services}</div>
          </div>
          <div class="overview-item">
            <h3>Response Time</h3>
            <div class="metric-value">${data.avg_response_time}ms</div>
          </div>
        </div>
      </section>
    `;
  }

  renderKeyMetricsSection(section, data) {
    const metrics = data.key_metrics || [];
    
    return `
      <section class="metrics-section">
        <h2>${section.title}</h2>
        <table class="metrics-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Current</th>
              <th>Target</th>
              <th>Status</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            ${metrics.map(metric => `
              <tr>
                <td>${metric.name}</td>
                <td>${metric.current}</td>
                <td>${metric.target}</td>
                <td><span class="status-badge ${metric.status}">${metric.status}</span></td>
                <td><span class="trend ${metric.trend}">${metric.trend}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </section>
    `;
  }

  renderPerformanceChartsSection(section, data) {
    return `
      <section class="charts-section">
        <h2>${section.title}</h2>
        <div class="charts-grid">
          <div class="chart-container">
            <h3>CPU Usage Over Time</h3>
            <!-- Chart placeholder - would be rendered by Chart.js -->
            <div class="chart-placeholder">CPU Usage Chart</div>
          </div>
          <div class="chart-container">
            <h3>Memory Usage Over Time</h3>
            <div class="chart-placeholder">Memory Usage Chart</div>
          </div>
          <div class="chart-container">
            <h3>Response Time Distribution</h3>
            <div class="chart-placeholder">Response Time Chart</div>
          </div>
          <div class="chart-container">
            <h3>Error Rate Trends</h3>
            <div class="chart-placeholder">Error Rate Chart</div>
          </div>
        </div>
      </section>
    `;
  }

  renderSystemHealthSection(section, data) {
    const services = data.services || [];
    
    return `
      <section class="health-section">
        <h2>${section.title}</h2>
        <div class="services-grid">
          ${services.map(service => `
            <div class="service-card">
              <h3>${service.name}</h3>
              <div class="service-status ${service.status}">${service.status}</div>
              <div class="service-metrics">
                <div class="metric">
                  <span class="metric-label">Response Time:</span>
                  <span class="metric-value">${service.response_time}ms</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Uptime:</span>
                  <span class="metric-value">${service.uptime}%</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Requests/min:</span>
                  <span class="metric-value">${service.requests_per_minute}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }

  generateCSS(styling) {
    return `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: ${styling.fontSize};
        line-height: 1.6;
        color: #333;
      }
      
      .report-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }
      
      .report-header {
        background: ${styling.headerColor};
        color: white;
        padding: 30px;
        margin-bottom: 30px;
        border-radius: 8px;
      }
      
      .report-header h1 {
        font-size: 28px;
        margin-bottom: 10px;
      }
      
      .report-meta {
        font-size: 14px;
        opacity: 0.9;
      }
      
      section {
        margin-bottom: 40px;
        background: white;
        padding: 25px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      
      section h2 {
        color: ${styling.headerColor};
        font-size: 22px;
        margin-bottom: 20px;
        border-bottom: 2px solid ${styling.accentColor};
        padding-bottom: 10px;
      }
      
      .overview-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
      }
      
      .overview-item {
        text-align: center;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 6px;
      }
      
      .overview-item h3 {
        font-size: 14px;
        color: #666;
        margin-bottom: 10px;
      }
      
      .metric-value {
        font-size: 24px;
        font-weight: bold;
        color: ${styling.accentColor};
      }
      
      .status-indicator {
        padding: 8px 16px;
        border-radius: 20px;
        font-weight: bold;
        text-transform: uppercase;
        font-size: 12px;
      }
      
      .status-indicator.excellent { background: #d4edda; color: #155724; }
      .status-indicator.good { background: #cce5ff; color: #004085; }
      .status-indicator.warning { background: #fff3cd; color: #856404; }
      .status-indicator.critical { background: #f8d7da; color: #721c24; }
      
      .metrics-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 15px;
      }
      
      .metrics-table th,
      .metrics-table td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #ddd;
      }
      
      .metrics-table th {
        background: ${styling.headerColor};
        color: white;
      }
      
      .charts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
      }
      
      .chart-container {
        padding: 15px;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
      }
      
      .chart-placeholder {
        height: 200px;
        background: #f5f5f5;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666;
        border-radius: 4px;
      }
      
      .services-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
      }
      
      .service-card {
        padding: 20px;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        background: #fafafa;
      }
      
      .service-card h3 {
        margin-bottom: 10px;
        color: ${styling.headerColor};
      }
      
      .service-status {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
        margin-bottom: 15px;
        display: inline-block;
      }
      
      .metric {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
      }
      
      .metric-label {
        color: #666;
        font-size: 13px;
      }
      
      .report-footer {
        text-align: center;
        padding: 20px;
        color: #666;
        font-size: 12px;
        border-top: 1px solid #eee;
        margin-top: 40px;
      }
      
      @media print {
        .report-container { max-width: none; margin: 0; padding: 0; }
        section { break-inside: avoid; }
      }
    `;
  }
}

// Usage example
async function generateCustomReport() {
  const templateEngine = new ReportTemplateEngine();
  
  const sampleData = {
    overall_status: 'good',
    uptime: '99.95%',
    active_services: 12,
    total_services: 12,
    avg_response_time: 145,
    key_metrics: [
      { name: 'API Response Time', current: '120ms', target: '<200ms', status: 'good', trend: 'stable' },
      { name: 'Database Queries/sec', current: '2,450', target: '>2,000', status: 'excellent', trend: 'up' },
      { name: 'Error Rate', current: '0.02%', target: '<0.1%', status: 'excellent', trend: 'down' },
      { name: 'Memory Usage', current: '67%', target: '<80%', status: 'good', trend: 'stable' }
    ],
    services: [
      { name: 'Web Frontend', status: 'excellent', response_time: 89, uptime: 99.98, requests_per_minute: 1250 },
      { name: 'API Gateway', status: 'good', response_time: 145, uptime: 99.95, requests_per_minute: 2100 },
      { name: 'Database', status: 'good', response_time: 23, uptime: 99.92, requests_per_minute: 850 },
      { name: 'Cache Layer', status: 'excellent', response_time: 12, uptime: 99.99, requests_per_minute: 3200 }
    ]
  };

  const reportHtml = await templateEngine.generateReport('executive-summary', sampleData, {
    period: 'Last 7 days'
  });
  
  return reportHtml;
}
```

## Automation Scripts

### 1. Daily Health Report Script

```bash
#!/bin/bash
# daily-health-report.sh - Automated daily health report generation

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
FRONTEND_URL="http://localhost:8080"
OUTPUT_DIR="$PROJECT_DIR/reports/daily"
DATE=$(date +%Y-%m-%d)
REPORT_NAME="health-report-$DATE.pdf"

# Logging
LOG_FILE="$PROJECT_DIR/logs/daily-report.log"
mkdir -p "$(dirname "$LOG_FILE")"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

error() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1" | tee -a "$LOG_FILE" >&2
}

# Check if frontend is running
check_frontend() {
    log "Checking if frontend is accessible..."
    if ! curl -f -s "$FRONTEND_URL" > /dev/null; then
        error "Frontend not accessible at $FRONTEND_URL"
        return 1
    fi
    log "Frontend is accessible"
}

# Start frontend if not running
start_frontend() {
    log "Starting frontend server..."
    cd "$PROJECT_DIR/frontend"
    
    # Kill any existing server on port 8080
    pkill -f "http-server.*8080" || true
    
    # Start new server in background
    npx http-server . -p 8080 -s &
    FRONTEND_PID=$!
    
    # Wait for server to start
    sleep 5
    
    # Check if server started successfully
    if ! check_frontend; then
        error "Failed to start frontend server"
        return 1
    fi
    
    log "Frontend server started (PID: $FRONTEND_PID)"
}

# Generate PDF report
generate_pdf() {
    log "Generating PDF report..."
    
    mkdir -p "$OUTPUT_DIR"
    cd "$PROJECT_DIR/printer"
    
    # Generate PDF with custom options
    node index.js \
        --target "$FRONTEND_URL" \
        --output "$OUTPUT_DIR/$REPORT_NAME"
    
    if [ -f "$OUTPUT_DIR/$REPORT_NAME" ]; then
        local file_size=$(stat -f%z "$OUTPUT_DIR/$REPORT_NAME" 2>/dev/null || stat -c%s "$OUTPUT_DIR/$REPORT_NAME")
        log "PDF generated successfully: $REPORT_NAME ($file_size bytes)"
    else
        error "PDF generation failed"
        return 1
    fi
}

# Cleanup old reports (keep last 30 days)
cleanup_old_reports() {
    log "Cleaning up old reports..."
    find "$OUTPUT_DIR" -name "health-report-*.pdf" -mtime +30 -delete
    log "Old reports cleaned up"
}

# Send notification
send_notification() {
    local report_path="$OUTPUT_DIR/$REPORT_NAME"
    local file_size=$(stat -f%z "$report_path" 2>/dev/null || stat -c%s "$report_path")
    local file_size_mb=$(echo "scale=2; $file_size / 1024 / 1024" | bc)
    
    # Example: Send Slack notification
    if [ -n "$SLACK_WEBHOOK_URL" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{
                \"text\": \"Daily health report generated\",
                \"attachments\": [{
                    \"color\": \"good\",
                    \"fields\": [
                        {\"title\": \"Date\", \"value\": \"$DATE\", \"short\": true},
                        {\"title\": \"Size\", \"value\": \"${file_size_mb} MB\", \"short\": true},
                        {\"title\": \"Location\", \"value\": \"$report_path\", \"short\": false}
                    ]
                }]
            }" \
            "$SLACK_WEBHOOK_URL"
    fi
    
    # Example: Send email
    if command -v mail >/dev/null 2>&1 && [ -n "$EMAIL_RECIPIENT" ]; then
        echo "Daily health report for $DATE has been generated." | \
        mail -s "Health Report - $DATE" \
             -a "$report_path" \
             "$EMAIL_RECIPIENT"
    fi
    
    log "Notification sent"
}

# Error handling
handle_error() {
    error "Script failed at line $1"
    
    # Cleanup
    if [ -n "$FRONTEND_PID" ]; then
        kill "$FRONTEND_PID" 2>/dev/null || true
    fi
    
    # Send error notification
    if [ -n "$SLACK_WEBHOOK_URL" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{
                \"text\": \"❌ Daily health report generation failed\",
                \"attachments\": [{
                    \"color\": \"danger\",
                    \"fields\": [
                        {\"title\": \"Date\", \"value\": \"$DATE\", \"short\": true},
                        {\"title\": \"Error\", \"value\": \"Check logs: $LOG_FILE\", \"short\": false}
                    ]
                }]
            }" \
            "$SLACK_WEBHOOK_URL"
    fi
    
    exit 1
}

trap 'handle_error $LINENO' ERR

# Main execution
main() {
    log "Starting daily health report generation"
    
    # Check if frontend is already running, if not start it
    if ! check_frontend; then
        start_frontend
        STARTED_FRONTEND=true
    else
        log "Frontend already running"
        STARTED_FRONTEND=false
    fi
    
    # Generate PDF
    generate_pdf
    
    # Cleanup
    cleanup_old_reports
    
    # Send notification
    send_notification
    
    # Stop frontend if we started it
    if [ "$STARTED_FRONTEND" = true ] && [ -n "$FRONTEND_PID" ]; then
        log "Stopping frontend server (PID: $FRONTEND_PID)"
        kill "$FRONTEND_PID"
    fi
    
    log "Daily health report generation completed successfully"
}

# Run main function
main "$@"
```

### 2. Batch PDF Generation Script

```bash
#!/bin/bash
# batch-pdf-generation.sh - Generate multiple PDF reports

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
CONFIG_FILE="$SCRIPT_DIR/batch-config.json"
OUTPUT_DIR="$PROJECT_DIR/reports/batch"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Default configuration
DEFAULT_CONFIG='{
  "baseUrl": "http://localhost:8080",
  "reports": [
    {
      "name": "overview",
      "path": "/",
      "title": "System Overview"
    },
    {
      "name": "detailed",
      "path": "/#detailed",
      "title": "Detailed Report"
    }
  ],
  "pdfOptions": {
    "format": "A4",
    "scale": 0.95
  }
}'

# Create default config if it doesn't exist
if [ ! -f "$CONFIG_FILE" ]; then
    echo "$DEFAULT_CONFIG" > "$CONFIG_FILE"
    echo "Created default config file: $CONFIG_FILE"
fi

# Parse JSON config
parse_config() {
    if command -v jq >/dev/null 2>&1; then
        # Use jq if available
        BASE_URL=$(jq -r '.baseUrl' "$CONFIG_FILE")
        REPORT_COUNT=$(jq '.reports | length' "$CONFIG_FILE")
    else
        # Fallback to basic parsing
        BASE_URL=$(grep -o '"baseUrl":"[^"]*"' "$CONFIG_FILE" | cut -d'"' -f4)
        REPORT_COUNT=$(grep -o '"name":"[^"]*"' "$CONFIG_FILE" | wc -l)
    fi
}

# Generate single PDF
generate_single_pdf() {
    local index=$1
    local name path title url output_file
    
    if command -v jq >/dev/null 2>&1; then
        name=$(jq -r ".reports[$index].name" "$CONFIG_FILE")
        path=$(jq -r ".reports[$index].path" "$CONFIG_FILE")
        title=$(jq -r ".reports[$index].title" "$CONFIG_FILE")
    else
        # Basic parsing fallback
        name=$(sed -n "$((index + 1))p" <<< "$(grep -o '"name":"[^"]*"' "$CONFIG_FILE" | cut -d'"' -f4)")
        path=$(sed -n "$((index + 1))p" <<< "$(grep -o '"path":"[^"]*"' "$CONFIG_FILE" | cut -d'"' -f4)")
        title=$(sed -n "$((index + 1))p" <<< "$(grep -o '"title":"[^"]*"' "$CONFIG_FILE" | cut -d'"' -f4)")
    fi
    
    url="${BASE_URL}${path}"
    output_file="$OUTPUT_DIR/${name}-${TIMESTAMP}.pdf"
    
    echo "Generating: $title"
    echo "  URL: $url"
    echo "  Output: $output_file"
    
    cd "$PROJECT_DIR/printer"
    
    if node index.js --target "$url" --output "$output_file"; then
        echo "  ✓ Success"
        return 0
    else
        echo "  ✗ Failed"
        return 1
    fi
}

# Main batch generation
batch_generate() {
    parse_config
    
    echo "Starting batch PDF generation..."
    echo "Base URL: $BASE_URL"
    echo "Number of reports: $REPORT_COUNT"
    echo "Output directory: $OUTPUT_DIR"
    echo ""
    
    mkdir -p "$OUTPUT_DIR"
    
    local success_count=0
    local failure_count=0
    
    for ((i=0; i<REPORT_COUNT; i++)); do
        echo "[$((i + 1))/$REPORT_COUNT]"
        
        if generate_single_pdf "$i"; then
            ((success_count++))
        else
            ((failure_count++))
        fi
        
        echo ""
    done
    
    echo "Batch generation completed:"
    echo "  ✓ Successful: $success_count"
    echo "  ✗ Failed: $failure_count"
    
    if [ $failure_count -gt 0 ]; then
        exit 1
    fi
}

# Command line options
case "${1:-}" in
    --config)
        echo "Current configuration:"
        cat "$CONFIG_FILE" | jq '.' 2>/dev/null || cat "$CONFIG_FILE"
        ;;
    --list)
        echo "Available reports:"
        if command -v jq >/dev/null 2>&1; then
            jq -r '.reports[] | "- \(.name): \(.title) (\(.path))"' "$CONFIG_FILE"
        else
            grep -o '"name":"[^"]*"' "$CONFIG_FILE" | cut -d'"' -f4 | sed 's/^/- /'
        fi
        ;;
    --help|-h)
        echo "Usage: $0 [OPTIONS]"
        echo ""
        echo "Options:"
        echo "  --config     Show current configuration"
        echo "  --list       List available reports"
        echo "  --help       Show this help message"
        echo ""
        echo "Configuration file: $CONFIG_FILE"
        ;;
    *)
        batch_generate
        ;;
esac
```