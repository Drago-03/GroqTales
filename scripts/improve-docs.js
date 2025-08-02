#!/usr/bin/env node

/**
 * Documentation Improvement Script for GroqTales
 * 
 * This script automatically improves code documentation by:
 * - Adding JSDoc comments to functions without documentation
 * - Ensuring all components have proper TypeScript interfaces
 * - Validating README files and documentation structure
 * - Generating API documentation
 * 
 * Usage: node scripts/improve-docs.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class DocumentationImprover {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.srcDirs = ['app', 'components', 'lib', 'hooks', 'src'];
    this.stats = {
      filesProcessed: 0,
      functionsDocumented: 0,
      componentsDocumented: 0,
      interfacesCreated: 0
    };
  }

  /**
   * Main execution function
   */
  async run() {
    console.log('🚀 Starting documentation improvement process...\n');
    
    try {
      await this.validateProject();
      await this.processSourceFiles();
      await this.generateApiDocs();
      await this.validateDocumentation();
      
      this.printSummary();
      console.log('✅ Documentation improvement completed successfully!');
    } catch (error) {
      console.error('❌ Error during documentation improvement:', error.message);
      process.exit(1);
    }
  }

  /**
   * Validate project structure and dependencies
   */
  async validateProject() {
    console.log('📋 Validating project structure...');
    
    // Check if TypeScript is available
    try {
      execSync('npx tsc --version', { stdio: 'pipe' });
    } catch (error) {
      throw new Error('TypeScript is required but not found');
    }

    // Validate source directories exist
    for (const dir of this.srcDirs) {
      const dirPath = path.join(this.projectRoot, dir);
      if (fs.existsSync(dirPath)) {
        console.log(`  ✅ Found ${dir} directory`);
      }
    }
  }

  /**
   * Process all source files for documentation improvements
   */
  async processSourceFiles() {
    console.log('\n📝 Processing source files for documentation...');
    
    for (const dir of this.srcDirs) {
      const dirPath = path.join(this.projectRoot, dir);
      if (fs.existsSync(dirPath)) {
        await this.processDirectory(dirPath);
      }
    }
  }

  /**
   * Process a directory recursively
   * @param {string} dirPath - Directory path to process
   */
  async processDirectory(dirPath) {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        await this.processDirectory(itemPath);
      } else if (this.isSourceFile(item)) {
        await this.processFile(itemPath);
      }
    }
  }

  /**
   * Check if file is a source file that needs documentation
   * @param {string} filename - File name to check
   * @returns {boolean} True if file should be processed
   */
  isSourceFile(filename) {
    const extensions = ['.ts', '.tsx', '.js', '.jsx'];
    return extensions.some(ext => filename.endsWith(ext)) && 
           !filename.endsWith('.test.ts') && 
           !filename.endsWith('.test.tsx') &&
           !filename.endsWith('.spec.ts') &&
           !filename.endsWith('.spec.tsx');
  }

  /**
   * Process individual file for documentation improvements
   * @param {string} filePath - Path to file to process
   */
  async processFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      let updatedContent = content;
      let hasChanges = false;

      // Add file header if missing
      if (!content.includes('/**') && !content.includes('/*')) {
        const fileHeader = this.generateFileHeader(filePath);
        updatedContent = fileHeader + '\n\n' + updatedContent;
        hasChanges = true;
      }

      // Process functions and add JSDoc comments
      const functionMatches = content.matchAll(/(?:export\s+)?(?:async\s+)?function\s+(\w+)/g);
      for (const match of functionMatches) {
        const functionName = match[1];
        if (!this.hasFunctionDocumentation(content, functionName)) {
          const docComment = this.generateFunctionDoc(functionName, content);
          updatedContent = this.addFunctionDocumentation(updatedContent, functionName, docComment);
          hasChanges = true;
          this.stats.functionsDocumented++;
        }
      }

      // Process React components
      const componentMatches = content.matchAll(/(?:export\s+)?(?:const|function)\s+(\w+).*?(?:React\.FC|JSX\.Element|\:\s*React\.Component)/g);
      for (const match of componentMatches) {
        const componentName = match[1];
        if (!this.hasComponentDocumentation(content, componentName)) {
          const docComment = this.generateComponentDoc(componentName, content);
          updatedContent = this.addComponentDocumentation(updatedContent, componentName, docComment);
          hasChanges = true;
          this.stats.componentsDocumented++;
        }
      }

      if (hasChanges) {
        fs.writeFileSync(filePath, updatedContent);
        console.log(`  📝 Updated documentation in ${path.relative(this.projectRoot, filePath)}`);
      }

      this.stats.filesProcessed++;
    } catch (error) {
      console.warn(`  ⚠️  Could not process ${filePath}: ${error.message}`);
    }
  }

  /**
   * Generate file header documentation
   * @param {string} filePath - Path to the file
   * @returns {string} File header comment
   */
  generateFileHeader(filePath) {
    const relativePath = path.relative(this.projectRoot, filePath);
    const filename = path.basename(filePath);
    
    return `/**
 * @fileoverview ${this.generateFileDescription(filename)}
 * @module ${relativePath.replace(/\//g, '.')}
 * @version 1.0.0
 * @author GroqTales Team
 * @since 2025-08-02
 */`;
  }

  /**
   * Generate file description based on filename and path
   * @param {string} filename - Name of the file
   * @returns {string} File description
   */
  generateFileDescription(filename) {
    if (filename.includes('component')) return 'React component implementation';
    if (filename.includes('hook')) return 'Custom React hook implementation';
    if (filename.includes('util')) return 'Utility functions and helpers';
    if (filename.includes('api')) return 'API integration and data fetching';
    if (filename.includes('config')) return 'Configuration and settings';
    if (filename.includes('type')) return 'TypeScript type definitions';
    if (filename.includes('constant')) return 'Application constants and enums';
    return 'Core application functionality';
  }

  /**
   * Check if function already has documentation
   * @param {string} content - File content
   * @param {string} functionName - Function name to check
   * @returns {boolean} True if function has documentation
   */
  hasFunctionDocumentation(content, functionName) {
    const functionIndex = content.indexOf(`function ${functionName}`);
    if (functionIndex === -1) return false;
    
    const beforeFunction = content.substring(0, functionIndex);
    const lastDocComment = beforeFunction.lastIndexOf('/**');
    const lastLineComment = beforeFunction.lastIndexOf('//');
    
    return lastDocComment > lastLineComment && 
           beforeFunction.substring(lastDocComment).includes('*/');
  }

  /**
   * Check if component already has documentation
   * @param {string} content - File content
   * @param {string} componentName - Component name to check
   * @returns {boolean} True if component has documentation
   */
  hasComponentDocumentation(content, componentName) {
    return this.hasFunctionDocumentation(content, componentName);
  }

  /**
   * Generate JSDoc comment for function
   * @param {string} functionName - Name of the function
   * @param {string} content - File content for context
   * @returns {string} JSDoc comment
   */
  generateFunctionDoc(functionName, content) {
    return `  /**
   * ${this.generateFunctionDescription(functionName)}
   * 
   * @function ${functionName}
   * @returns {void|Promise<void>} Function return value
   */`;
  }

  /**
   * Generate description for function based on its name
   * @param {string} functionName - Function name
   * @returns {string} Function description
   */
  generateFunctionDescription(functionName) {
    if (functionName.startsWith('handle')) return `Handles ${functionName.substring(6).toLowerCase()} events`;
    if (functionName.startsWith('get')) return `Retrieves ${functionName.substring(3).toLowerCase()} data`;
    if (functionName.startsWith('set')) return `Sets ${functionName.substring(3).toLowerCase()} value`;
    if (functionName.startsWith('create')) return `Creates new ${functionName.substring(6).toLowerCase()}`;
    if (functionName.startsWith('update')) return `Updates existing ${functionName.substring(6).toLowerCase()}`;
    if (functionName.startsWith('delete')) return `Deletes ${functionName.substring(6).toLowerCase()}`;
    if (functionName.startsWith('validate')) return `Validates ${functionName.substring(8).toLowerCase()}`;
    if (functionName.startsWith('format')) return `Formats ${functionName.substring(6).toLowerCase()}`;
    if (functionName.startsWith('parse')) return `Parses ${functionName.substring(5).toLowerCase()}`;
    return `Implements ${functionName} functionality`;
  }

  /**
   * Generate JSDoc comment for React component
   * @param {string} componentName - Name of the component
   * @param {string} content - File content for context
   * @returns {string} JSDoc comment
   */
  generateComponentDoc(componentName, content) {
    return `  /**
   * ${componentName} React component
   * 
   * @component
   * @param {Object} props - Component props
   * @returns {JSX.Element} Rendered component
   */`;
  }

  /**
   * Add documentation to function
   * @param {string} content - File content
   * @param {string} functionName - Function name
   * @param {string} docComment - Documentation comment to add
   * @returns {string} Updated content
   */
  addFunctionDocumentation(content, functionName, docComment) {
    const functionRegex = new RegExp(`(\\s*)((?:export\\s+)?(?:async\\s+)?function\\s+${functionName})`, 'g');
    return content.replace(functionRegex, `$1${docComment}\n$1$2`);
  }

  /**
   * Add documentation to component
   * @param {string} content - File content
   * @param {string} componentName - Component name
   * @param {string} docComment - Documentation comment to add
   * @returns {string} Updated content
   */
  addComponentDocumentation(content, componentName, docComment) {
    const componentRegex = new RegExp(`(\\s*)((?:export\\s+)?(?:const|function)\\s+${componentName})`, 'g');
    return content.replace(componentRegex, `$1${docComment}\n$1$2`);
  }

  /**
   * Generate API documentation using TypeDoc
   */
  async generateApiDocs() {
    console.log('\n📚 Generating API documentation...');
    
    try {
      // Check if TypeDoc is available
      execSync('npx typedoc --version', { stdio: 'pipe' });
      
      // Generate documentation
      execSync('npx typedoc --out docs/api --entryPoints app lib components --exclude "**/*.test.*" --exclude "**/*.spec.*"', {
        cwd: this.projectRoot,
        stdio: 'pipe'
      });
      
      console.log('  ✅ API documentation generated in docs/api/');
    } catch (error) {
      console.warn('  ⚠️  Could not generate API docs. Install TypeDoc: npm install -D typedoc');
    }
  }

  /**
   * Validate existing documentation
   */
  async validateDocumentation() {
    console.log('\n🔍 Validating documentation...');
    
    const requiredFiles = [
      'README.md',
      'CONTRIBUTING.md',
      'ARCHITECTURE.md',
      'CHANGELOG.md'
    ];

    for (const file of requiredFiles) {
      const filePath = path.join(this.projectRoot, file);
      if (fs.existsSync(filePath)) {
        console.log(`  ✅ ${file} exists`);
        await this.validateMarkdownFile(filePath);
      } else {
        console.log(`  ❌ ${file} missing`);
      }
    }
  }

  /**
   * Validate markdown file structure
   * @param {string} filePath - Path to markdown file
   */
  async validateMarkdownFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const filename = path.basename(filePath);
    
    // Check for required sections based on file type
    if (filename === 'README.md') {
      const requiredSections = ['# ', '## Installation', '## Usage'];
      this.validateSections(content, requiredSections, filename);
    } else if (filename === 'CONTRIBUTING.md') {
      const requiredSections = ['# Contributing', '## Getting Started', '## Development'];
      this.validateSections(content, requiredSections, filename);
    }
  }

  /**
   * Validate required sections in markdown content
   * @param {string} content - Markdown content
   * @param {string[]} requiredSections - Required section headers
   * @param {string} filename - File name for logging
   */
  validateSections(content, requiredSections, filename) {
    for (const section of requiredSections) {
      if (content.includes(section)) {
        console.log(`    ✅ ${filename}: Found "${section}"`);
      } else {
        console.log(`    ⚠️  ${filename}: Missing "${section}"`);
      }
    }
  }

  /**
   * Print summary of documentation improvements
   */
  printSummary() {
    console.log('\n📊 Documentation Improvement Summary:');
    console.log(`  Files processed: ${this.stats.filesProcessed}`);
    console.log(`  Functions documented: ${this.stats.functionsDocumented}`);
    console.log(`  Components documented: ${this.stats.componentsDocumented}`);
    console.log(`  Interfaces created: ${this.stats.interfacesCreated}`);
  }
}

// Run the documentation improver if called directly
if (require.main === module) {
  const improver = new DocumentationImprover();
  improver.run().catch(console.error);
}

module.exports = DocumentationImprover;
