import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');

async function getFiles(dir) {
  const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map((dirent) => {
    const res = path.resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFiles(res) : res;
  }));
  return files.flat();
}

async function optimizeImages() {
  console.log('Scanning images in:', IMAGES_DIR);
  const allFiles = await getFiles(IMAGES_DIR);
  
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.JPG'];
  const filesToProcess = allFiles.filter(file => 
    imageExtensions.includes(path.extname(file))
  );

  console.log(`Found ${filesToProcess.length} images to optimize.`);
  
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;

  for (const file of filesToProcess) {
    const ext = path.extname(file);
    const dir = path.dirname(file);
    const base = path.basename(file, ext);
    const webpFile = path.join(dir, `${base}.webp`);
    
    const originalSize = fs.statSync(file).size;
    totalOriginalSize += originalSize;

    console.log(`Processing: ${path.relative(IMAGES_DIR, file)} (${(originalSize / 1024).toFixed(1)} KB)`);

    try {
      let pipeline = sharp(file);
      
      // Keep animations for GIF files
      if (ext.toLowerCase() === '.gif') {
        pipeline = pipeline.webp({ animated: true, quality: 75 });
      } else {
        pipeline = pipeline.webp({ quality: 80 });
      }

      await pipeline.toFile(webpFile);
      
      const optimizedSize = fs.statSync(webpFile).size;
      totalOptimizedSize += optimizedSize;

      console.log(`  -> Saved as: ${path.relative(IMAGES_DIR, webpFile)} (${(optimizedSize / 1024).toFixed(1)} KB) - Saved ${((originalSize - optimizedSize) / originalSize * 100).toFixed(1)}%`);
      
      // Delete original file
      fs.unlinkSync(file);
    } catch (err) {
      console.error(`  Error processing ${path.relative(IMAGES_DIR, file)}:`, err.message);
    }
  }

  const savedBytes = totalOriginalSize - totalOptimizedSize;
  console.log('\n--- Optimization Summary ---');
  console.log(`Original Size: ${(totalOriginalSize / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Optimized Size: ${(totalOptimizedSize / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Total Space Saved: ${(savedBytes / (1024 * 1024)).toFixed(2)} MB (${(savedBytes / totalOriginalSize * 100).toFixed(1)}% reduction)`);
}

optimizeImages().catch(console.error);
