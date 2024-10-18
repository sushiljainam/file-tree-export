"use strict";
// file-tree-export.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFileStructure = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const ignore_1 = __importDefault(require("ignore"));
const yaml = __importStar(require("js-yaml"));
const fast_xml_parser_1 = require("fast-xml-parser");
const defaultOptions = {
    root: process.cwd(),
    output: 'tree',
    maxFiles: 2000,
    maxDepth: 32,
    ignoreFile: '.gitignore'
};
function readIgnoreFile(ignoreFilePath) {
    try {
        const ignoreFileContent = fs.readFileSync(ignoreFilePath, 'utf-8');
        return ignoreFileContent.split('\n').filter(line => line.trim() !== '');
    }
    catch (error) {
        console.warn(`Warning: Could not read ignore file ${ignoreFilePath}`);
        return [];
    }
}
function generateTree(dir, options, currentDepth = 0, fileCount = { value: 0 }) {
    if (currentDepth > options.maxDepth || fileCount.value > options.maxFiles) {
        return null;
    }
    const name = path.basename(dir);
    const stats = fs.statSync(dir);
    if (!stats.isDirectory()) {
        fileCount.value++;
        return { name, type: 'file' };
    }
    const children = [];
    const files = fs.readdirSync(dir);
    const ignoreFilePath = path.join(dir, options.ignoreFile);
    const ignoreRules = readIgnoreFile(ignoreFilePath);
    const ig = (0, ignore_1.default)().add(ignoreRules);
    for (const file of files) {
        if (ig.ignores(file))
            continue;
        const res = generateTree(path.join(dir, file), options, currentDepth + 1, fileCount);
        if (res !== null) {
            children.push(res);
        }
    }
    return { name, type: 'directory', children };
}
function formatOutput(tree, format) {
    switch (format) {
        case 'json':
            return JSON.stringify(tree, null, 2);
        case 'yaml':
            return yaml.dump(tree);
        case 'xml':
            const builder = new fast_xml_parser_1.XMLBuilder({ format: true });
            return builder.build({ root: tree });
        case 'tree':
        default:
            return formatTreeOutput(tree);
    }
}
function formatTreeOutput(node, prefix = '') {
    let result = `${prefix}${node.name}\n`;
    if (node.type === 'directory' && node.children) {
        const childPrefix = prefix + '│   ';
        node.children.forEach((child, index) => {
            const isLast = index === node.children.length - 1;
            result += formatTreeOutput(child, `${prefix}${isLast ? '└── ' : '├── '}`);
        });
    }
    return result;
}
function generateFileStructure(options = {}) {
    const mergedOptions = { ...defaultOptions, ...options };
    const tree = generateTree(mergedOptions.root, mergedOptions);
    return tree ? formatOutput(tree, mergedOptions.output) : 'Error: Could not generate tree';
}
exports.generateFileStructure = generateFileStructure;
// CLI handling
if (require.main === module) {
    const args = process.argv.slice(2);
    const options = {};
    for (let i = 0; i < args.length; i += 2) {
        const key = args[i].replace('--', '');
        const value = args[i + 1];
        if (key in defaultOptions) {
            options[key] = value;
        }
    }
    const output = generateFileStructure(options);
    console.log(output);
}
