# Frontend Components Documentation

## Overview

This document provides comprehensive documentation for the Kubernetes Health Report Dashboard frontend components. The application is built with semantic HTML, modular CSS, and vanilla JavaScript, designed to display health monitoring data with support for both screen and print media.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Core Components](#core-components)
  - [Header Component](#header-component)
  - [Card Component](#card-component)
  - [Status Components](#status-components)
  - [Chart Components](#chart-components)
  - [Table Components](#table-components)
  - [Navigation Components](#navigation-components)
- [Layout System](#layout-system)
- [CSS Architecture](#css-architecture)
- [Print Styling](#print-styling)
- [Responsive Design](#responsive-design)
- [Usage Examples](#usage-examples)
- [Component Guidelines](#component-guidelines)

## Architecture Overview

### File Structure

```
frontend/
├── index.html          # Main HTML structure
├── css/
│   ├── reset.css      # Browser reset styles
│   ├── common.css     # Reusable components and utilities
│   └── main.css       # Layout and specific component styles
├── js/
│   ├── global.js      # Utility functions
│   ├── charts.js      # Chart library
│   └── main.js        # Application initialization
└── img/               # Image assets
```

### Design Principles

- **Semantic HTML**: Proper use of HTML5 semantic elements
- **Modular CSS**: Component-based styling with BEM-like naming
- **Print-First**: Optimized for PDF generation via Puppeteer
- **Accessibility**: Proper heading hierarchy and semantic structure
- **Performance**: Minimal dependencies, optimized for rendering

## Core Components

### Header Component

The header provides branding and navigation for the dashboard.

#### HTML Structure

```html
<header id="top" class="header">
  <div class="header__logo-container">
    <img class="header__logo-container__logo" src="img/logo.svg" alt="logo" />
  </div>
  <h1 class="header__title">Kubernetes 健康检查</h1>
</header>
```

#### CSS Classes

| Class | Description | Usage |
|-------|-------------|-------|
| `.header` | Main header container | Dark background, flex layout |
| `.header__logo-container` | Logo wrapper with separator | Centered logo with border |
| `.header__logo-container__logo` | Logo image styling | Responsive logo dimensions |
| `.header__title` | Main page title | White text, 18px font |

#### Styling Properties

```css
.header {
  display: flex;
  align-items: center;
  background: #262626;
  height: 50px;
}

.header__title {
  color: #fff;
  font-size: 18px;
}
```

#### Print Behavior

```css
@media print {
  .header {
    display: none;  /* Hidden in PDF output */
  }
}
```

#### Usage Example

```html
<!-- Basic header implementation -->
<header class="header">
  <div class="header__logo-container">
    <img class="header__logo-container__logo" 
         src="path/to/logo.svg" 
         alt="Company Logo" />
  </div>
  <h1 class="header__title">Dashboard Title</h1>
</header>
```

---

### Card Component

Cards are the primary container component for organizing content sections.

#### HTML Structure

```html
<div class="card">
  <div class="card-header">
    <h2>Card Title</h2>
    <!-- Optional: Additional header content -->
  </div>
  <!-- Card content -->
</div>
```

#### CSS Classes

| Class | Description | Properties |
|-------|-------------|------------|
| `.card` | Main card container | White background, rounded corners, padding |
| `.card-header` | Card header section | Flex layout, bottom padding |

#### Styling Properties

```css
.card {
  padding: 20px;
  margin-bottom: 16px;
  border-radius: 2px;
  background: #fff;
}

.card-header {
  height: 28px;
  line-height: 1.4;
  display: flex;
  align-items: center;
  padding-bottom: 16px;
}
```

#### Variations

##### Basic Card
```html
<div class="card">
  <div class="card-header">
    <h2>System Status</h2>
  </div>
  <p>Card content goes here...</p>
</div>
```

##### Card with Status Legend
```html
<div class="card">
  <div class="card-header">
    <h2>Health Overview</h2>
    <ul class="status-list">
      <li class="status-item excellent">优</li>
      <li class="status-item success">良好</li>
      <li class="status-item warning">及格</li>
      <li class="status-item error">不及格</li>
    </ul>
  </div>
  <!-- Content -->
</div>
```

##### Resource Card with Page Break
```html
<div class="resource card" style="page-break-after:always;" id="resource-1">
  <div class="card-header">
    <h3>Resource Name</h3>
    <div style="display: flex;align-items: center;">
      <span style="margin-right: 4px;">状态图例</span>
      <ul class="status-list">
        <!-- Status items -->
      </ul>
    </div>
  </div>
  <!-- Resource content -->
</div>
```

---

### Status Components

Status components provide visual indicators for health and state information.

#### Status List

```html
<ul class="status-list">
  <li class="status-item excellent">优</li>
  <li class="status-item success">良好</li>
  <li class="status-item warning">及格</li>
  <li class="status-item error">不及格</li>
</ul>
```

#### CSS Classes

| Class | Description | Color | Background |
|-------|-------------|-------|------------|
| `.status-list` | Container for status items | - | Flex layout |
| `.status-item` | Base status item | #ccc | #f4f4f4 |
| `.status-item.excellent` | Excellent status | #fff | #006eff (blue) |
| `.status-item.success` | Success status | #fff | #0abf5b (green) |
| `.status-item.warning` | Warning status | #fff | #ff9d00 (orange) |
| `.status-item.error` | Error status | #fff | #e54545 (red) |

#### Styling Properties

```css
.status-list {
  display: flex;
  text-align: center;
  text-indent: 0;
}

.status-item {
  display: inline-block;
  height: 20px;
  line-height: 20px;
  padding: 0 8px;
  margin: 0 4px;
  border-radius: 10px;
  color: #ccc;
  background: #f4f4f4;
}

.status-item.excellent,
.status-item.success,
.status-item.warning,
.status-item.error {
  color: #fff;
}
```

#### Health Index Component

```html
<td class="health-index">
  <ul>
    <li>正常：<span class="health-index_success">14</span></li>
    <li>故障：<span class="health-index_error">14</span></li>
    <li>总数：<span>18</span></li>
  </ul>
</td>
```

#### Usage Examples

```html
<!-- Single status indicator -->
<div class="status-item success">良好</div>

<!-- Status legend in header -->
<div class="card-header">
  <h2>Component Health</h2>
  <ul class="status-list">
    <li class="status-item excellent">优</li>
    <li class="status-item success">良好</li>
    <li class="status-item warning">及格</li>
    <li class="status-item error">不及格</li>
  </ul>
</div>

<!-- Health metrics -->
<div class="health-index">
  <ul>
    <li>Running: <span class="health-index_success">25</span></li>
    <li>Failed: <span class="health-index_error">3</span></li>
    <li>Total: <span>28</span></li>
  </ul>
</div>
```

---

### Chart Components

Chart components integrate with the Charts.js library to display data visualizations.

#### Canvas Elements

```html
<!-- Doughnut chart -->
<canvas id="node-chart" width="534" height="200"></canvas>

<!-- Bar chart (progress indicator) -->
<canvas id="bar1" width="160" height="14"></canvas>
```

#### Chart Integration

Charts are initialized via JavaScript using the Chart class:

```javascript
// Doughnut chart
new Chart("#node-chart", {
  type: "doughnut",
  legend: ["数学", "历史", "英语"],
  data: [100, 50, 50],
  label: { text: "50%", color: COLORS[1] }
});

// Bar chart
new Chart("#bar1", {
  type: "bar",
  data: 0.85  // 85% completion
});
```

#### Chart Container Patterns

##### Health Status Chart
```html
<div class="health-status-list-item">
  <div class="health-status-list-item__header">
    <h3><a class="link" href="#node">Node</a></h3>
    <ul class="status-list">
      <li class="status-item error">不及格</li>
    </ul>
  </div>
  <div class="health-status-list-item__body">
    <canvas id="node-chart" width="534" height="200"></canvas>
  </div>
</div>
```

##### Table-Embedded Bar Chart
```html
<td>
  <canvas id="bar1" width="160" height="14"></canvas>
</td>
```

#### Responsive Chart Sizing

```css
/* Ensure charts scale properly */
canvas {
  max-width: 100%;
  height: auto;
}

@media print {
  canvas {
    break-inside: avoid;
    page-break-inside: avoid;
  }
}
```

---

### Table Components

Tables display structured data with consistent styling and status indicators.

#### Basic Table Structure

```html
<table class="other-status-table">
  <thead>
    <tr>
      <th width="15%">指标</th>
      <th width="20%">健康指数</th>
      <th width="40%">详情</th>
      <th width="25%">状态</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a class="link" href="#pod">Pod</a></td>
      <td>
        <canvas id="bar1" width="160" height="14"></canvas>
      </td>
      <td class="health-index">
        <ul>
          <li>正常：<span class="health-index_success">14</span></li>
          <li>故障：<span class="health-index_error">14</span></li>
          <li>总数：<span>18</span></li>
        </ul>
      </td>
      <td>
        <ul class="status-list">
          <li class="status-item success">良好</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>
```

#### CSS Classes

| Class | Description | Usage |
|-------|-------------|-------|
| `.other-status-table` | Overview table styling | System status overview |
| `.resource-table` | Resource detail table | Detailed resource listings |

#### Table Styling

```css
table {
  width: 100%;
  table-layout: fixed;
  word-break: break-all;
}

table thead {
  font-weight: 500;
}

table thead tr th {
  background: #fafafa;
  border-top: 1px solid #ededed;
  border-bottom: 1px solid #ededed;
}

table tr,
table td {
  line-height: 40px;
  vertical-align: middle;
}

table tbody tr {
  border-bottom: 1px solid #ededed;
}
```

#### Resource Table Pattern

```html
<table class="resource-table">
  <thead>
    <tr>
      <th width="39%">名称</th>
      <th width="10%">状态</th>
      <th width="2%"></th>
      <th width="39%">名称</th>
      <th width="10%">状态</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>resource-name</td>
      <td>
        <div class="status-item success">良好</div>
      </td>
      <td></td>
      <td>resource-name-2</td>
      <td>
        <div class="status-item warning">及格</div>
      </td>
    </tr>
  </tbody>
</table>
```

---

### Navigation Components

Navigation components provide internal linking and page navigation.

#### Elevator Button

```html
<a class="elevator" href="#top">
  <img src="./img/arrow-down.svg" alt="arrow" />
</a>
```

#### Internal Links

```html
<a class="link" href="#node">Node</a>
<a class="link" href="#master">Master</a>
<a class="link" href="#pod">Pod</a>
```

#### Link Styling

```css
.link {
  color: #006eff;
}

a {
  text-decoration: none;
}
```

---

## Layout System

### Container Layout

```css
.content {
  width: 1160px;
  margin: 20px auto;
}

@media print {
  .content {
    width: 100%;
    margin: 0 auto;
  }
}
```

### Cluster Status Layout

```css
.cluster-status-list {
  width: 100%;
  display: flex;
  flex-flow: row wrap;
}

.cluster-status-list-item {
  flex: 1 1 50%;
  height: 20px;
  line-height: 20px;
}
```

### Health Status Layout

```css
.health-status-list-item {
  /* Individual health status item styling */
}

.health-status-list-item__header {
  /* Header section with title and status */
}

.health-status-list-item__body {
  /* Content area for charts */
}
```

## CSS Architecture

### File Organization

#### reset.css
- Browser normalization
- Cross-browser consistency
- Basic element resets

#### common.css
- Reusable components (cards, status, tables)
- Utility classes
- Typography scales
- Color definitions

#### main.css
- Layout-specific styles
- Component arrangements
- Page-specific styling
- Print media queries

### Naming Conventions

The project uses a BEM-inspired naming convention:

```css
/* Block */
.header { }

/* Block__Element */
.header__title { }
.header__logo-container { }

/* Block__Element__SubElement */
.header__logo-container__logo { }

/* Modifier classes */
.status-item.excellent { }
.status-item.success { }
```

### Color System

```css
/* Status Colors */
.excellent { background: #006eff; }  /* Blue */
.success { background: #0abf5b; }    /* Green */
.warning { background: #ff9d00; }    /* Orange */
.error { background: #e54545; }      /* Red */

/* Text Colors */
.link { color: #006eff; }            /* Link blue */
.text { color: #333; }               /* Main text */

/* Background Colors */
body { background: #f2f2f2; }       /* Page background */
.card { background: #fff; }         /* Card background */
.header { background: #262626; }    /* Header background */
```

## Print Styling

The application is optimized for PDF generation with comprehensive print styles.

### Print Media Queries

```css
@media print {
  html, body {
    background: #fff;
  }
  
  .header {
    display: none;
  }
  
  .content {
    width: 100%;
    margin: 0 auto;
  }
  
  canvas {
    break-inside: avoid;
    page-break-inside: avoid;
  }
}
```

### Page Breaks

```css
/* Force page break after element */
.resource {
  page-break-after: always;
}

/* Prevent page breaks inside element */
.card {
  page-break-inside: avoid;
}
```

### Print-Specific Styling

```html
<!-- Page break control -->
<div style="page-break-after:always;" id="master" class="resource card">
  <!-- Content that should start on new page -->
</div>

<!-- Print region markers -->
<!-- start print -->
<main class="content">
  <!-- Printable content -->
</main>
<!-- end print -->
```

## Responsive Design

### Breakpoint Strategy

```css
/* Desktop (default) */
.content {
  width: 1160px;
  margin: 20px auto;
}

/* Print */
@media print {
  .content {
    width: 100%;
    margin: 0 auto;
  }
}
```

### Flexible Layouts

```css
/* Flexible status list */
.cluster-status-list {
  display: flex;
  flex-flow: row wrap;
}

.cluster-status-list-item {
  flex: 1 1 50%;
}

/* Responsive tables */
table {
  width: 100%;
  table-layout: fixed;
}
```

## Usage Examples

### Complete Health Status Section

```html
<div class="card health-status">
  <div class="card-header">
    <h2>Kubernetes 整体健康状态</h2>
    <ul class="status-list">
      <li class="status-item">优</li>
      <li class="status-item">良好</li>
      <li class="status-item warning">及格</li>
      <li class="status-item">不及格</li>
    </ul>
  </div>
  <ul class="health-status-list">
    <li>
      <div class="health-status-list-item">
        <div class="health-status-list-item__header">
          <h3><a class="link" href="#node">Node</a></h3>
          <ul class="status-list">
            <li class="status-item error">不及格</li>
          </ul>
        </div>
        <div class="health-status-list-item__body">
          <canvas id="node-chart" width="534" height="200"></canvas>
        </div>
      </div>
    </li>
  </ul>
</div>

<script>
new Chart("#node-chart", {
  type: "doughnut",
  legend: ["数学", "历史", "英语"],
  data: [100, 50, 50],
  label: { text: "50%", color: COLORS[1] }
});
</script>
```

### Resource Overview Table

```html
<div class="card">
  <div class="card-header">
    <h2>其它资源健康概览</h2>
  </div>
  <table class="other-status-table">
    <thead>
      <tr>
        <th width="15%">指标</th>
        <th width="20%">健康指数</th>
        <th width="40%">详情</th>
        <th width="25%">状态</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a class="link" href="#pod">Pod</a></td>
        <td>
          <canvas id="bar1" width="160" height="14"></canvas>
        </td>
        <td class="health-index">
          <ul>
            <li>正常：<span class="health-index_success">14</span></li>
            <li>故障：<span class="health-index_error">14</span></li>
            <li>总数：<span>18</span></li>
          </ul>
        </td>
        <td>
          <ul class="status-list">
            <li class="status-item success">良好</li>
          </ul>
        </td>
      </tr>
    </tbody>
  </table>
</div>

<script>
new Chart("#bar1", {
  type: "bar",
  data: 0.85
});
</script>
```

### System Status Overview

```html
<div class="card">
  <div class="card-header">
    <h2>Kubernetes 系统集群状态</h2>
  </div>
  <ul class="cluster-status-list">
    <li class="cluster-status-list-item">
      <span class="cluster-status-list-item__name">版本：</span>
      <span class="cluster-status-list-item__value">v1.13.4</span>
    </li>
    <li class="cluster-status-list-item">
      <span class="cluster-status-list-item__name">deployment 数量：</span>
      <span class="cluster-status-list-item__value">302</span>
    </li>
    <li class="cluster-status-list-item">
      <span class="cluster-status-list-item__name">master 数量：</span>
      <span class="cluster-status-list-item__value">30</span>
    </li>
    <li class="cluster-status-list-item">
      <span class="cluster-status-list-item__name">node 数量：</span>
      <span class="cluster-status-list-item__value">450</span>
    </li>
  </ul>
</div>
```

## Component Guidelines

### Development Best Practices

#### HTML Structure
1. **Semantic Elements**: Use appropriate HTML5 semantic tags
2. **Accessibility**: Include proper ARIA labels and alt attributes
3. **Hierarchy**: Maintain proper heading hierarchy (h1 → h2 → h3)
4. **IDs for Anchors**: Use meaningful IDs for navigation targets

#### CSS Guidelines
1. **Class Naming**: Follow BEM-inspired naming conventions
2. **Specificity**: Keep specificity low, avoid deep nesting
3. **Reusability**: Create reusable component classes
4. **Print Support**: Always consider print media styling

#### JavaScript Integration
1. **Progressive Enhancement**: Ensure basic functionality without JS
2. **Canvas IDs**: Use descriptive, unique IDs for chart elements
3. **Data Binding**: Separate data from presentation logic
4. **Error Handling**: Gracefully handle missing elements

### Performance Considerations

#### CSS Optimization
```css
/* Efficient selectors */
.status-item { }                    /* Good */
.card .status-list .status-item { } /* Avoid */

/* Use transforms for animations */
.elevator {
  transform: translateY(0);
  transition: transform 0.2s ease;
}
```

#### HTML Optimization
```html
<!-- Efficient structure -->
<div class="health-status-list">
  <div class="health-status-list-item">
    <!-- Content -->
  </div>
</div>
```

#### Print Optimization
```css
@media print {
  /* Remove non-essential elements */
  .header, .elevator {
    display: none;
  }
  
  /* Optimize for PDF generation */
  .card {
    break-inside: avoid;
  }
}
```

### Accessibility Guidelines

#### Semantic HTML
```html
<!-- Good semantic structure -->
<main class="content">
  <section class="card">
    <header class="card-header">
      <h2>Section Title</h2>
    </header>
    <!-- Section content -->
  </section>
</main>
```

#### ARIA Labels
```html
<!-- Accessible charts -->
<canvas id="chart-1" 
        width="534" 
        height="200"
        role="img"
        aria-label="Node health distribution chart">
</canvas>

<!-- Accessible status indicators -->
<div class="status-item success" 
     role="status" 
     aria-label="Status: Good">
  良好
</div>
```

#### Color Accessibility
```css
/* Ensure sufficient contrast */
.status-item {
  color: #fff;           /* White text */
  background: #0abf5b;   /* Green background - sufficient contrast */
}

.link {
  color: #006eff;        /* Blue - sufficient contrast on white */
}
```

### Browser Compatibility

#### Supported Features
- **Flexbox**: Full support (IE 11+)
- **Canvas API**: Full support (IE 9+)
- **CSS Grid**: Not used (for better compatibility)
- **ES6 Classes**: Transpiled for older browsers

#### Fallbacks
```css
/* Flexbox fallback */
.status-list {
  display: table;           /* Fallback */
  display: flex;           /* Modern browsers */
}

.status-item {
  display: table-cell;     /* Fallback */
  display: inline-block;   /* Flex item */
}
```

### Testing Guidelines

#### Cross-Browser Testing
- Test in Chrome, Firefox, Safari, Edge
- Verify print output in each browser
- Check chart rendering consistency

#### Print Testing
- Generate PDF via Puppeteer
- Verify page breaks and layout
- Check chart quality and sizing

#### Accessibility Testing
- Test with screen readers
- Verify keyboard navigation
- Check color contrast ratios

This component documentation provides a comprehensive guide for understanding, using, and extending the frontend components of the health report dashboard.