// ============================================
// DATA.JS — All product data in one place
// ============================================

const PRODUCTS = [
  {
    id: 1, name: 'The Arcadia Tote', category: 'bags',
    price: 248, oldPrice: 310, rating: 4.8, reviews: 124,
    emoji: '👜', tag: 'new', badge: 'New In',
    stock: 12, description: 'Handcrafted from full-grain leather with a spacious interior. Features a magnetic closure, interior zip pocket, and adjustable shoulder strap. Perfect for work or weekend.',
    sizes: ['XS', 'S', 'M', 'L'],
    material: 'Full-grain leather', origin: 'Italy',
    features: ['Magnetic closure', 'Interior zip pocket', 'Adjustable strap', 'Dust bag included']
  },
  {
    id: 2, name: 'Woven Straw Hat', category: 'accessories',
    price: 85, oldPrice: null, rating: 4.6, reviews: 88,
    emoji: '👒', tag: 'hot', badge: 'Hot',
    stock: 5, description: 'Hand-woven natural straw hat with a wide brim and grosgrain ribbon. UV protection rating of 50+. A timeless summer essential.',
    sizes: ['S/M', 'L/XL'],
    material: 'Natural straw, grosgrain ribbon', origin: 'Portugal',
    features: ['UV 50+ protection', 'Adjustable inner band', 'Packable design', 'Water resistant']
  },
  {
    id: 3, name: 'Suede Chelsea Boot', category: 'footwear',
    price: 195, oldPrice: 240, rating: 4.9, reviews: 203,
    emoji: '👢', tag: 'sale', badge: 'Sale',
    stock: 3, description: 'Classic Chelsea boot crafted from premium suede with elastic side panels. Features a low block heel and rubber sole for all-day comfort.',
    sizes: ['36', '37', '38', '39', '40', '41'],
    material: 'Premium suede, rubber sole', origin: 'Spain',
    features: ['Elastic side panels', 'Low block heel', 'Leather insole', 'Rubber outsole']
  },
  {
    id: 4, name: 'Linen Wrap Dress', category: 'apparel',
    price: 140, oldPrice: null, rating: 4.7, reviews: 67,
    emoji: '👗', tag: 'new', badge: 'New In',
    stock: 20, description: 'Effortlessly elegant wrap dress in 100% Belgian linen. Self-tie waist with adjustable fit. Slightly oversized for a relaxed, modern silhouette.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    material: '100% Belgian linen', origin: 'Belgium',
    features: ['Self-tie waist', 'V-neckline', 'Midi length', 'Machine washable']
  },
  {
    id: 5, name: 'Ceramic Bud Vase', category: 'home',
    price: 55, oldPrice: null, rating: 4.5, reviews: 41,
    emoji: '🏺', tag: null, badge: null,
    stock: 30, description: 'Hand-thrown ceramic bud vase with a matte white glaze. Each piece is unique with slight variations. Perfect for a single stem or small floral arrangement.',
    sizes: ['Small', 'Medium', 'Large'],
    material: 'Stoneware ceramic', origin: 'Denmark',
    features: ['Hand-thrown', 'Matte glaze', 'Waterproof interior', 'Dishwasher safe']
  },
  {
    id: 6, name: 'Leather Card Holder', category: 'accessories',
    price: 68, oldPrice: null, rating: 4.8, reviews: 150,
    emoji: '💳', tag: 'hot', badge: 'Hot',
    stock: 50, description: 'Slim card holder in vegetable-tanned leather. Holds up to 8 cards with a center pocket for cash. Ages beautifully with use.',
    sizes: ['One Size'],
    material: 'Vegetable-tanned leather', origin: 'France',
    features: ['8 card slots', 'Center cash pocket', 'RFID blocking', 'Gift box included']
  },
  {
    id: 7, name: 'Canvas Sneakers', category: 'footwear',
    price: 115, oldPrice: 145, rating: 4.6, reviews: 99,
    emoji: '👟', tag: 'sale', badge: 'Sale',
    stock: 0, description: 'Minimalist canvas sneakers with a vulcanized rubber sole. Clean, unbranded design pairs with everything. Unisex sizing.',
    sizes: ['36', '37', '38', '39', '40', '41', '42', '43'],
    material: 'Organic canvas, rubber sole', origin: 'Portugal',
    features: ['Unisex design', 'Organic canvas', 'Vulcanized sole', 'Removable insole']
  },
  {
    id: 8, name: 'Silk Scarf', category: 'accessories',
    price: 98, oldPrice: null, rating: 4.9, reviews: 178,
    emoji: '🧣', tag: 'new', badge: 'New In',
    stock: 15, description: 'Luxuriously soft 100% pure silk scarf with hand-rolled edges. Features an exclusive botanical print inspired by pressed flowers. Wear as a headband, neck scarf, or bag accessory.',
    sizes: ['70×70cm', '90×90cm'],
    material: '100% pure silk', origin: 'Italy',
    features: ['Hand-rolled edges', 'Exclusive print', 'Gift box included', 'Dry clean only']
  },
  {
    id: 9, name: 'Rattan Crossbody', category: 'bags',
    price: 120, oldPrice: null, rating: 4.7, reviews: 55,
    emoji: '🧺', tag: 'new', badge: 'New In',
    stock: 8, description: 'Handwoven rattan crossbody bag with leather strap. A sustainable summer statement piece.',
    sizes: ['One Size'],
    material: 'Rattan, leather strap', origin: 'Bali',
    features: ['Handwoven', 'Adjustable strap', 'Magnetic closure', 'Linen lining']
  },
  {
    id: 10, name: 'Cashmere Beanie', category: 'apparel',
    price: 88, oldPrice: 110, rating: 4.8, reviews: 92,
    emoji: '🧢', tag: 'sale', badge: 'Sale',
    stock: 18, description: 'Ultra-soft 100% cashmere beanie in a relaxed fit. One size fits most.',
    sizes: ['One Size'],
    material: '100% Grade-A cashmere', origin: 'Scotland',
    features: ['100% cashmere', 'One size', 'Ribbed cuff', 'Hand wash']
  },
  {
    id: 11, name: 'Marble Soap Dish', category: 'home',
    price: 38, oldPrice: null, rating: 4.4, reviews: 29,
    emoji: '🪨', tag: null, badge: null,
    stock: 25, description: 'Carved from solid white marble with natural grey veining. Each piece is unique.',
    sizes: ['Standard'],
    material: 'Solid marble', origin: 'Greece',
    features: ['Natural marble', 'Non-slip base', 'Unique veining', 'Easy to clean']
  },
  {
    id: 12, name: 'Gold Hoop Earrings', category: 'accessories',
    price: 75, oldPrice: null, rating: 4.9, reviews: 210,
    emoji: '💛', tag: 'hot', badge: 'Hot',
    stock: 40, description: 'Classic medium hoops in 18k gold-plated sterling silver. Hypoallergenic and tarnish-resistant.',
    sizes: ['20mm', '30mm', '40mm'],
    material: '18k gold-plated sterling silver', origin: 'Italy',
    features: ['Hypoallergenic', 'Tarnish-resistant', 'Lightweight', 'Gift pouch included']
  }
];

// Coupon codes
const COUPONS = {
  'LUXE10': { type: 'percent', value: 10, label: '10% off' },
  'WELCOME20': { type: 'percent', value: 20, label: '20% off' },
  'FLAT15': { type: 'flat', value: 15, label: '$15 off' },
  'FREESHIP': { type: 'shipping', value: 0, label: 'Free shipping' }
};

const FREE_SHIPPING_THRESHOLD = 75;