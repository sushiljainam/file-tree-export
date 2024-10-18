interface Options {
    root: string;
    output: 'json' | 'yaml' | 'xml' | 'tree';
    maxFiles: number;
    maxDepth: number;
    ignoreFile: string;
}
export declare function generateFileStructure(options?: Partial<Options>): string;
export {};
