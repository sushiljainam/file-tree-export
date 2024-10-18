#!/bin/bash

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js and try again."
    exit 1
fi

# Create a temporary directory
TMP_DIR=$(mktemp -d)

# Download the script
curl -o "$TMP_DIR/file-structure-generator.js" https://raw.githubusercontent.com/yourusername/file-structure-generator/main/dist/file-structure-generator.js

# Run the script with provided arguments
node "$TMP_DIR/file-structure-generator.js" "$@"

# Clean up
rm -rf "$TMP_DIR"