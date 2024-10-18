#!/bin/bash

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js and try again."
    exit 1
fi

# Create a temporary directory
TMP_DIR=$(mktemp -d)

# Download the script
curl -o "$TMP_DIR/file-tree-export.js" https://raw.githubusercontent.com/sushiljainam/file-tree-export/main/dist/file-tree-export.js

# Run the script with provided arguments
node "$TMP_DIR/file-tree-export.js" "$@"

# Clean up
rm -rf "$TMP_DIR"