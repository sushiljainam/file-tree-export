// file-structure-generator.ts

import fs from 'fs';
import path from 'path';
import ignore from 'ignore';
import yaml from 'js-yaml';
import { XMLBuilder } from 'fast-xml-parser';

interface TreeNode {
    name: string;
    type: 'file' | 'directory';
    children?: TreeNode[];
}

interface Options {
    root: string;
    output: 'json' | 'yaml' | 'xml' | 'tree';
    maxFiles: number;
    maxDepth: number;
    ignoreFile: string;
}

const defaultOptions: Options = {
    root: process.cwd(),
    output: 'tree',
    maxFiles: 2000,
    maxDepth: 32,
    ignoreFile: '.gitignore'
};

function readIgnoreFile(ignoreFilePath: string): string[] {
    try {
        const ignoreFileContent = fs.readFileSync(ignoreFilePath, 'utf-8');
        return ignoreFileContent.split('\n').filter(line => line.trim() !== '');
    } catch (error) {
        console.warn(`Warning: Could not read ignore file ${ignoreFilePath}`);
        return [];
    }
}

function generateTree(dir: string, options: Options, currentDepth = 0, fileCount = { value: 0 }): TreeNode | null {
    if (currentDepth > options.maxDepth || fileCount.value > options.maxFiles) {
        return null;
    }

    const name = path.basename(dir);
    const stats = fs.statSync(dir);

    if (!stats.isDirectory()) {
        fileCount.value++;
        return { name, type: 'file' };
    }

    const children: TreeNode[] = [];
    const files = fs.readdirSync(dir);

    const ignoreFilePath = path.join(dir, options.ignoreFile);
    const ignoreRules = readIgnoreFile(ignoreFilePath);
    const ig = ignore().add(ignoreRules);

    for (const file of files) {
        if (ig.ignores(file)) continue;

        const res = generateTree(path.join(dir, file), options, currentDepth + 1, fileCount);
        if (res !== null) {
            children.push(res);
        }
    }

    return { name, type: 'directory', children };
}

function formatOutput(tree: TreeNode, format: Options['output']): string {
    switch (format) {
        case 'json':
            return JSON.stringify(tree, null, 2);
        case 'yaml':
            return yaml.dump(tree);
        case 'xml':
            const builder = new XMLBuilder({ format: true });
            return builder.build({ root: tree });
        case 'tree':
        default:
            return formatTreeOutput(tree);
    }
}

function formatTreeOutput(node: TreeNode, prefix = ''): string {
    let result = `${prefix}${node.name}\n`;
    if (node.type === 'directory' && node.children) {
        const childPrefix = prefix + '│   ';
        node.children.forEach((child, index) => {
            const isLast = index === node.children!.length - 1;
            result += formatTreeOutput(child, `${prefix}${isLast ? '└── ' : '├── '}`);
        });
    }
    return result;
}

export function generateFileStructure(options: Partial<Options> = {}): string {
    const mergedOptions: Options = { ...defaultOptions, ...options };
    const tree = generateTree(mergedOptions.root, mergedOptions);
    return tree ? formatOutput(tree, mergedOptions.output) : 'Error: Could not generate tree';
}

// CLI handling
if (require.main === module) {
    const args = process.argv.slice(2);
    const options: Partial<Options> = {};

    for (let i = 0; i < args.length; i += 2) {
        const key = args[i].replace('--', '') as keyof Options;
        const value = args[i + 1];
        if (key in defaultOptions) {
            (options as any)[key] = value;
        }
    }

    const output = generateFileStructure(options);
    console.log(output);
}