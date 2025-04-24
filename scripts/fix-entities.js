// Script to fix unescaped entities in React components

const fs = require('fs');
const path = require('path');

console.log('Fixing unescaped entities in React components...');

const filesToFix = [
  'app/admin/login/page.tsx',
  'app/community/creators/page.tsx',
  'app/contact/page.tsx',
  'app/create/ai-story/page.tsx',
  'app/create/page.tsx',
  'app/docs/page.tsx',
  'app/faq/page.tsx',
  'app/genres/[slug]/page.tsx',
  'app/genres/page.tsx',
  'app/landing/page.tsx',
  'app/page.tsx',
  'app/profile/settings/page.tsx',
  'app/stories/[id]/page.tsx',
  'app/stories/page.tsx',
  'app/story-tools/page.tsx',
  'app/terms/page.tsx',
  'components/admin-login-modal.tsx',
  'components/ai-story-generator.tsx',
  'components/story-comments-dialog.tsx',
  'components/story-summary.tsx'
];

function replaceEntities(filePath) {
  console.log(`Processing: ${filePath}`);
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    // Replace unescaped single quotes
    content = content.replace(/(can)'()/g, '$1&apos;$2');
    content = content.replace(/(doesn)'()/g, '$1&apos;$2');
    content = content.replace(/(don)'()/g, '$1&apos;$2');
    content = content.replace(/(won)'()/g, '$1&apos;$2');
    content = content.replace(/(isn)'()/g, '$1&apos;$2');
    // Replace unescaped double quotes
    content = content.replace(/(")([^"]*?)(")/g, '&quot;$2&quot;');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed entities in ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

filesToFix.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    replaceEntities(filePath);
  } else {
    console.warn(`File not found: ${filePath}`);
  }
});

console.log('Finished fixing unescaped entities. Run "npm run lint -- --fix" to apply any other auto-fixes, then try building again.'); 