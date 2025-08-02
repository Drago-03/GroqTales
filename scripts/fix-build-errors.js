#!/usr/bin/env node

/**
 * Build Error Fix Script for GroqTales
 * 
 * This script fixes malformed JSDoc comments that were incorrectly inserted
 * by the documentation improvement script, causing build failures.
 * 
 * Usage: node scripts/fix-build-errors.js
 */

const fs = require('fs');
const path = require('path');

class BuildErrorFixer {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.srcDirs = ['app', 'components', 'lib', 'hooks', 'src'];
    this.stats = {
      filesFixed: 0,
      errorsFixed: 0
    };
  }

  /**
   * Main execution function
   */
  async run() {
    console.log('🔧 Starting build error fix process...\n');
    
    try {
      await this.fixMalformedJSDocComments();
      await this.fixSpecificBuildErrors();
      
      this.printSummary();
      console.log('✅ Build error fixes completed successfully!');
    } catch (error) {
      console.error('❌ Error during build fix:', error.message);
      process.exit(1);
    }
  }

  /**
   * Fix malformed JSDoc comments throughout the codebase
   */
  async fixMalformedJSDocComments() {
    console.log('🔍 Fixing malformed JSDoc comments...');
    
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
   * Check if file is a source file that needs fixing
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
   * Process individual file for malformed JSDoc fixes
   * @param {string} filePath - Path to file to process
   */
  async processFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      let updatedContent = content;
      let hasChanges = false;

      // Pattern 1: Fix comments with malformed JSDoc in the middle of lines
      // Example: "// Placeholder for image generation   /**"
      const pattern1 = /\/\/\s*([^\/\n]*?)\s*\/\*\*[\s\S]*?\*\/\s*function/g;
      if (pattern1.test(content)) {
        updatedContent = updatedContent.replace(pattern1, (match, comment) => {
          return `// ${comment.trim()}`;
        });
        hasChanges = true;
        this.stats.errorsFixed++;
      }

      // Pattern 2: Fix standalone malformed JSDoc blocks that break syntax
      // Example: "   /**\n   * Implements const functionality\n   * \n   * @function const\n   * @returns {void|Promise<void>} Function return value\n   */\n function"
      const pattern2 = /\s*\/\*\*\s*\n\s*\*\s*Implements\s+\w+\s+functionality[\s\S]*?\*\/\s*function/g;
      if (pattern2.test(updatedContent)) {
        updatedContent = updatedContent.replace(pattern2, '');
        hasChanges = true;
        this.stats.errorsFixed++;
      }

      // Pattern 3: Fix malformed JSDoc that appears after comments
      // Example: "// Helper   /**\n   * Implements to functionality"
      const pattern3 = /\/\/\s*([^\/\n]*?)\s*\/\*\*[\s\S]*?\*\s*Implements\s+\w*\s+functionality[\s\S]*?\*\//g;
      if (pattern3.test(updatedContent)) {
        updatedContent = updatedContent.replace(pattern3, (match, comment) => {
          return `// ${comment.trim()}`;
        });
        hasChanges = true;
        this.stats.errorsFixed++;
      }

      // Pattern 4: Fix orphaned JSDoc fragments
      const pattern4 = /\s*\/\*\*\s*\n\s*\*\s*Implements\s+[\w\s]*functionality[\s\S]*?\*\/(?!\s*\n\s*(?:function|const|let|var|class|export))/g;
      if (pattern4.test(updatedContent)) {
        updatedContent = updatedContent.replace(pattern4, '');
        hasChanges = true;
        this.stats.errorsFixed++;
      }

      // Pattern 5: Fix broken function declarations caused by malformed JSDoc
      const pattern5 = /\s*Implements\s+\w*\s+functionality[\s\S]*?@function\s+\w*[\s\S]*?@returns[\s\S]*?\*\/\s*$/gm;
      if (pattern5.test(updatedContent)) {
        updatedContent = updatedContent.replace(pattern5, '');
        hasChanges = true;
        this.stats.errorsFixed++;
      }

      // Pattern 6: Fix specific syntax errors from malformed comments
      const pattern6 = /\s*\/\*\*[\s\S]*?\*\s*Implements[\s\S]*?functionality[\s\S]*?\*\/\s*(?=\s*[;})\]])/g;
      if (pattern6.test(updatedContent)) {
        updatedContent = updatedContent.replace(pattern6, '');
        hasChanges = true;
        this.stats.errorsFixed++;
      }

      if (hasChanges) {
        fs.writeFileSync(filePath, updatedContent);
        console.log(`  🔧 Fixed malformed JSDoc in ${path.relative(this.projectRoot, filePath)}`);
        this.stats.filesFixed++;
      }

    } catch (error) {
      console.warn(`  ⚠️  Could not process ${filePath}: ${error.message}`);
    }
  }

  /**
   * Fix specific build errors mentioned in the error log
   */
  async fixSpecificBuildErrors() {
    console.log('\n🎯 Fixing specific build errors...');

    // Fix ai-story-generator.tsx specific issues
    await this.fixAiStoryGenerator();
    
    // Fix community-feed.tsx specific issues
    await this.fixCommunityFeed();
    
    // Fix web3-provider.tsx specific issues
    await this.fixWeb3Provider();
    
    // Fix cookies page specific issues
    await this.fixCookiesPage();
    
    // Fix create ai-story page specific issues
    await this.fixCreateAiStoryPage();
  }

  /**
   * Fix ai-story-generator.tsx specific issues
   */
  async fixAiStoryGenerator() {
    const filePath = path.join(this.projectRoot, 'components/ai-story-generator.tsx');
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;

    // Remove any remaining malformed JSDoc patterns
    const malformedPatterns = [
      /\s*\/\*\*[\s\S]*?\*\s*Implements[\s\S]*?functionality[\s\S]*?\*\/\s*function/g,
      /\s*Implements\s+\w*\s+functionality[\s\S]*?@function[\s\S]*?@returns[\s\S]*?\*\/\s*/g,
      /\s*\/\*\*[\s\S]*?\*\s*Implements[\s\S]*?functionality[\s\S]*?\*\/(?!\s*\n\s*(?:function|const|let|var|class|export))/g
    ];

    malformedPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        content = content.replace(pattern, '');
        hasChanges = true;
      }
    });

    if (hasChanges) {
      fs.writeFileSync(filePath, content);
      console.log('  🔧 Fixed ai-story-generator.tsx');
      this.stats.filesFixed++;
    }
  }

  /**
   * Fix community-feed.tsx specific issues
   */
  async fixCommunityFeed() {
    const filePath = path.join(this.projectRoot, 'components/community-feed.tsx');
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;

    // Fix the specific error pattern mentioned in build log
    const pattern = /\/\/\s*Helper\s*\/\*\*[\s\S]*?\*\s*Implements[\s\S]*?functionality[\s\S]*?\*\//g;
    if (pattern.test(content)) {
      content = content.replace(pattern, '// Helper');
      hasChanges = true;
    }

    if (hasChanges) {
      fs.writeFileSync(filePath, content);
      console.log('  🔧 Fixed community-feed.tsx');
      this.stats.filesFixed++;
    }
  }

  /**
   * Fix web3-provider.tsx specific issues
   */
  async fixWeb3Provider() {
    const filePath = path.join(this.projectRoot, 'components/providers/web3-provider.tsx');
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;

    // Fix the specific error pattern mentioned in build log
    const pattern = /\/\/\s*Add\s+mintNFTOnBase\s*\/\*\*[\s\S]*?\*\s*Implements[\s\S]*?functionality[\s\S]*?\*\//g;
    if (pattern.test(content)) {
      content = content.replace(pattern, '// Add mintNFTOnBase');
      hasChanges = true;
    }

    if (hasChanges) {
      fs.writeFileSync(filePath, content);
      console.log('  🔧 Fixed web3-provider.tsx');
      this.stats.filesFixed++;
    }
  }

  /**
   * Fix cookies page specific issues
   */
  async fixCookiesPage() {
    const filePath = path.join(this.projectRoot, 'app/cookies/page.tsx');
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;

    // Remove any malformed JSDoc that breaks JSX
    const pattern = /children:\s*\[\s*"[^"]*\/\*\*[\s\S]*?\*\/[^"]*"/g;
    if (pattern.test(content)) {
      content = content.replace(pattern, (match) => {
        // Extract just the text content, removing JSDoc
        const textMatch = match.match(/children:\s*\[\s*"([^"]*?)\/\*\*/);
        if (textMatch) {
          return `children: ["${textMatch[1].trim()}"`;
        }
        return match;
      });
      hasChanges = true;
    }

    if (hasChanges) {
      fs.writeFileSync(filePath, content);
      console.log('  🔧 Fixed cookies/page.tsx');
      this.stats.filesFixed++;
    }
  }

  /**
   * Fix create ai-story page specific issues
   */
  async fixCreateAiStoryPage() {
    const filePath = path.join(this.projectRoot, 'app/create/ai-story/page.tsx');
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;

    // Fix the specific error pattern mentioned in build log
    const pattern = /\/\/\s*This\s*\/\*\*[\s\S]*?\*\s*Implements[\s\S]*?functionality[\s\S]*?\*\//g;
    if (pattern.test(content)) {
      content = content.replace(pattern, '// This');
      hasChanges = true;
    }

    if (hasChanges) {
      fs.writeFileSync(filePath, content);
      console.log('  🔧 Fixed create/ai-story/page.tsx');
      this.stats.filesFixed++;
    }
  }

  /**
   * Print summary of fixes applied
   */
  printSummary() {
    console.log('\n📊 Build Error Fix Summary:');
    console.log(`  Files fixed: ${this.stats.filesFixed}`);
    console.log(`  Errors fixed: ${this.stats.errorsFixed}`);
  }
}

// Run the build error fixer if called directly
if (require.main === module) {
  const fixer = new BuildErrorFixer();
  fixer.run().catch(console.error);
}

module.exports = BuildErrorFixer;
