import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesToDownload = [
  { name: 'maasai_shield.jpg', url: 'https://images.unsplash.com/photo-1605333501700-0e10cd398322?w=600&q=80' },
  { name: 'kenya_shilling.jpg', url: 'https://images.unsplash.com/photo-1582236528760-4c3116d90069?w=600&q=80' },
  { name: 'kikuyu_kiondo.jpg', url: 'https://images.unsplash.com/photo-1581428381830-ec68a3bbff27?w=600&q=80' },
  { name: 'kamba_carving.jpg', url: 'https://images.unsplash.com/photo-1549488344-c71e2efd24d2?w=600&q=80' },
  { name: 'safari_poster.jpg', url: 'https://images.unsplash.com/photo-1563248666-ac90e9df1e90?w=600&q=80' },
  { name: 'kenyan_stamps.jpg', url: 'https://images.unsplash.com/photo-1579482816431-7e50201a0bc1?w=600&q=80' },
  { name: 'swahili_door.jpg', url: 'https://images.unsplash.com/photo-1606113645228-3e2b20fb9f8d?w=600&q=80' },
  { name: 'nakuru_clock.jpg', url: 'https://images.unsplash.com/photo-1542384701-c0e46e0eda04?w=600&q=80' },
  { name: 'tingatinga.jpg', url: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600&q=80' },
  { name: 'binoculars.jpg', url: 'https://images.unsplash.com/photo-1517590829875-103300808b49?w=600&q=80' },
  { name: 'nyatiti.jpg', url: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&q=80' },
  { name: 'brass_pot.jpg', url: 'https://images.unsplash.com/photo-1610488616140-fd531e2ec219?w=600&q=80' },
  { name: 'trade_beads.jpg', url: 'https://images.unsplash.com/photo-1606555173360-1e5f08d06d4e?w=600&q=80' },
  { name: 'turkana_headrest.jpg', url: 'https://images.unsplash.com/photo-1555627038-f9ff7ea7c89d?w=600&q=80' },
  { name: 'african_maps.jpg', url: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&q=80' }
];

const publicImagesDir = path.join(__dirname, 'client/public/images');
const serverImagesDir = path.join(__dirname, 'server/public/images');

if (!fs.existsSync(publicImagesDir)) fs.mkdirSync(publicImagesDir, { recursive: true });
if (!fs.existsSync(serverImagesDir)) fs.mkdirSync(serverImagesDir, { recursive: true });

async function downloadImage({ name, url }) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      // Unsplash redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, (redirectRes) => {
          const clientStream = fs.createWriteStream(path.join(publicImagesDir, name));
          redirectRes.pipe(clientStream);
          clientStream.on('finish', () => {
            fs.copyFileSync(path.join(publicImagesDir, name), path.join(serverImagesDir, name));
            resolve();
          });
        }).on('error', reject);
      } else {
        const clientStream = fs.createWriteStream(path.join(publicImagesDir, name));
        res.pipe(clientStream);
        clientStream.on('finish', () => {
          fs.copyFileSync(path.join(publicImagesDir, name), path.join(serverImagesDir, name));
          resolve();
        });
      }
    }).on('error', reject);
  });
}

(async () => {
  for (const img of imagesToDownload) {
    console.log('Downloading', img.name);
    await downloadImage(img);
  }
  console.log('Done downloading images');
})();
