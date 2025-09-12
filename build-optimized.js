#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

console.log('🚀 Starting optimized build process...\n');

// Step 1: Clean previous build
console.log('🧹 Cleaning previous build...');
try {
  execSync('rm -rf dist', { stdio: 'inherit' });
} catch (error) {
  // Directory might not exist, which is fine
}

// Step 2: Build with production configuration
console.log('📦 Building with production optimizations...');
execSync('ng build --configuration production', { stdio: 'inherit' });

// Step 3: Create gzipped versions of files
console.log('🗜️  Creating gzipped versions...');
const distDir = path.join(__dirname, 'dist/portfolio');

function gzipFile(filePath) {
  const fileContent = fs.readFileSync(filePath);
  const gzippedContent = zlib.gzipSync(fileContent, { level: 9 });
  fs.writeFileSync(filePath + '.gz', gzippedContent);
  
  const originalSize = fileContent.length;
  const gzippedSize = gzippedContent.length;
  const compressionRatio = ((1 - gzippedSize / originalSize) * 100).toFixed(2);
  
  console.log(`  ✓ ${path.basename(filePath)}: ${originalSize} → ${gzippedSize} bytes (${compressionRatio}% reduction)`);
}

function walkDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDirectory(filePath);
    } else if (/\.(js|css|html|json|svg|txt)$/.test(file) && !file.endsWith('.gz')) {
      gzipFile(filePath);
    }
  });
}

if (fs.existsSync(distDir)) {
  walkDirectory(distDir);
}

// Step 4: Display build statistics
console.log('\n📊 Build Statistics:');
function getFolderSize(folderPath) {
  let totalSize = 0;
  
  function calculateSize(dirPath) {
    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        calculateSize(filePath);
      } else {
        totalSize += stat.size;
      }
    });
  }
  
  calculateSize(folderPath);
  return totalSize;
}

if (fs.existsSync(distDir)) {
  const totalSize = getFolderSize(distDir);
  console.log(`  Total build size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  
  // Count files by type
  const fileTypes = {};
  function countFiles(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        countFiles(filePath);
      } else {
        const ext = path.extname(file).toLowerCase();
        fileTypes[ext] = (fileTypes[ext] || 0) + 1;
      }
    });
  }
  
  countFiles(distDir);
  console.log('  File types:', fileTypes);
}

console.log('\n✅ Optimized build complete! Ready for AWS S3 deployment.');
console.log('\n📝 Deployment notes:');
console.log('  • Enable gzip compression on S3/CloudFront');
console.log('  • Set proper cache headers for static assets');
console.log('  • Configure SPA routing fallback to index.html');
console.log('  • Consider using CloudFront for global CDN');