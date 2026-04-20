import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import itemsRouter from './routes/items.js';
import usersRouter from './routes/users.js';
import messagesRouter from './routes/messages.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure data directory exists
const dataDir = join(__dirname, 'data');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

// Initialize data files with sample data
const initDataFiles = () => {
  // Items data
  const itemsPath = join(dataDir, 'items.json');
  if (!existsSync(itemsPath)) {
    const sampleItems = [
      {
        id: '1',
        name: 'Hand-Carved Maasai Shield',
        description: 'Authentic traditional Maasai shield, crafted with authentic materials and natural pigments.',
        price: 15000,
        image: '/images/maasai_shield.jpg',
        sellerId: 'user1',
        sellerName: 'CurioMaster',
        status: 'active',
        highestOffer: null,
        highestOfferBuyer: null,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Vintage 1966 Kenya Shilling Coin',
        description: 'Uncirculated Mzee Jomo Kenyatta shilling from 1966, an absolute numismatic gem.',
        price: 5000,
        image: '/images/kenya_shilling.jpg',
        sellerId: 'user2',
        sellerName: 'NairobiAntiques',
        status: 'active',
        highestOffer: null,
        highestOfferBuyer: null,
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Traditional Kikuyu Kiondo',
        description: 'Handwoven sisal and leather bag, excellent condition, historically accurate patterns.',
        price: 6500,
        image: '/images/kikuyu_kiondo.jpg',
        sellerId: 'user3',
        sellerName: 'HeritageFinds',
        status: 'active',
        highestOffer: null,
        highestOfferBuyer: null,
        createdAt: new Date().toISOString()
      },
      {
        id: '4',
        name: 'Authentic Kamba Wood Carving',
        description: 'Intricately detailed ebony wood carving depicting African wildlife.',
        price: 8500,
        image: '/images/kamba_carving.jpg',
        sellerId: 'user1',
        sellerName: 'CurioMaster',
        status: 'active',
        highestOffer: null,
        highestOfferBuyer: null,
        createdAt: new Date().toISOString()
      },
      {
        id: '5',
        name: 'Vintage East African Safari Rally Poster',
        description: 'Original promotional poster from the 1970 Safari Rally, framed.',
        price: 25000,
        image: '/images/safari_poster.jpg',
        sellerId: 'user2',
        sellerName: 'NairobiAntiques',
        status: 'active',
        highestOffer: null,
        highestOfferBuyer: null,
        createdAt: new Date().toISOString()
      },
      {
        id: '6',
        name: 'Rare Kenyan Independence Stamp Collection',
        description: 'Complete set of 1963 independence commemorative stamps.',
        price: 80000,
        image: '/images/kenyan_stamps.jpg',
        sellerId: 'user3',
        sellerName: 'HeritageFinds',
        status: 'active',
        highestOffer: null,
        highestOfferBuyer: null,
        createdAt: new Date().toISOString()
      },
      {
        id: '7',
        name: 'Antique Swahili Carved Door Panel',
        description: 'A genuine piece of coastal Swahili architecture with intricate brass studs.',
        price: 150000,
        image: '/images/swahili_door.jpg',
        sellerId: 'user1',
        sellerName: 'CurioMaster',
        status: 'active',
        highestOffer: null,
        highestOfferBuyer: null,
        createdAt: new Date().toISOString()
      },
      {
        id: '8',
        name: 'Retro Nakuru Railway Station Clock',
        description: 'Heavy brass clock salvaged from the old railway station, still ticking.',
        price: 45000,
        image: '/images/nakuru_clock.jpg',
        sellerId: 'user2',
        sellerName: 'NairobiAntiques',
        status: 'active',
        highestOffer: null,
        highestOfferBuyer: null,
        createdAt: new Date().toISOString()
      },
      {
        id: '9',
        name: 'Original Tingatinga Painting',
        description: 'Vibrant animal portrait in enamel paint, a true East African classic.',
        price: 35000,
        image: '/images/tingatinga.jpg',
        sellerId: 'user3',
        sellerName: 'HeritageFinds',
        status: 'active',
        highestOffer: null,
        highestOfferBuyer: null,
        createdAt: new Date().toISOString()
      },
      {
        id: '10',
        name: 'Vintage Safari Binoculars',
        description: 'Leather-bound Carl Zeiss binoculars used during 1960s expeditions.',
        price: 20000,
        image: '/images/binoculars.jpg',
        sellerId: 'user1',
        sellerName: 'CurioMaster',
        status: 'active',
        highestOffer: null,
        highestOfferBuyer: null,
        createdAt: new Date().toISOString()
      },
      {
        id: '11',
        name: 'Traditional Luo Nyatiti Instrument',
        description: 'Eight-stringed bowl lyre with beautiful authentic patina.',
        price: 28000,
        image: '/images/nyatiti.jpg',
        sellerId: 'user2',
        sellerName: 'NairobiAntiques',
        status: 'active',
        highestOffer: null,
        highestOfferBuyer: null,
        createdAt: new Date().toISOString()
      },
      {
        id: '12',
        name: 'Mombasa Coastal Brass Coffee Pot',
        description: 'Antique dallah pot from the coastal spice trade era.',
        price: 14000,
        image: '/images/brass_pot.jpg',
        sellerId: 'user3',
        sellerName: 'HeritageFinds',
        status: 'active',
        highestOffer: null,
        highestOfferBuyer: null,
        createdAt: new Date().toISOString()
      },
      {
        id: '13',
        name: 'Set of Antique Trade Beads',
        description: 'Venetian glass beads traded along the East African coast centuries ago.',
        price: 9500,
        image: '/images/trade_beads.jpg',
        sellerId: 'user1',
        sellerName: 'CurioMaster',
        status: 'active',
        highestOffer: null,
        highestOfferBuyer: null,
        createdAt: new Date().toISOString()
      },
      {
        id: '14',
        name: 'Traditional Turkana Headrest',
        description: 'Carved wooden ekicholong, perfectly balanced and polished by time.',
        price: 18000,
        image: '/images/turkana_headrest.jpg',
        sellerId: 'user2',
        sellerName: 'NairobiAntiques',
        status: 'active',
        highestOffer: null,
        highestOfferBuyer: null,
        createdAt: new Date().toISOString()
      },
      {
        id: '15',
        name: 'Vintage African Maps Folio',
        description: 'Hand-drawn cartography from the early 1900s, showing early borders.',
        price: 32000,
        image: '/images/african_maps.jpg',
        sellerId: 'user3',
        sellerName: 'HeritageFinds',
        status: 'active',
        highestOffer: null,
        highestOfferBuyer: null,
        createdAt: new Date().toISOString()
      }
    ];
    writeFileSync(itemsPath, JSON.stringify(sampleItems, null, 2));
  }

  // Users data
  const usersPath = join(dataDir, 'users.json');
  if (!existsSync(usersPath)) {
    const sampleUsers = [
      { id: 'user1', name: 'CurioMaster', createdAt: new Date().toISOString() },
      { id: 'user2', name: 'NairobiAntiques', createdAt: new Date().toISOString() },
      { id: 'user3', name: 'HeritageFinds', createdAt: new Date().toISOString() }
    ];
    writeFileSync(usersPath, JSON.stringify(sampleUsers, null, 2));
  }

  // Messages data
  const messagesPath = join(dataDir, 'messages.json');
  if (!existsSync(messagesPath)) {
    const sampleMessages = [
      {
        id: 'msg1',
        itemId: '1',
        senderId: 'user2',
        senderName: 'NairobiAntiques',
        content: 'Is this Maasai shield still available?',
        type: 'text',
        timestamp: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'msg2',
        itemId: '1',
        senderId: 'user1',
        senderName: 'CurioMaster',
        content: 'Yes, it is! Interested?',
        type: 'text',
        timestamp: new Date(Date.now() - 86000000).toISOString()
      },
      {
        id: 'msg3',
        itemId: '1',
        senderId: 'user2',
        senderName: 'NairobiAntiques',
        content: '14000',
        type: 'offer',
        price: 14000,
        originalPrice: 15000,
        status: 'pending',
        timestamp: new Date(Date.now() - 85000000).toISOString()
      }
    ];
    writeFileSync(messagesPath, JSON.stringify(sampleMessages, null, 2));
  }
};

initDataFiles();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

// Static files
app.use(express.static(join(__dirname, 'public')));

// Routes
app.use('/api/items', itemsRouter);
app.use('/api/users', usersRouter);
app.use('/api/messages', messagesRouter);

// Main Marketplace Route
app.get(['/', '/messages', '/activity'], (req, res) => {
  const path = req.path;
  let title = 'Social Marketplace';
  let components = [{ name: 'market-header', props: '' }];

  if (path === '/messages') {
    title = 'Your Messages | Post.';
    components.push({ name: 'market-inbox', props: '' });
  } else if (path === '/activity') {
    title = 'Activity | Post.';
    components.push({ name: 'market-activity', props: '' });
  } else {
    // Default home view
    components.push({ name: 'market-search', props: '' });
    components.push({ name: 'market-list', props: '' });
  }

  res.render('index', { title, components });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running`);
  console.log(`Data directory: ${dataDir}`);
  console.log(`Health check`);
});