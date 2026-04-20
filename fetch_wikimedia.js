import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicImagesDir = path.join(__dirname, 'client/public/images');
const serverImagesDir = path.join(__dirname, 'server/public/images');

const itemsToFetch = [
  { name: 'maasai_shield.jpg', query: 'Maasai shield' },
  { name: 'kenya_shilling.jpg', query: 'Kenya shilling coin' },
  { name: 'kikuyu_kiondo.jpg', query: 'Kiondo' },
  { name: 'kamba_carving.jpg', query: 'Makonde carving' },
  { name: 'safari_poster.jpg', query: 'Safari poster vintage' },
  { name: 'kenyan_stamps.jpg', query: 'Kenya stamp' },
  { name: 'swahili_door.jpg', query: 'Zanzibar door' },
  { name: 'brass_pot.jpg', query: 'Antique brass coffee pot' },
  { name: 'trade_beads.jpg', query: 'Trade beads' },
  { name: 'turkana_headrest.jpg', query: 'African headrest' },
  { name: 'binoculars.jpg', query: 'Vintage binoculars' }
];

async function fetchWikimediaImage(query, name) {
  try {
    // 1. Search for the image on Wikimedia Commons
    const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=File:${encodeURIComponent(query)}&utf8=&format=json`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    
    // Fallback if no images found
    let title = 'File:Maasai_warrior_with_shield_and_spear.jpg';
    if (searchData.query.search.length > 0) {
      title = searchData.query.search[0].title;
    } else {
        // Broaden search
        const broadUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=File:${encodeURIComponent(query.split(' ')[0])}&utf8=&format=json`;
        const broadRes = await fetch(broadUrl);
        const broadData = await broadRes.json();
        if (broadData.query.search.length > 0) {
            title = broadData.query.search[0].title;
        }
    }

    // 2. Get the actual image URL
    const imageInfoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&format=json`;
    const iiRes = await fetch(imageInfoUrl);
    const iiData = await iiRes.json();
    
    const pages = iiData.query.pages;
    const page = pages[Object.keys(pages)[0]];
    if (!page.imageinfo || page.imageinfo.length === 0) throw new Error("No image info");
    
    let imageUrl = page.imageinfo[0].url;
    
    console.log(`Downloading ${name} from ${imageUrl}`);
    
    // 3. Download the image
    const imgRes = await fetch(imageUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (Node JS Script)' }});
    const buffer = await imgRes.arrayBuffer();
    
    fs.writeFileSync(path.join(publicImagesDir, name), Buffer.from(buffer));
    fs.copyFileSync(path.join(publicImagesDir, name), path.join(serverImagesDir, name));
    
  } catch (err) {
    console.error(`Failed for ${name}: `, err.message);
  }
}

(async () => {
  for (const item of itemsToFetch) {
    await fetchWikimediaImage(item.query, item.name);
  }
  console.log("Done");
})();
