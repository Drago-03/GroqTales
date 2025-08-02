#!/usr/bin/env node

/**
 * Final API Route Cleanup Script for GroqTales
 * 
 * This script fixes the remaining specific syntax errors in API routes:
 * - Duplicate imports
 * - Unterminated block comments
 * - Missing closing braces
 * - Malformed function structures
 */

const fs = require('fs');
const path = require('path');

class FinalApiCleanup {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.stats = { filesFixed: 0, errorsFixed: 0 };
  }

  async run() {
    console.log('🔧 Performing final API route cleanup...\n');
    
    try {
      // Fix specific problematic files
      await this.fixGenerateAndMint();
      await this.fixGroqRoute();
      await this.fixMonadRoute();
      await this.fixAdminLogin();
      
      this.printSummary();
      console.log('✅ Final API cleanup completed!');
    } catch (error) {
      console.error('❌ Error during final API cleanup:', error.message);
      process.exit(1);
    }
  }

  async fixGenerateAndMint() {
    const filePath = path.join(this.projectRoot, 'app/api/generate-and-mint/route.ts');
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;

    // Remove duplicate NextResponse imports
    const lines = content.split('\n');
    const seenImports = new Set();
    const filteredLines = [];

    for (const line of lines) {
      if (line.includes('import') && line.includes('NextResponse')) {
        const importKey = line.trim();
        if (!seenImports.has(importKey)) {
          seenImports.add(importKey);
          filteredLines.push(line);
        } else {
          hasChanges = true;
          this.stats.errorsFixed++;
        }
      } else {
        filteredLines.push(line);
      }
    }

    if (hasChanges) {
      content = filteredLines.join('\n');
      fs.writeFileSync(filePath, content);
      console.log(`  🔧 Fixed ${path.relative(this.projectRoot, filePath)}`);
      this.stats.filesFixed++;
    }
  }

  async fixGroqRoute() {
    const filePath = path.join(this.projectRoot, 'app/api/groq/route.ts');
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;

    // Fix unterminated block comment - remove orphaned /** at line 51
    content = content.replace(/,\s*\/\*\*\s*\n\s*export async function/g, '\n\nexport async function');
    if (content !== fs.readFileSync(filePath, 'utf8')) {
      hasChanges = true;
      this.stats.errorsFixed++;
    }

    // Fix missing closing braces and malformed structure
    const lines = content.split('\n');
    const fixedLines = [];
    let braceCount = 0;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      
      // Count braces
      braceCount += (line.match(/\{/g) || []).length;
      braceCount -= (line.match(/\}/g) || []).length;
      
      fixedLines.push(line);
    }

    // Add missing closing braces if needed
    while (braceCount > 0) {
      fixedLines.push('}');
      braceCount--;
      hasChanges = true;
      this.stats.errorsFixed++;
    }

    if (hasChanges) {
      content = fixedLines.join('\n');
      fs.writeFileSync(filePath, content);
      console.log(`  🔧 Fixed ${path.relative(this.projectRoot, filePath)}`);
      this.stats.filesFixed++;
    }
  }

  async fixMonadRoute() {
    const filePath = path.join(this.projectRoot, 'app/api/monad/route.ts');
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;

    // Fix unterminated block comment - remove orphaned /** at line 58
    content = content.replace(/,\s*\/\*\*\s*\n\s*export async function/g, '\n\nexport async function');
    if (content !== fs.readFileSync(filePath, 'utf8')) {
      hasChanges = true;
      this.stats.errorsFixed++;
    }

    // Fix missing closing braces
    const lines = content.split('\n');
    const fixedLines = [];
    let braceCount = 0;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      
      // Count braces
      braceCount += (line.match(/\{/g) || []).length;
      braceCount -= (line.match(/\}/g) || []).length;
      
      fixedLines.push(line);
    }

    // Add missing closing braces if needed
    while (braceCount > 0) {
      fixedLines.push('}');
      braceCount--;
      hasChanges = true;
      this.stats.errorsFixed++;
    }

    if (hasChanges) {
      content = fixedLines.join('\n');
      fs.writeFileSync(filePath, content);
      console.log(`  🔧 Fixed ${path.relative(this.projectRoot, filePath)}`);
      this.stats.filesFixed++;
    }
  }

  async fixAdminLogin() {
    const filePath = path.join(this.projectRoot, 'app/admin/login/page.tsx');
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;

    // Fix missing closing braces
    const lines = content.split('\n');
    const fixedLines = [];
    let braceCount = 0;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      
      // Count braces
      braceCount += (line.match(/\{/g) || []).length;
      braceCount -= (line.match(/\}/g) || []).length;
      
      fixedLines.push(line);
    }

    // Add missing closing braces if needed
    while (braceCount > 0) {
      fixedLines.push('}');
      braceCount--;
      hasChanges = true;
      this.stats.errorsFixed++;
    }

    if (hasChanges) {
      content = fixedLines.join('\n');
      fs.writeFileSync(filePath, content);
      console.log(`  🔧 Fixed ${path.relative(this.projectRoot, filePath)}`);
      this.stats.filesFixed++;
    }
  }

  printSummary() {
    console.log('\n📊 Final API Cleanup Summary:');
    console.log(`  Files fixed: ${this.stats.filesFixed}`);
    console.log(`  Errors fixed: ${this.stats.errorsFixed}`);
  }
}

// Run the final API cleanup if called directly
if (require.main === module) {
  const cleanup = new FinalApiCleanup();
  cleanup.run().catch(console.error);
}

module.exports = FinalApiCleanup;
