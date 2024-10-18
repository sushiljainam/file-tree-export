"use strict";
// file-tree-export.ts
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.generateFileStructure = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
var ignore_1 = require("ignore");
var js_yaml_1 = require("js-yaml");
var fast_xml_parser_1 = require("fast-xml-parser");
var defaultOptions = {
    root: process.cwd(),
    output: 'tree',
    maxFiles: 2000,
    maxDepth: 32,
    ignoreFile: '.gitignore'
};
function readIgnoreFile(ignoreFilePath) {
    try {
        var ignoreFileContent = fs_1["default"].readFileSync(ignoreFilePath, 'utf-8');
        return ignoreFileContent.split('\n').filter(function (line) { return line.trim() !== ''; });
    }
    catch (error) {
        console.warn("Warning: Could not read ignore file ".concat(ignoreFilePath));
        return [];
    }
}
function generateTree(dir, options, currentDepth, fileCount) {
    if (currentDepth === void 0) { currentDepth = 0; }
    if (fileCount === void 0) { fileCount = { value: 0 }; }
    if (currentDepth > options.maxDepth || fileCount.value > options.maxFiles) {
        return null;
    }
    var name = path_1["default"].basename(dir);
    var stats = fs_1["default"].statSync(dir);
    if (!stats.isDirectory()) {
        fileCount.value++;
        return { name: name, type: 'file' };
    }
    var children = [];
    var files = fs_1["default"].readdirSync(dir);
    var ignoreFilePath = path_1["default"].join(dir, options.ignoreFile);
    var ignoreRules = readIgnoreFile(ignoreFilePath);
    var ig = (0, ignore_1["default"])().add(ignoreRules);
    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
        var file = files_1[_i];
        if (ig.ignores(file))
            continue;
        var res = generateTree(path_1["default"].join(dir, file), options, currentDepth + 1, fileCount);
        if (res !== null) {
            children.push(res);
        }
    }
    return { name: name, type: 'directory', children: children };
}
function formatOutput(tree, format) {
    switch (format) {
        case 'json':
            return JSON.stringify(tree, null, 2);
        case 'yaml':
            return js_yaml_1["default"].dump(tree);
        case 'xml':
            var builder = new fast_xml_parser_1.XMLBuilder({ format: true });
            return builder.build({ root: tree });
        case 'tree':
        default:
            return formatTreeOutput(tree);
    }
}
function formatTreeOutput(node, prefix) {
    if (prefix === void 0) { prefix = ''; }
    var result = "".concat(prefix).concat(node.name, "\n");
    if (node.type === 'directory' && node.children) {
        var childPrefix = prefix + '│   ';
        node.children.forEach(function (child, index) {
            var isLast = index === node.children.length - 1;
            result += formatTreeOutput(child, "".concat(prefix).concat(isLast ? '└── ' : '├── '));
        });
    }
    return result;
}
function generateFileStructure(options) {
    if (options === void 0) { options = {}; }
    var mergedOptions = __assign(__assign({}, defaultOptions), options);
    var tree = generateTree(mergedOptions.root, mergedOptions);
    return tree ? formatOutput(tree, mergedOptions.output) : 'Error: Could not generate tree';
}
exports.generateFileStructure = generateFileStructure;
// CLI handling
if (require.main === module) {
    var args = process.argv.slice(2);
    var options = {};
    for (var i = 0; i < args.length; i += 2) {
        var key = args[i].replace('--', '');
        var value = args[i + 1];
        if (key in defaultOptions) {
            options[key] = value;
        }
    }
    var output = generateFileStructure(options);
    console.log(output);
}
