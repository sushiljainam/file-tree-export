# File Structure Generator

A flexible and powerful tool to generate file structure representations from local folders. This tool supports multiple output formats and respects ignore files like `.gitignore`.

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
   - [CLI Usage](#cli-usage)
   - [API Usage](#api-usage)
3. [Options](#options)
4. [Output Formats](#output-formats)
5. [Examples](#examples)
6. [Contributing](#contributing)
7. [License](#license)

## Installation

You can install the File Structure Generator globally via npm:

```bash
npm install -g file-structure-generator
```

Or run it directly from GitHub:

```bash
curl -s https://raw.githubusercontent.com/yourusername/file-structure-generator/main/run-file-structure-generator.sh | bash -s -- [options]
```

## Usage

### CLI Usage

After installation, you can use the tool from the command line:

```bash
file-structure-generator [options]
```

### API Usage

You can also use the File Structure Generator in your Node.js projects:

```javascript
const { generateFileStructure } = require('file-structure-generator');

const options = {
  root: '/path/to/directory',
  output: 'json',
  maxFiles: 1000,
  maxDepth: 10,
  ignoreFile: '.gitignore'
};

const result = generateFileStructure(options);
console.log(result);
```

## Options

- `--root`: The root directory to start from (default: current working directory)
- `--output`: Output format - 'tree', 'json', 'yaml', or 'xml' (default: 'tree')
- `--maxFiles`: Maximum number of files to process (default: 2000)
- `--maxDepth`: Maximum depth to traverse (default: 32)
- `--ignoreFile`: Name of the ignore file to use (default: '.gitignore')

## Output Formats

1. Tree: ASCII tree representation
2. JSON: Structured JSON output
3. YAML: YAML representation of the file structure
4. XML: XML representation of the file structure

## Examples

1. Generate a tree structure for the current directory:

```bash
file-structure-generator
```

2. Generate JSON output for a specific directory with a depth limit:

```bash
file-structure-generator --root /path/to/directory --output json --maxDepth 5
```

3. Generate YAML output ignoring files specified in `.npmignore`:

```bash
file-structure-generator --output yaml --ignoreFile .npmignore
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
