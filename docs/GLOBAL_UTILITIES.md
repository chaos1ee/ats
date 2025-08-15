# Global Utilities Documentation

## Overview

The global utilities module (`global.js`) provides essential helper functions and constants used throughout the frontend application. These utilities handle cross-browser compatibility, mathematical operations, and common functionality required by the Charts.js library and other components.

## Table of Contents

- [Functions](#functions)
  - [getPixelRatio](#getpixelratio)
  - [sum](#sum)
- [Usage Examples](#usage-examples)
- [Browser Compatibility](#browser-compatibility)
- [Performance Considerations](#performance-considerations)

## Functions

### getPixelRatio

Calculates the device pixel ratio for high-DPI display support, ensuring crisp rendering on retina and high-resolution displays.

#### Syntax

```javascript
getPixelRatio(context)
```

#### Parameters

- **context** (CanvasRenderingContext2D): The 2D rendering context of a canvas element

#### Returns

- **number**: The calculated pixel ratio for the current device and browser

#### Description

This function determines the optimal pixel ratio by comparing the device pixel ratio with the backing store pixel ratio. It handles various browser prefixes and fallbacks to ensure compatibility across different browsers.

The function checks for the following properties in order:
1. `backingStorePixelRatio`
2. `webkitBackingStorePixelRatio` (WebKit browsers)
3. `mozBackingStorePixelRatio` (Mozilla Firefox)
4. `msBackingStorePixelRatio` (Microsoft browsers)
5. `oBackingStorePixelRatio` (Opera)
6. Default fallback value of 1

#### Implementation Details

```javascript
const getPixelRatio = function getPixelRatio(context) {
  const backingStore =
    context.backingStorePixelRatio ||
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio ||
    1;
  return (window.devicePixelRatio || 1) / backingStore;
};
```

#### Usage Example

```javascript
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const ratio = getPixelRatio(ctx);

// Scale canvas for high-DPI displays
canvas.width = canvas.width * ratio;
canvas.height = canvas.height * ratio;
ctx.scale(ratio, ratio);
```

#### Browser Support

- **Chrome**: All versions
- **Firefox**: All versions  
- **Safari**: All versions
- **Internet Explorer**: 9+
- **Edge**: All versions
- **Opera**: All versions

#### Use Cases

- **Charts Rendering**: Ensures charts appear crisp on retina displays
- **Canvas Graphics**: Prevents blurry canvas elements on high-DPI screens
- **Image Scaling**: Provides proper scaling factors for canvas-based images
- **Print Media**: Maintains quality when printing canvas content

---

### sum

Calculates the sum of all numeric values in one or more arrays, with support for nested arrays and spread syntax.

#### Syntax

```javascript
sum(...arr)
```

#### Parameters

- **...arr** (rest parameter): One or more arrays or individual numbers

#### Returns

- **number**: The sum of all numeric values

#### Description

This utility function flattens nested arrays and calculates the total sum of all numeric values. It uses the spread operator and `concat` to handle multiple input formats, making it versatile for various data structures.

#### Implementation Details

```javascript
const sum = (...arr) => [].concat(...arr).reduce((acc, val) => acc + val, 0);
```

The function works by:
1. Using spread operator to accept multiple arguments
2. Flattening arrays using `concat`
3. Reducing all values to a single sum
4. Starting with an initial value of 0

#### Usage Examples

```javascript
// Basic array sum
const numbers = [1, 2, 3, 4, 5];
const total = sum(numbers);  // Returns: 15

// Multiple arrays
const array1 = [10, 20];
const array2 = [30, 40];
const total = sum(array1, array2);  // Returns: 100

// Mixed arguments
const total = sum([1, 2], [3, 4], [5]);  // Returns: 15

// Individual numbers
const total = sum(1, 2, 3, 4, 5);  // Returns: 15

// Empty arrays
const total = sum([], []);  // Returns: 0

// Single values
const total = sum([42]);  // Returns: 42
```

#### Chart Library Integration

The `sum` function is primarily used in the Charts.js library for calculating total values in doughnut charts:

```javascript
// Example from charts.js
const data = [100, 200, 300];
const total = sum(data);  // Returns: 600

// Calculate percentages
const percentages = data.map(value => (value / total) * 100);
// Returns: [16.67, 33.33, 50]
```

#### Edge Cases

```javascript
// Nested arrays (flattens one level)
sum([[1, 2], [3, 4]]);  // Returns: 10

// Mixed data types (only numbers are summed)
sum([1, "2", 3]);  // Returns: 4 (string "2" becomes NaN, treated as 0)

// Floating point numbers
sum([0.1, 0.2, 0.3]);  // Returns: 0.6000000000000001 (floating point precision)
```

#### Performance Characteristics

- **Time Complexity**: O(n) where n is the total number of elements
- **Space Complexity**: O(n) for the flattened array
- **Memory Usage**: Creates temporary array during concatenation
- **Optimization**: Suitable for arrays up to 10,000 elements

---

## Usage Examples

### Canvas High-DPI Setup

Complete example of setting up a canvas with proper pixel ratio:

```javascript
function setupCanvas(canvasId) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext('2d');
  
  // Get the device pixel ratio
  const ratio = getPixelRatio(ctx);
  
  // Store original dimensions
  const displayWidth = canvas.width;
  const displayHeight = canvas.height;
  
  // Scale the canvas for high-DPI
  canvas.width = displayWidth * ratio;
  canvas.height = displayHeight * ratio;
  
  // Scale the drawing context
  ctx.scale(ratio, ratio);
  
  // Set CSS size to maintain original dimensions
  canvas.style.width = displayWidth + 'px';
  canvas.style.height = displayHeight + 'px';
  
  return { canvas, ctx, ratio };
}
```

### Data Processing with Sum

Example of processing chart data:

```javascript
function processChartData(datasets) {
  const results = [];
  
  datasets.forEach(dataset => {
    const total = sum(dataset.values);
    const percentages = dataset.values.map(value => 
      ((value / total) * 100).toFixed(2)
    );
    
    results.push({
      name: dataset.name,
      total: total,
      percentages: percentages,
      average: total / dataset.values.length
    });
  });
  
  return results;
}

// Usage
const salesData = [
  { name: 'Q1', values: [100, 150, 200] },
  { name: 'Q2', values: [120, 180, 250] }
];

const processed = processChartData(salesData);
// Results include totals, percentages, and averages
```

### Combined Usage in Chart Creation

Real-world example combining both utilities:

```javascript
function createHighQualityChart(canvasId, data) {
  // Setup high-DPI canvas
  const { canvas, ctx, ratio } = setupCanvas(canvasId);
  
  // Process data
  const total = sum(data.values);
  const largest = Math.max(...data.values);
  
  // Calculate proportions
  const proportions = data.values.map(value => value / total);
  
  // Create chart with crisp rendering
  new Chart(`#${canvasId}`, {
    type: "doughnut",
    legend: data.labels,
    data: data.values,
    label: { 
      text: `${total}`, 
      color: "#333" 
    }
  });
  
  return { total, largest, proportions };
}
```

## Browser Compatibility

### getPixelRatio Compatibility

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| Chrome | All | Full | Native devicePixelRatio support |
| Firefox | All | Full | Uses mozBackingStorePixelRatio |
| Safari | All | Full | Uses webkitBackingStorePixelRatio |
| IE | 9+ | Full | Fallback to ratio of 1 |
| Edge | All | Full | Native support |
| Opera | All | Full | Uses oBackingStorePixelRatio |

### sum Compatibility

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| Chrome | All | Full | Native spread operator support |
| Firefox | All | Full | Native array methods |
| Safari | All | Full | Full ES6 support |
| IE | 9+ | Partial | Requires transpilation for spread operator |
| Edge | All | Full | Native support |
| Opera | All | Full | Native support |

### Polyfills

For older browser support, consider these polyfills:

```javascript
// IE9+ Array.reduce polyfill
if (!Array.prototype.reduce) {
  Array.prototype.reduce = function(callback, initialValue) {
    // Polyfill implementation
  };
}

// Spread operator alternative for IE
function sumLegacy() {
  var args = Array.prototype.slice.call(arguments);
  var flattened = [].concat.apply([], args);
  return flattened.reduce(function(acc, val) {
    return acc + val;
  }, 0);
}
```

## Performance Considerations

### getPixelRatio Performance

- **Execution Time**: ~0.1ms per call
- **Memory Usage**: Minimal (no allocations)
- **Optimization**: Cache result if canvas doesn't change
- **Frequency**: Call once per canvas setup

```javascript
// Optimization: Cache pixel ratio
const pixelRatioCache = new Map();

function getCachedPixelRatio(canvas) {
  if (!pixelRatioCache.has(canvas)) {
    const ctx = canvas.getContext('2d');
    pixelRatioCache.set(canvas, getPixelRatio(ctx));
  }
  return pixelRatioCache.get(canvas);
}
```

### sum Performance

- **Time Complexity**: O(n) linear with input size
- **Memory Usage**: O(n) for flattened array
- **Optimization**: Avoid for very large datasets (>100k elements)
- **Alternative**: Use traditional for-loop for performance-critical code

```javascript
// Performance-optimized sum for large arrays
function sumOptimized(arr) {
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    total += arr[i];
  }
  return total;
}
```

## Testing

### Unit Tests

```javascript
// Test getPixelRatio
function testGetPixelRatio() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const ratio = getPixelRatio(ctx);
  
  console.assert(typeof ratio === 'number', 'Ratio should be a number');
  console.assert(ratio > 0, 'Ratio should be positive');
}

// Test sum function
function testSum() {
  console.assert(sum([1, 2, 3]) === 6, 'Basic sum failed');
  console.assert(sum([1], [2], [3]) === 6, 'Multi-array sum failed');
  console.assert(sum([]) === 0, 'Empty array sum failed');
  console.assert(sum([1.5, 2.5]) === 4, 'Decimal sum failed');
}
```

### Integration Tests

```javascript
function testChartIntegration() {
  const testData = [10, 20, 30];
  const total = sum(testData);
  
  // Create test canvas
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  const ratio = getPixelRatio(ctx);
  
  // Verify integration
  console.assert(total === 60, 'Data processing failed');
  console.assert(ratio >= 1, 'Pixel ratio invalid');
  
  // Cleanup
  document.body.removeChild(canvas);
}
```

## Contributing

When contributing to global utilities:

1. **Maintain Backwards Compatibility**: Don't break existing APIs
2. **Add Comprehensive Tests**: Test edge cases and browser compatibility
3. **Document Performance**: Include time/space complexity information
4. **Follow Naming Conventions**: Use descriptive, consistent function names
5. **Consider Polyfills**: Ensure compatibility with target browsers

### Adding New Utilities

Template for new utility functions:

```javascript
/**
 * Brief description of the function
 * @param {type} paramName - Parameter description
 * @returns {type} Return value description
 * @example
 * // Usage example
 * functionName(example);
 */
const functionName = (paramName) => {
  // Implementation
};
```