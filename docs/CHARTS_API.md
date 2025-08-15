# Charts.js Library Documentation

## Overview

Charts.js is a lightweight, custom JavaScript library for creating interactive canvas-based charts. It currently supports two chart types: doughnut (pie) charts and bar charts. The library is built using native HTML5 Canvas API and provides a simple, intuitive interface for data visualization.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Chart Class](#chart-class)
- [Chart Types](#chart-types)
  - [Doughnut Charts](#doughnut-charts)
  - [Bar Charts](#bar-charts)
- [Legend Class](#legend-class)
- [Configuration Options](#configuration-options)
- [Styling and Colors](#styling-and-colors)
- [Examples](#examples)
- [API Reference](#api-reference)
- [Browser Support](#browser-support)

## Installation

### Include in HTML

```html
<!-- Include the global utilities first -->
<script src="js/global.js"></script>
<!-- Then include the charts library -->
<script src="js/charts.js"></script>
```

### Canvas Element Setup

Charts require a `<canvas>` element in your HTML:

```html
<canvas id="my-chart" width="200" height="200"></canvas>
```

## Quick Start

### Basic Doughnut Chart

```javascript
new Chart("#my-doughnut", {
  type: "doughnut",
  legend: ["Category A", "Category B", "Category C"],
  data: [30, 45, 25],
  label: { text: "75%", color: "#0abf5b" }
});
```

### Basic Bar Chart

```javascript
new Chart("#my-bar", {
  type: "bar",
  data: 0.75  // Value between 0 and 1
});
```

## Chart Class

### Constructor

```javascript
new Chart(selector, options)
```

#### Parameters

- **selector** (string): CSS selector for the target canvas element
- **options** (object): Configuration object for the chart

#### Example

```javascript
const chart = new Chart("#chart-container", {
  type: "doughnut",
  legend: ["Apple", "Orange", "Banana"],
  data: [40, 35, 25],
  label: { text: "Total", color: "#333" }
});
```

### Internal Methods

The Chart class contains several internal methods that handle the rendering:

#### `_init(selector)`
- Initializes the canvas context
- Sets up pixel ratio for high-DPI displays
- Configures canvas dimensions and scaling
- Returns the 2D rendering context

#### `_doughnut(ctx)`
- Renders doughnut chart components
- Calls `_drawArcs()`, `_drawLegends()`, and `_drawLabel()`

#### `_bar(ctx)`
- Renders bar chart with progress indicator
- Handles percentage display and styling

## Chart Types

### Doughnut Charts

Doughnut charts display data as segments of a circle with a hollow center, perfect for showing proportional data.

#### Configuration Options

```javascript
{
  type: "doughnut",
  legend: Array<string>,     // Labels for each segment
  data: Array<number>,       // Values for each segment
  label: {                   // Center label configuration
    text: string,            // Text to display in center
    color: string            // Color of the center text
  }
}
```

#### Features

- **Automatic Color Assignment**: Uses predefined color palette
- **Proportional Segments**: Automatically calculates segment sizes
- **Center Label**: Customizable text in the center
- **Legend Display**: Shows colored indicators with labels
- **Data Filtering**: Automatically filters out zero/negative values

#### Example

```javascript
new Chart("#sales-chart", {
  type: "doughnut",
  legend: ["Q1 Sales", "Q2 Sales", "Q3 Sales", "Q4 Sales"],
  data: [25000, 32000, 28000, 35000],
  label: { text: "$120K", color: "#006eff" }
});
```

### Bar Charts

Bar charts display a single value as a horizontal progress bar with percentage indication.

#### Configuration Options

```javascript
{
  type: "bar",
  data: number              // Value between 0 and 1 (represents percentage)
}
```

#### Features

- **Progress Visualization**: Shows completion percentage
- **Automatic Percentage Display**: Converts decimal to percentage text
- **Responsive Design**: Adapts to canvas size
- **Data Validation**: Clamps values between 0 and 1

#### Example

```javascript
// 75.23% completion
new Chart("#progress-bar", {
  type: "bar",
  data: 0.7523
});
```

## Legend Class

The Legend class creates colored indicators with text labels for doughnut charts.

### Constructor

```javascript
new Legend(ctx, text, x, y, color)
```

#### Parameters

- **ctx** (CanvasRenderingContext2D): Canvas rendering context
- **text** (string): Label text to display
- **x** (number): X coordinate for the legend item
- **y** (number): Y coordinate for the legend item
- **color** (string): Color for the legend indicator

#### Visual Appearance

- **Indicator**: 4px radius circle
- **Text**: 12px serif font in black
- **Spacing**: 10px between indicator and text

## Configuration Options

### Global Constants

```javascript
const FONT_SIZE = 12;                                    // Default font size
const COLORS = ["#e54545", "#0abf5b", "#006eff", "#ff9d00"]; // Color palette
```

### Chart Type Definitions

```javascript
const CHARTS = [
  { type: "doughnut", method: "_doughnut" },
  { type: "bar", method: "_bar" }
];
```

### Canvas Settings

- **Line Width**: 10px for chart segments
- **High-DPI Support**: Automatic pixel ratio detection
- **Font**: Serif font family for all text elements

## Styling and Colors

### Default Color Palette

1. **Red**: `#e54545` - Primary accent color
2. **Green**: `#0abf5b` - Success/positive values
3. **Blue**: `#006eff` - Information/neutral values
4. **Orange**: `#ff9d00` - Warning/attention values

### Color Assignment

Colors are assigned cyclically using modulo operation:
```javascript
color = COLORS[i % COLORS.length];
```

### Customizing Colors

To use custom colors, modify the `COLORS` array:

```javascript
// Custom color palette
const COLORS = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4"];
```

### Font Styling

- **Default Font**: 12px serif
- **Center Label Font**: 22px serif
- **Bar Chart Percentage**: 14px serif
- **Text Color**: Black (#000000) for most text
- **Legend Text**: Black with middle baseline alignment

## Examples

### Complete Doughnut Chart Example

```html
<canvas id="revenue-chart" width="300" height="300"></canvas>

<script>
// Revenue distribution chart
new Chart("#revenue-chart", {
  type: "doughnut",
  legend: [
    "Product Sales",
    "Service Revenue", 
    "Subscription Income",
    "Other Sources"
  ],
  data: [45000, 28000, 15000, 7000],
  label: { 
    text: "$95K", 
    color: "#006eff" 
  }
});
</script>
```

### Multiple Bar Charts Example

```html
<div class="progress-container">
  <canvas id="task1" width="200" height="30"></canvas>
  <canvas id="task2" width="200" height="30"></canvas>
  <canvas id="task3" width="200" height="30"></canvas>
</div>

<script>
// Project completion progress
new Chart("#task1", { type: "bar", data: 0.85 });  // 85% complete
new Chart("#task2", { type: "bar", data: 0.60 });  // 60% complete
new Chart("#task3", { type: "bar", data: 1.0 });   // 100% complete
</script>
```

### Dynamic Chart Creation

```javascript
// Dynamic chart based on API data
fetch('/api/analytics')
  .then(response => response.json())
  .then(data => {
    new Chart("#analytics-chart", {
      type: "doughnut",
      legend: data.categories,
      data: data.values,
      label: { 
        text: `${data.total}%`, 
        color: COLORS[1] 
      }
    });
  });
```

### Responsive Chart Setup

```javascript
function createResponsiveChart(containerId, data) {
  const container = document.getElementById(containerId);
  const canvas = document.createElement('canvas');
  
  // Set responsive dimensions
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  canvas.id = containerId + '-chart';
  
  container.appendChild(canvas);
  
  return new Chart(`#${canvas.id}`, data);
}

// Usage
createResponsiveChart('chart-container', {
  type: "doughnut",
  legend: ["Desktop", "Mobile", "Tablet"],
  data: [60, 30, 10],
  label: { text: "Devices", color: "#333" }
});
```

## API Reference

### Chart Methods

#### Constructor Methods

| Method | Description | Parameters | Returns |
|--------|-------------|------------|---------|
| `new Chart()` | Creates new chart instance | `(selector, options)` | Chart instance |

#### Internal Methods

| Method | Description | Parameters | Returns |
|--------|-------------|------------|---------|
| `_init()` | Initialize canvas context | `(selector)` | CanvasRenderingContext2D |
| `_doughnut()` | Render doughnut chart | `(ctx)` | void |
| `_bar()` | Render bar chart | `(ctx)` | void |
| `_drawArcs()` | Draw chart segments | `(ctx, data)` | void |
| `_drawLegends()` | Draw legend items | `(ctx, data)` | void |
| `_drawLabel()` | Draw center label | `(ctx)` | void |

### Configuration Objects

#### Doughnut Chart Options

```typescript
interface DoughnutOptions {
  type: "doughnut";
  legend: string[];        // Array of label strings
  data: number[];         // Array of numeric values
  label: {
    text: string;         // Center label text
    color: string;        // Center label color
  };
}
```

#### Bar Chart Options

```typescript
interface BarOptions {
  type: "bar";
  data: number;           // Value between 0 and 1
}
```

### Utility Functions (from global.js)

#### `getPixelRatio(context)`
- **Purpose**: Calculates pixel ratio for high-DPI displays
- **Parameters**: Canvas 2D context
- **Returns**: Pixel ratio number
- **Usage**: Ensures crisp rendering on retina displays

#### `sum(...arr)`
- **Purpose**: Calculates sum of array elements
- **Parameters**: Spread array of numbers
- **Returns**: Sum as number
- **Usage**: Used internally for calculating total values

## Browser Support

### Supported Browsers

- **Chrome**: 4+
- **Firefox**: 2+
- **Safari**: 3.1+
- **Internet Explorer**: 9+
- **Edge**: All versions
- **Opera**: 9+

### Required Features

- HTML5 Canvas API
- ES6 Classes (can be transpiled for older browsers)
- Canvas 2D Context

### Performance Considerations

- **Canvas Size**: Larger canvases require more memory
- **Animation**: Not currently supported (static charts only)
- **Data Volume**: Optimized for datasets under 20 items
- **Memory**: Each chart instance maintains canvas context

## Advanced Usage

### Custom Color Schemes

```javascript
// Dark theme colors
const DARK_COLORS = ["#ff4757", "#5352ed", "#20bf6b", "#ffa502"];

// Apply custom colors (modify global COLORS array)
COLORS.splice(0, COLORS.length, ...DARK_COLORS);
```

### Chart Updating

Charts are static after creation. To update data, recreate the chart:

```javascript
function updateChart(selector, newData) {
  // Clear canvas
  const canvas = document.querySelector(selector);
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Create new chart
  return new Chart(selector, newData);
}
```

### Print Styling

The charts work well with print media queries:

```css
@media print {
  canvas {
    break-inside: avoid;
    page-break-inside: avoid;
  }
}
```

## Troubleshooting

### Common Issues

#### Canvas Not Found
**Error**: `Cannot read property 'getContext' of null`
**Solution**: Ensure canvas element exists before creating chart

#### Incorrect Dimensions
**Issue**: Blurry or incorrectly sized charts
**Solution**: Verify canvas width/height attributes match CSS dimensions

#### Color Issues
**Issue**: Unexpected colors in chart segments
**Solution**: Check COLORS array and data array alignment

#### Missing Data
**Issue**: Empty or incomplete charts
**Solution**: Validate data arrays contain positive numbers

### Debug Tips

```javascript
// Enable debugging
const chart = new Chart("#debug-chart", {
  type: "doughnut",
  legend: ["A", "B", "C"],
  data: [1, 2, 3],
  label: { text: "Debug", color: "red" }
});

// Check canvas context
console.log(chart.width, chart.height);
```

## Contributing

To contribute to the Charts.js library:

1. Follow existing code style and patterns
2. Add comprehensive documentation for new features
3. Test across supported browsers
4. Consider performance implications
5. Maintain backward compatibility

### Extension Points

- Add new chart types by extending the `CHARTS` array
- Create custom legend renderers
- Implement animation support
- Add interactive features (hover, click events)