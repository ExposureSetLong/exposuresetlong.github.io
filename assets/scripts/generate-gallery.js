// generate-gallery.js
const fs = require('fs');
const path = require('path');

const portfolioRoot = path.join(__dirname, '..', '..', 'portfolio');
const outputDir = path.join(__dirname, 'gallery');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

fs.readdirSync(portfolioRoot).forEach(category => {
  const imageDir = path.join(portfolioRoot, category, 'images');
  if (!fs.existsSync(imageDir)) return;

  const images = fs.readdirSync(imageDir).filter(file =>
    /\.(jpe?g|png|gif|webp)$/i.test(file)
  );

  const outputPath = path.join(outputDir, `${category}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(images, null, 2));
  console.log(`✅ Wrote ${images.length} images for ${category}`);
});
