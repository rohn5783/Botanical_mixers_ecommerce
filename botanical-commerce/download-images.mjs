import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetBaseDir = path.resolve(__dirname, 'frontend', 'public', 'images');

const imageList = [
  // Products
  {
    dir: 'products',
    file: 'kokum-bottle-main.jpg',
    url: 'https://images.unsplash.com/photo-1546171753-97d7676e4602?auto=format&fit=crop&w=800&q=80',
  },
  {
    dir: 'products',
    file: 'kokum-serve-glass.jpg',
    url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
  },
  {
    dir: 'products',
    file: 'kokum-harvest.jpg',
    url: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80',
  },
  {
    dir: 'products',
    file: 'nannari-bottle-main.jpg',
    url: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=800&q=80',
  },
  {
    dir: 'products',
    file: 'nannari-serve-glass.jpg',
    url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
  },
  {
    dir: 'products',
    file: 'nannari-roots.jpg',
    url: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80',
  },
  {
    dir: 'products',
    file: 'jamun-bottle-main.jpg',
    url: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&w=800&q=80',
  },
  {
    dir: 'products',
    file: 'jamun-serve-glass.jpg',
    url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
  },
  {
    dir: 'products',
    file: 'jamun-fruits.jpg',
    url: 'https://images.unsplash.com/photo-1568644396922-5c3bfae12521?auto=format&fit=crop&w=800&q=80',
  },
  {
    dir: 'products',
    file: 'hibiscus-bottle-main.jpg',
    url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80',
  },
  {
    dir: 'products',
    file: 'hibiscus-serve-glass.jpg',
    url: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80',
  },
  {
    dir: 'products',
    file: 'hibiscus-flower.jpg',
    url: 'https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?auto=format&fit=crop&w=800&q=80',
  },
  {
    dir: 'products',
    file: 'discovery-box-main.jpg',
    url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
  },
  {
    dir: 'products',
    file: 'discovery-box-open.jpg',
    url: 'https://images.unsplash.com/photo-1528821128474-27f963b062bf?auto=format&fit=crop&w=800&q=80',
  },
  {
    dir: 'products',
    file: 'discovery-box-bottles.jpg',
    url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
  },
  {
    dir: 'products',
    file: 'barista-trio-main.jpg',
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
  },
  {
    dir: 'products',
    file: 'barista-pumps.jpg',
    url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
  },

  // Botanicals
  {
    dir: 'botanicals',
    file: 'kokum-detail.jpg',
    url: 'https://images.unsplash.com/photo-1546171753-97d7676e4602?auto=format&fit=crop&w=800&q=80',
  },
  {
    dir: 'botanicals',
    file: 'kokum-banner.jpg',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    dir: 'botanicals',
    file: 'nannari-detail.jpg',
    url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
  },
  {
    dir: 'botanicals',
    file: 'nannari-banner.jpg',
    url: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=80',
  },
  {
    dir: 'botanicals',
    file: 'jamun-detail.jpg',
    url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
  },
  {
    dir: 'botanicals',
    file: 'jamun-banner.jpg',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    dir: 'botanicals',
    file: 'hibiscus-detail.jpg',
    url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80',
  },
  {
    dir: 'botanicals',
    file: 'hibiscus-banner.jpg',
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
  },

  // Categories
  {
    dir: 'categories',
    file: 'kokum.jpg',
    url: 'https://images.unsplash.com/photo-1546171753-97d7676e4602?auto=format&fit=crop&w=600&q=80',
  },
  {
    dir: 'categories',
    file: 'nannari.jpg',
    url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
  },
  {
    dir: 'categories',
    file: 'jamun.jpg',
    url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
  },
  {
    dir: 'categories',
    file: 'hibiscus.jpg',
    url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=600&q=80',
  },
  {
    dir: 'categories',
    file: 'blends.jpg',
    url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80',
  },
  {
    dir: 'categories',
    file: 'kits.jpg',
    url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80',
  },

  // Recipes
  {
    dir: 'recipes',
    file: 'recipe-kokum-highball.jpg',
    url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
  },
  {
    dir: 'recipes',
    file: 'recipe-nannari-coldbrew.jpg',
    url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80',
  },
  {
    dir: 'recipes',
    file: 'recipe-jamun-spritz.jpg',
    url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
  },
  {
    dir: 'recipes',
    file: 'recipe-hibiscus-lemonade.jpg',
    url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80',
  },

  // Hero & Brand
  {
    dir: '',
    file: 'hero-bottle.jpg',
    url: 'https://images.unsplash.com/photo-1546171753-97d7676e4602?auto=format&fit=crop&w=1000&q=80',
  },
  {
    dir: '',
    file: 'brand-story.jpg',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80',
  },
];

async function downloadFile(url, destPath) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(destPath, buffer);
    const stats = fs.statSync(destPath);
    console.log(`✓ Downloaded ${path.basename(destPath)} (${(stats.size / 1024).toFixed(1)} KB)`);
    return true;
  } catch (err) {
    console.error(`✗ Failed ${path.basename(destPath)}: ${err.message}`);
    return false;
  }
}

async function main() {
  console.log(`Starting image asset setup in: ${targetBaseDir}`);

  // Create directories
  const dirs = ['', 'products', 'botanicals', 'categories', 'recipes'];
  for (const d of dirs) {
    const fullDirPath = path.join(targetBaseDir, d);
    if (!fs.existsSync(fullDirPath)) {
      fs.mkdirSync(fullDirPath, { recursive: true });
    }
  }

  let successCount = 0;
  for (const item of imageList) {
    const targetDir = path.join(targetBaseDir, item.dir);
    const destPath = path.join(targetDir, item.file);

    // Skip if already exists and size > 10KB
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 10000) {
      console.log(`- Exists: ${path.join(item.dir, item.file)}`);
      successCount++;
      continue;
    }

    const ok = await downloadFile(item.url, destPath);
    if (ok) successCount++;
  }

  console.log(`\nCompleted: ${successCount}/${imageList.length} images ready.`);
}

main();
