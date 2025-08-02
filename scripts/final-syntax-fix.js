#!/usr/bin/env node

/**
 * Final Syntax Fix Script for GroqTales
 * 
 * This script fixes the remaining specific syntax errors identified in the build log:
 * - Missing function keywords
 * - Malformed interface declarations
 * - Broken import statements
 * - Orphaned comment fragments
 */

const fs = require('fs');
const path = require('path');

class FinalSyntaxFixer {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.stats = { filesFixed: 0, errorsFixed: 0 };
  }

  async run() {
    console.log('🔧 Applying final syntax fixes...\n');
    
    try {
      // Fix specific files mentioned in build errors
      await this.fixAiStoryGenerator();
      await this.fixCommunityFeed();
      await this.fixLoadingScreen();
      await this.fixWeb3Provider();
      await this.fixSplashScreen();
      
      this.printSummary();
      console.log('✅ Final syntax fixes completed!');
    } catch (error) {
      console.error('❌ Error during final syntax fix:', error.message);
      process.exit(1);
    }
  }

  async fixAiStoryGenerator() {
    const filePath = path.join(this.projectRoot, 'components/ai-story-generator.tsx');
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;

    // Fix the specific error: } from "@/components/ui/dialog"; AnimatedSparkles() {
    const pattern1 = /}\s+from\s+"[^"]+"\s*;\s*(\w+)\s*\(\s*\)\s*\{/g;
    if (pattern1.test(content)) {
      content = content.replace(pattern1, '} from "$1";\n\nfunction $2() {');
      hasChanges = true;
      this.stats.errorsFixed++;
    }

    // More general pattern for broken import + function
    const pattern2 = /}\s+from\s+"([^"]+)"\s*;\s*(\w+)\(/g;
    if (pattern2.test(content)) {
      content = content.replace(pattern2, '} from "$1";\n\nfunction $2(');
      hasChanges = true;
      this.stats.errorsFixed++;
    }

    if (hasChanges) {
      fs.writeFileSync(filePath, content);
      console.log('  🔧 Fixed ai-story-generator.tsx');
      this.stats.filesFixed++;
    }
  }

  async fixCommunityFeed() {
    const filePath = path.join(this.projectRoot, 'components/community-feed.tsx');
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;

    // Fix the specific error: ]; PostActions({ post, onVote, onCommentClick }: { post: CommunityPost, onVote: (postId: string, vote: 'up' | 'down' | null) => void, onCommentClick: (postId: string) => void }) {
    const pattern = /\];\s*(\w+)\(\s*\{([^}]+)\}\s*:\s*\{([^}]+)\}\s*\)\s*\{/g;
    if (pattern.test(content)) {
      content = content.replace(pattern, '];\n\nfunction $1({ $2 }: { $3 }) {');
      hasChanges = true;
      this.stats.errorsFixed++;
    }

    if (hasChanges) {
      fs.writeFileSync(filePath, content);
      console.log('  🔧 Fixed community-feed.tsx');
      this.stats.filesFixed++;
    }
  }

  async fixLoadingScreen() {
    const filePath = path.join(this.projectRoot, 'components/loading-screen.tsx');
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;

    // Fix malformed interface: }} instead of }
    const pattern1 = /interface\s+\w+\s*\{[^}]*\}\}/g;
    if (pattern1.test(content)) {
      content = content.replace(pattern1, (match) => {
        return match.replace(/\}\}$/, '}');
      });
      hasChanges = true;
      this.stats.errorsFixed++;
    }

    // Remove orphaned code fragments
    const pattern2 = /\}\}\s*<div/g;
    if (pattern2.test(content)) {
      content = content.replace(pattern2, '}\n\nexport default function LoadingScreen() {\n  return (\n    <div');
      hasChanges = true;
      this.stats.errorsFixed++;
    }

    if (hasChanges) {
      fs.writeFileSync(filePath, content);
      console.log('  🔧 Fixed loading-screen.tsx');
      this.stats.filesFixed++;
    }
  }

  async fixWeb3Provider() {
    const filePath = path.join(this.projectRoot, 'components/providers/web3-provider.tsx');
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;

    // Remove orphaned comment fragments like "* @returns {void|Promise<void>} Function return value\n   */ const"
    const pattern1 = /\s*\*\s*@returns[^*]*\*\/\s*const\s*$/gm;
    if (pattern1.test(content)) {
      content = content.replace(pattern1, '');
      hasChanges = true;
      this.stats.errorsFixed++;
    }

    // Remove orphaned comment lines
    const pattern2 = /^\s*\*\s*@returns[^*\n]*$/gm;
    if (pattern2.test(content)) {
      content = content.replace(pattern2, '');
      hasChanges = true;
      this.stats.errorsFixed++;
    }

    if (hasChanges) {
      fs.writeFileSync(filePath, content);
      console.log('  🔧 Fixed web3-provider.tsx');
      this.stats.filesFixed++;
    }
  }

  async fixSplashScreen() {
    const filePath = path.join(this.projectRoot, 'components/splash-screen.tsx');
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;

    // Fix malformed interface: }} instead of }
    const pattern1 = /interface\s+\w+\s*\{[^}]*\}\}/g;
    if (pattern1.test(content)) {
      content = content.replace(pattern1, (match) => {
        return match.replace(/\}\}$/, '}');
      });
      hasChanges = true;
      this.stats.errorsFixed++;
    }

    // Remove orphaned code fragments and fix structure
    const pattern2 = /\}\}\s*<div/g;
    if (pattern2.test(content)) {
      content = content.replace(pattern2, '}\n\nexport default function SplashScreen({ onComplete, minDisplayTime = 2000 }: SplashScreenProps) {\n  return (\n    <div');
      hasChanges = true;
      this.stats.errorsFixed++;
    }

    if (hasChanges) {
      fs.writeFileSync(filePath, content);
      console.log('  🔧 Fixed splash-screen.tsx');
      this.stats.filesFixed++;
    }
  }

  printSummary() {
    console.log('\n📊 Final Syntax Fix Summary:');
    console.log(`  Files fixed: ${this.stats.filesFixed}`);
    console.log(`  Errors fixed: ${this.stats.errorsFixed}`);
  }
}

// Run the final syntax fixer if called directly
if (require.main === module) {
  const fixer = new FinalSyntaxFixer();
  fixer.run().catch(console.error);
}

module.exports = FinalSyntaxFixer;
