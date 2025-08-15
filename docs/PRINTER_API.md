# Printer API Documentation

## Overview

The Printer module is a Node.js application built with Puppeteer that converts web pages to PDF files. It provides both programmatic usage and command-line interface, with support for packaging as a standalone executable.

## Table of Contents

- [Installation](#installation)
- [Command Line Interface](#command-line-interface)
- [Configuration Options](#configuration-options)
- [PDF Generation Options](#pdf-generation-options)
- [Examples](#examples)
- [Building Executable](#building-executable)
- [Platform Support](#platform-support)
- [Error Handling](#error-handling)

## Installation

### Prerequisites

- Node.js (version 12+ recommended)
- npm or yarn package manager

### Install Dependencies

```bash
cd printer
yarn install
# or
npm install
```

## Command Line Interface

### Basic Syntax

```bash
node index.js --target <URL> [--output <PATH>]
```

### Required Arguments

#### `--target, -t`
- **Type**: String
- **Required**: Yes
- **Description**: The URL of the web page to convert to PDF
- **Example**: `--target https://example.com`

### Optional Arguments

#### `--output, -o`
- **Type**: String
- **Required**: No
- **Default**: `./ats.pdf`
- **Description**: Output path for the generated PDF file
- **Example**: `--output ./reports/my-report.pdf`

### Help Command

```bash
node index.js --help
```

## Configuration Options

### PDF Generation Settings

The PDF is generated with the following default configuration:

```javascript
{
  format: "A4",           // Page format
  scale: 0.95,           // Scale factor (0.1 - 2.0)
  printBackground: true,  // Include background graphics
  displayHeaderFooter: true, // Show header/footer
  margin: { 
    bottom: 40            // Bottom margin in pixels
  },
  footerTemplate: `      // Custom footer with page numbers
    <div style="color: lightgray;font-size: 10px;text-align: center; width: 100%;">
      第 <span class="pageNumber"></span> 页，共 <span class="totalPages"></span> 页
    </div>`
}
```

### Browser Settings

```javascript
{
  executablePath: chromiumExecutablePath, // Auto-detected Chrome/Chromium path
  headless: true                         // Run browser in headless mode
}
```

### Page Loading Options

```javascript
{
  waitUntil: "networkidle2"  // Wait until network is idle for 500ms
}
```

## PDF Generation Options

### Supported Formats
- A4 (default)
- A3, A5, Legal, Letter, Tabloid

### Scale Options
- Range: 0.1 to 2.0
- Default: 0.95
- Recommended: 0.8-1.0 for optimal readability

### Media Emulation
The printer automatically emulates print media using:
```javascript
await page.emulateMedia("print");
```

## Examples

### Basic Usage

```bash
# Convert a web page to PDF with default settings
node index.js --target https://www.example.com

# Specify custom output path
node index.js --target https://www.example.com --output ./my-report.pdf

# Convert local HTML file
node index.js --target file:///path/to/local/file.html --output ./local-report.pdf
```

### Advanced Usage

```bash
# Convert with specific output directory (auto-created)
node index.js \
  --target https://dashboard.example.com \
  --output ./reports/dashboard-$(date +%Y%m%d).pdf

# Convert multiple pages (requires scripting)
for url in https://page1.com https://page2.com; do
  node index.js --target "$url" --output "./reports/$(basename $url).pdf"
done
```

### Using with Local Development Server

```bash
# Start your local server first
npm start  # or your local development command

# Then convert the local page
node index.js --target http://localhost:3000 --output ./local-app.pdf
```

## Building Executable

### Build Process

The application can be packaged into a standalone executable using [pkg](https://github.com/zeit/pkg):

```bash
# Build executable for current platform
yarn run build
# or
npm run build
```

### Build Script Details

The build script performs the following actions:
1. Removes existing build directory
2. Packages the application using pkg
3. Copies Puppeteer dependencies to the build directory

```json
{
  "scripts": {
    "build": "rm -rf build && npx pkg --out-path build . && cp -r ./node_modules/puppeteer ./build/puppeteer"
  }
}
```

### Running the Executable

After building, run the executable:

```bash
# macOS/Linux
./build/printer-macos --target https://www.example.com --output ./report.pdf

# Windows
./build/printer-win.exe --target https://www.example.com --output ./report.pdf
```

## Platform Support

### Supported Platforms
- macOS (x64)
- Linux (x64)
- Windows (x64)

### Platform-Specific Considerations

#### Windows
- Uses backslash path separators
- Different Puppeteer executable path detection

#### macOS/Linux
- Uses forward slash path separators
- Standard Unix-style paths

### Chromium Path Detection

The application automatically detects the Chromium executable path:

```javascript
const pattern = process.platform == "win32"
  ? /^.*?\\node_modules\\puppeteer/
  : /^.*?\/node_modules\/puppeteer/;

const isPkg = typeof process.pkg !== "undefined";

let chromiumExecutablePath = isPkg
  ? puppeteer.executablePath()
      .replace(pattern, path.join(path.dirname(process.execPath), "puppeteer"))
  : puppeteer.executablePath();
```

## Error Handling

### Common Issues and Solutions

#### Missing Chromium
**Error**: `Browser executable not found`
**Solution**: Ensure Puppeteer is properly installed or provide custom executable path

#### Permission Denied
**Error**: `EACCES: permission denied`
**Solution**: Check write permissions for the output directory

#### Network Timeout
**Error**: `Navigation timeout`
**Solution**: Ensure the target URL is accessible and loads within timeout limits

#### Invalid URL
**Error**: `Invalid URL`
**Solution**: Verify the target URL is properly formatted with protocol (http/https)

### Directory Creation

The application automatically creates output directories if they don't exist:

```javascript
if (argv.output != DEFAULT_OUTPUT_PATH) {
  const dir = path.resolve(__dirname, path.parse(argv.output).dir);
  
  if (!shell.test("-d", dir)) {
    shell.mkdir("-p", dir);
    shell.echo(`创建目录${dir}成功`);
  }
}
```

### Exit Codes
- `0`: Success
- `1`: General error (network, file system, etc.)
- Non-zero: Various error conditions

## Dependencies

### Core Dependencies

```json
{
  "puppeteer": "^2.0.0",    // Browser automation
  "yargs": "^15.0.2",       // Command line argument parsing
  "shelljs": "^0.8.3",      // Shell commands
  "path": "^0.12.7"         // Path utilities
}
```

### Development Dependencies
- `pkg`: For creating standalone executables

## Performance Considerations

### Memory Usage
- Each browser instance uses ~50-100MB RAM
- Close browser instances promptly to free memory
- Consider batch processing for multiple files

### Network Considerations
- Uses `networkidle2` for optimal loading
- Waits for network to be idle for 500ms
- May timeout on very slow networks

### PDF Size Optimization
- Scale factor affects file size
- Background graphics increase file size
- Consider disabling `printBackground` for smaller files

## Security Considerations

### URL Validation
- Always validate input URLs before processing
- Be cautious with user-provided URLs
- Consider implementing URL whitelist for production use

### File System Access
- Application can write to any accessible directory
- Validate output paths to prevent directory traversal
- Consider sandboxing in production environments

## Contributing

When contributing to the Printer module:

1. Follow the existing code style
2. Add error handling for new features
3. Update documentation for API changes
4. Test on multiple platforms
5. Consider performance implications

## License

MIT License - See package.json for details.