// Production Build Security Script
// Removes console statements safely for production builds

const fs = require('fs');
const path = require('path');

function removeConsoleStatements(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // More careful console removal that preserves syntax
    content = content.replace(
      /console\.(log|warn|error|info|debug|trace)\s*\([^)]*\)\s*;?/g, 
      '// Console statement removed for production'
    );
    
    // Handle multiline console statements
    content = content.replace(
      /console\.(log|warn|error|info|debug|trace)\s*\(\s*[\s\S]*?\)\s*;?/g,
      '// Console statement removed for production'
    );
    
    fs.writeFileSync(filePath, content);
    return true;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return false;
  }
}

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  let processed = 0;
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.includes('node_modules') && !file.includes('.git')) {
      processed += processDirectory(filePath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      if (removeConsoleStatements(filePath)) {
        processed++;
      }
    }
  });
  
  return processed;
}

if (process.env.NODE_ENV === 'production') {
  console.log('🧹 Removing console statements for production build...');
  const processed = processDirectory(path.join(__dirname, 'src'));
  console.log(`✅ Processed ${processed} files`);
} else {
  console.log('⚠️ Skipping console removal in development mode');
}