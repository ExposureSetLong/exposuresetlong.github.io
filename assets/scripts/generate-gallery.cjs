// generate-gallery.js
const fs = require('fs');
const path = require('path');
const { exiftool } = require('exiftool-vendored');

const portfolioRoot = path.join(__dirname, '..', '..', 'portfolio');
const outputDir = path.join(__dirname, 'gallery');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const validExtensions = /\.(jpe?g|png|webp)$/i;

fs.readdirSync(portfolioRoot).forEach(async category => {
  const imageDir = path.join(portfolioRoot, category, 'images');
  if (!fs.existsSync(imageDir)) return;

  const images = fs.readdirSync(imageDir).filter(f => validExtensions.test(f));
  const galleryData = [];

  for (const image of images) {
    const fullPath = path.join(imageDir, image);
    let title = "", caption = "";

    try {
      const metadata = await exiftool.read(fullPath);
      title = metadata.Title || "";
      caption = metadata.Caption || metadata.ImageDescription || "";
    } catch (err) {
      console.warn(`⚠️ Metadata error in ${image}:`, err.message);
    }

    galleryData.push({ filename: image, title, caption });
  }

  const outputPath = path.join(outputDir, `${category}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(galleryData, null, 2));
  console.log(`✅ Wrote ${galleryData.length} entries to ${category}.json`);
});

process.on('exit', () => exiftool.end());
