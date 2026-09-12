// Master Dataset for AUDIO DEN - Mobile & Home Appliances
// Authorized Dealer for Apple, Samsung, OnePlus, Vivo, Oppo, Sony, LG, Whirlpool

export const CATALOG_VERSION = '5.3.0';

export const INITIAL_CATEGORIES = [
  { id: 'cat-1', name: 'Smartphones', slug: 'smartphones', icon: 'Smartphone', count: 34, image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-2', name: 'Smart TV', slug: 'smart-tv', icon: 'Tv', count: 14, image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-3', name: 'Refrigerator', slug: 'refrigerator', icon: 'Refrigerator', count: 11, image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-4', name: 'Air Conditioner', slug: 'air-conditioner', icon: 'Wind', count: 8, image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-5', name: 'Washing Machine', slug: 'washing-machine', icon: 'WashingMachine', count: 9, image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-6', name: 'Speakers', slug: 'speakers', icon: 'Speaker', count: 16, image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-7', name: 'Kitchen Appliances', slug: 'kitchen-appliances', icon: 'Coffee', count: 12, image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80' }
];

export const INITIAL_BRANDS = [
  { id: 'b-1', name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
  { id: 'b-2', name: 'Samsung', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg' },
  { id: 'b-3', name: 'OnePlus', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/OP_LU_Reg_1_Line_POS_RGB.svg' },
  { id: 'b-4', name: 'Vivo', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Vivo_mobile_logo.png' },
  { id: 'b-5', name: 'Oppo', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/OPPO_Logo.svg' },
  { id: 'b-6', name: 'Sony', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg' },
  { id: 'b-7', name: 'LG', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/LG_logo_%282015%29.svg' },
  { id: 'b-8', name: 'Whirlpool', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Whirlpool_Corporation_Logo.svg' },
  { id: 'b-9', name: 'Bose', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Bose_logo.svg' }
];

export const INITIAL_PRODUCTS = [
  // ================= 1. APPLE FLAGSHIPS =================
  {
    id: 'prod-apple-1',
    name: 'Apple iPhone 16 Pro Max (Desert Titanium, 256GB)',
    sku: 'APL-IP16PM-256-DT',
    brand: 'Apple',
    category: 'Smartphones',
    price: 144900,
    salePrice: 139900,
    stock: 14,
    rating: 4.9,
    reviewCount: 142,
    isFeatured: true,
    isNewArrival: true,
    isFlashSale: true,
    isBestSeller: true,
    hasOffer: true,
    offerTitle: 'Festive Mega Deal: Flat ₹5,000 Off + Free Apple 20W Fast Adapter',
    offerBadgeText: 'HOT DEAL',
    offerBadgeColor: 'gold',
    offerDiscountPercent: 8,
    offerValidUntil: 'Valid till 30 Sep 2026',
    offerFreebie: 'Free Apple 20W USB-C Adapter + Tempered Glass',
    description: 'iPhone 16 Pro Max with Grade 5 Titanium design, larger 6.9-inch Super Retina XDR display, Camera Control button, 48MP Fusion camera and the revolutionary A18 Pro chip.',
    features: [
      '6.9" Super Retina XDR OLED ProMotion 120Hz display',
      'Apple A18 Pro chip (3nm) with 6-core GPU',
      'Dedicated tactile Camera Control button',
      '48MP Fusion + 48MP Ultra Wide + 12MP 5x Telephoto',
      'Up to 33 hours video playback, MagSafe fast charging'
    ],
    specifications: {
      'Display': '6.9" Super Retina XDR OLED, 120Hz ProMotion, 2000 nits',
      'Processor': 'Apple A18 Pro Bionic (6-Core CPU, 6-Core GPU)',
      'Storage': '256GB NVMe',
      'Camera': '48MP (Main) + 48MP (Ultra-wide) + 12MP (5x Periscope)',
      'Battery': '4685 mAh with Qi2 & 25W MagSafe support',
      'Warranty': '1 Year Apple Official India Warranty'
    },
    images: [
      '/products/apple-iphone16-pro-max.png'
    ]
  },
  {
    id: 'prod-apple-2',
    name: 'Apple iPhone 16 (Ultramarine, 128GB)',
    sku: 'APL-IP16-128-UM',
    brand: 'Apple',
    category: 'Smartphones',
    price: 79900,
    salePrice: 74900,
    stock: 22,
    rating: 4.8,
    reviewCount: 96,
    isFeatured: true,
    isNewArrival: true,
    isFlashSale: false,
    isBestSeller: true,
    description: 'Meet iPhone 16. With the all-new Camera Control, 48MP Fusion camera with 2x Telephoto, Action button, and super-fast A18 chip designed for Apple Intelligence.',
    features: [
      '6.1" Super Retina XDR OLED Display with Dynamic Island',
      'Next-generation Apple A18 Bionic processor',
      '48MP 2-in-1 camera with spatial photo & video capture',
      'Customizable Action Button and Camera Control',
      'All-day battery life with USB-C fast charging'
    ],
    specifications: {
      'Display': '6.1" Super Retina XDR OLED, Ceramic Shield front',
      'Processor': 'Apple A18 chip with 16-core Neural Engine',
      'Storage': '128GB',
      'Camera': '48MP Fusion + 12MP Ultra Wide with Macro',
      'Battery': 'Up to 22 hours video playback',
      'Warranty': '1 Year Apple Official Manufacturer Warranty'
    },
    images: [
      '/products/apple-iphone16-black.png'
    ]
  },
  {
    id: 'prod-apple-3',
    name: 'Apple iPhone 15 (Black, 128GB)',
    sku: 'APL-IP15-128-BLK',
    brand: 'Apple',
    category: 'Smartphones',
    price: 69900,
    salePrice: 58999,
    stock: 18,
    rating: 4.7,
    reviewCount: 180,
    isFeatured: false,
    isNewArrival: false,
    isFlashSale: true,
    isBestSeller: true,
    description: 'iPhone 15 brings you Dynamic Island, 48MP Main camera, and USB-C in a durable color-infused glass and aluminum design.',
    features: [
      'Dynamic Island bubbles up alerts and Live Activities',
      '48MP Main camera for super-high-resolution photos',
      'A16 Bionic chip powers all kinds of advanced features',
      'Universal USB-C charging connector'
    ],
    specifications: {
      'Display': '6.1" Super Retina XDR display',
      'Processor': 'A16 Bionic chip',
      'Storage': '128GB',
      'Camera': '48MP Main + 12MP Ultra Wide',
      'Warranty': '1 Year Apple Official Warranty'
    },
    images: [
      '/products/apple-iphone16-black.png'
    ]
  },
  {
    id: 'prod-apple-4',
    name: 'Apple iPhone 16 Plus (Pink, 128GB)',
    sku: 'APL-IP16P-128-PNK',
    brand: 'Apple',
    category: 'Smartphones',
    price: 89900,
    salePrice: 84900,
    stock: 15,
    rating: 4.8,
    reviewCount: 62,
    isFeatured: true,
    isNewArrival: true,
    isFlashSale: false,
    isBestSeller: true,
    description: 'iPhone 16 Plus features a large 6.7-inch Super Retina XDR display, brand-new Camera Control, Apple A18 processor, and industry-leading battery stamina.',
    features: [
      '6.7" Super Retina XDR OLED display with Ceramic Shield',
      'Apple A18 chip designed for Apple Intelligence',
      'Camera Control with capacitive touch and haptic feedback',
      '48MP Fusion 2-in-1 camera with 2x optical-quality Telephoto',
      'Up to 27 hours video playback, MagSafe wireless charging'
    ],
    specifications: {
      'Display': '6.7" Super Retina XDR OLED, 2000 nits peak brightness',
      'Processor': 'Apple A18 Bionic (6-core CPU, 5-core GPU)',
      'Storage': '128GB NVMe',
      'Camera': '48MP Fusion (f/1.6) + 12MP Ultra Wide with Macro',
      'Battery': 'Up to 27 hours video playback',
      'Warranty': '1 Year Official Apple India Warranty'
    },
    images: [
      '/products/apple-iphone17-spacegray.png'
    ]
  },
  {
    id: 'prod-apple-5',
    name: 'Apple iPhone 15 Pro (Natural Titanium, 128GB)',
    sku: 'APL-IP15P-128-NAT',
    brand: 'Apple',
    category: 'Smartphones',
    price: 134900,
    salePrice: 119900,
    stock: 10,
    rating: 4.9,
    reviewCount: 140,
    isFeatured: true,
    isNewArrival: false,
    isFlashSale: true,
    isBestSeller: true,
    description: 'Forged in titanium, featuring the groundbreaking A17 Pro chip, customizable Action button, and a versatile 48MP Pro camera system with 3x optical zoom.',
    features: [
      'Aerospace-grade titanium frame with textured matte glass back',
      'A17 Pro chip with console-level gaming GPU and hardware ray tracing',
      'Action button for direct access to silent mode, camera, or shortcuts',
      '48MP Pro camera with multiple focal lengths (24mm, 28mm, 35mm)'
    ],
    specifications: {
      'Display': '6.1" Super Retina XDR OLED, 120Hz ProMotion',
      'Processor': 'Apple A17 Pro (3nm)',
      'Storage': '128GB',
      'Camera': '48MP Main + 12MP Ultra Wide + 12MP 3x Telephoto',
      'Warranty': '1 Year Apple Official Warranty'
    },
    images: [
      '/products/apple-iphone16-pro-max.png'
    ]
  },
  {
    id: 'prod-apple-17',
    name: 'Apple iPhone 17 512 GB (Space Gray, 15.93 cm Display)',
    sku: 'APL-IP17-512-SGY',
    brand: 'Apple',
    category: 'Smartphones',
    price: 112900,
    salePrice: 102900,
    stock: 15,
    rating: 4.6,
    reviewCount: 633,
    isFeatured: true,
    isNewArrival: true,
    isFlashSale: true,
    isBestSeller: true,
    hasOffer: true,
    offerTitle: 'iPhone 17 Launch Offer: Flat ₹10,000 Off + Free Wireless MagSafe Powerbank',
    offerBadgeText: 'NEW LAUNCH OFFER',
    offerBadgeColor: 'gold',
    offerDiscountPercent: 9,
    offerValidUntil: 'Audio Den Showroom Launch Special',
    offerFreebie: 'Free MagSafe 10,000mAh Powerbank Included',
    couponText: '₹10,000 Off Launch Offer',
    description: 'Apple iPhone 17 512 GB: 15.93 cm (6.3") Super Retina XDR Display with ProMotion 120Hz, A19 Bionic chip, Center Stage Front Camera for Smarter Group Selfies, and Improved Scratch Resistance.',
    features: [
      '15.93 cm (6.3") Super Retina XDR Display with 120Hz ProMotion & Always-On',
      'Next-generation Apple A19 Bionic 3nm chip designed for Apple Intelligence',
      'Center Stage Camera for Smarter Group Selfies with intelligent auto-framing',
      'Advanced Ceramic Shield with improved scratch & shatter resistance',
      'Spatial Video capture & Wi-Fi 7 with ultra-wideband Gen 2 chip'
    ],
    specifications: {
      'Display': '15.93 cm (6.3") Super Retina XDR OLED, 120Hz ProMotion, 2500 nits',
      'Processor': 'Apple A19 Bionic (6-Core CPU, 6-Core GPU, 16-Core Neural Engine)',
      'Storage': '512GB NVMe Flash Storage',
      'Camera': '48MP Fusion (f/1.6 OIS) + 48MP Ultra Wide with Center Stage Smarter Selfies',
      'Battery': 'Up to 28 hours video playback, 25W MagSafe fast charging',
      'Durability': 'Ceramic Shield front, Aerospace-grade aluminum with improved scratch resistance',
      'Audio & Video': 'Spatial Audio, Works with AirPods Pro, Action & Camera Control buttons',
      'Warranty': '1 Year Apple Official India Manufacturer Warranty'
    },
    images: [
      '/products/apple-iphone17-spacegray.png'
    ]
  },
  {
    id: 'prod-apple-16-blk',
    name: 'Apple iPhone 16 128 GB (Black, 5G Mobile Phone with Camera Control)',
    sku: 'APL-IP16-128-BLK',
    brand: 'Apple',
    category: 'Smartphones',
    price: 79900,
    salePrice: 67490,
    stock: 25,
    rating: 4.5,
    reviewCount: 2600,
    isFeatured: true,
    isNewArrival: false,
    isFlashSale: true,
    isBestSeller: true,
    couponText: '16% Off Amazon Match Price',
    description: 'iPhone 16 128 GB: 5G Mobile Phone with Camera Control, A18 Battery Life. Works with AirPods; Black. Built for Apple Intelligence with 48MP 2-in-1 Fusion camera.',
    features: [
      'Camera Control gives you an easier way to quickly access camera tools',
      'Super-fast A18 chip designed for Apple Intelligence',
      '48MP Fusion camera with 2x optical-quality Telephoto',
      'Up to 22 hours video playback with USB-C convenience',
      'Works with AirPods: seamless instant pairing and personalized spatial audio'
    ],
    specifications: {
      'Display': '6.1" Super Retina XDR OLED, 2000 nits peak, Dynamic Island',
      'Processor': 'Apple A18 chip (6-Core CPU, 5-Core GPU, 16-Core NPU)',
      'Storage': '128GB NVMe',
      'Camera': '48MP Fusion (f/1.6, Sensor-shift OIS) + 12MP Ultra Wide with Macro',
      'Battery': 'Up to 22 hours video playback, 50% charge in 30 mins with 20W adapter',
      'Connectivity': '5G, Wi-Fi 7, Bluetooth 5.3, Works with AirPods',
      'Warranty': '1 Year Apple Official India Manufacturer Warranty'
    },
    images: [
      '/products/apple-iphone16-black.png'
    ]
  },

  // ================= 2. SAMSUNG FLAGSHIPS =================
  {
    id: 'prod-sam-1',
    name: 'Samsung Galaxy S25 Ultra 5G (Titanium Silver, 12GB+512GB)',
    sku: 'SAM-S25U-512-SLV',
    brand: 'Samsung',
    category: 'Smartphones',
    price: 144999,
    salePrice: 134999,
    stock: 16,
    rating: 4.9,
    reviewCount: 78,
    isFeatured: true,
    isNewArrival: true,
    isFlashSale: true,
    isBestSeller: true,
    hasOffer: true,
    offerTitle: 'Galaxy AI Festival: Flat ₹10,000 Off + Free 45W Original Fast Charger',
    offerBadgeText: 'FESTIVE SALE',
    offerBadgeColor: 'cyan',
    offerDiscountPercent: 12,
    offerValidUntil: 'Showroom Stock Promo',
    offerFreebie: 'Free Samsung 45W Ultra Fast Charger + S-Pen Tips',
    description: 'Next-gen Galaxy AI powerhouse. Equipped with Qualcomm Snapdragon 8 Elite for Galaxy, refined flat titanium frame, built-in S Pen, and 200MP Quad Telephoto AI zoom camera.',
    features: [
      'Snapdragon 8 Elite for Galaxy (3nm flagship processor)',
      '6.86" Dynamic AMOLED 2X, 120Hz, anti-reflective Corning Gorilla Armor',
      'Integrated S Pen with ultra-low latency gesture control',
      '200MP OIS + 50MP 5x Periscope + 50MP Ultrawide',
      '5000 mAh battery with 45W wired and 15W wireless fast charge'
    ],
    specifications: {
      'Display': '6.86" QHD+ Dynamic AMOLED 2X, 120Hz, 3000 nits peak',
      'Processor': 'Qualcomm Snapdragon 8 Elite for Galaxy',
      'RAM / Storage': '12GB LPDDR5X + 512GB UFS 4.0',
      'Camera': '200MP + 50MP (5x optical) + 50MP (Ultrawide) + 10MP (3x)',
      'Battery': '5000 mAh with 45W charging support',
      'Warranty': '1 Year Samsung India Manufacturer Warranty'
    },
    images: [
      '/products/samsung-s25-ultra.png'
    ]
  },
  {
    id: 'prod-sam-2',
    name: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 12GB+256GB)',
    sku: 'SAM-S24U-256-GRY',
    brand: 'Samsung',
    category: 'Smartphones',
    price: 129999,
    salePrice: 118999,
    stock: 20,
    rating: 4.8,
    reviewCount: 110,
    isFeatured: true,
    isNewArrival: false,
    isFlashSale: true,
    isBestSeller: true,
    description: 'Welcome to the era of mobile Galaxy AI. Circle to Search, Live Translate, Note Assist, titanium frame, and 200MP optical zoom.',
    features: [
      'Galaxy AI suite built directly into One UI',
      'Armor Titanium frame with flat display design',
      '200MP main camera sensor with AI ProVisual Engine',
      'Snapdragon 8 Gen 3 for Galaxy chipset'
    ],
    specifications: {
      'Display': '6.8" QHD+ Dynamic AMOLED 2X, 120Hz',
      'Processor': 'Snapdragon 8 Gen 3 for Galaxy',
      'RAM / Storage': '12GB + 256GB',
      'Camera': '200MP + 50MP (5x) + 12MP + 10MP',
      'Warranty': '1 Year Official Samsung Warranty'
    },
    images: [
      '/products/samsung-s25-ultra.png'
    ]
  },
  {
    id: 'prod-sam-3',
    name: 'Samsung Galaxy Z Flip 6 5G (Mint, 8GB+256GB)',
    sku: 'SAM-ZFLIP6-256-MNT',
    brand: 'Samsung',
    category: 'Smartphones',
    price: 109999,
    salePrice: 94999,
    stock: 12,
    rating: 4.7,
    reviewCount: 65,
    isFeatured: true,
    isNewArrival: true,
    isFlashSale: false,
    isBestSeller: false,
    description: 'Compact, eye-catching, and powered by Galaxy AI. Features FlexWindow, 50MP high-res camera, and upgraded 4000 mAh battery with vapor chamber cooling.',
    features: [
      'Compact foldable clamshell design with FlexHinge',
      '3.4" Super AMOLED FlexWindow cover screen',
      'Upgraded 50MP Wide camera with AI ProVisual Engine',
      'First-ever vapor chamber cooling on Galaxy Z Flip'
    ],
    specifications: {
      'Display': '6.7" FHD+ Dynamic AMOLED 2X (Foldable) + 3.4" Cover',
      'Processor': 'Qualcomm Snapdragon 8 Gen 3 for Galaxy',
      'RAM / Storage': '8GB RAM + 256GB',
      'Camera': '50MP (OIS) + 12MP Ultra-wide',
      'Warranty': '1 Year Official Warranty'
    },
    images: [
      '/products/samsung-z-flip6.png'
    ]
  },
  {
    id: 'prod-sam-4',
    name: 'Samsung Galaxy Z Fold 6 5G (Silver Shadow, 12GB+256GB)',
    sku: 'SAM-ZFOLD6-256-SLV',
    brand: 'Samsung',
    category: 'Smartphones',
    price: 164999,
    salePrice: 154999,
    stock: 8,
    rating: 4.9,
    reviewCount: 45,
    isFeatured: true,
    isNewArrival: true,
    isFlashSale: true,
    isBestSeller: false,
    description: 'The pinnacle of mobile productivity. Slimmer, lighter, and sturdier with dual displays, Galaxy AI superpowers, and Snapdragon 8 Gen 3 for Galaxy.',
    features: [
      '7.6" Main Dynamic AMOLED 2X 120Hz + 6.3" Cover Screen',
      'Galaxy AI Circle to Search, Note Assist, & Live Interpreter',
      'Armor Aluminum frame and Corning Gorilla Glass Victus 2',
      'Triple camera system with 50MP OIS and 3x optical zoom'
    ],
    specifications: {
      'Display': '7.6" QXGA+ Dynamic AMOLED 2X Foldable + 6.3" Cover',
      'Processor': 'Qualcomm Snapdragon 8 Gen 3 for Galaxy',
      'RAM / Storage': '12GB + 256GB',
      'Camera': '50MP (OIS) + 12MP (Ultrawide) + 10MP (3x Telephoto)',
      'Battery': '4400 mAh with 25W fast wired & 15W wireless charging',
      'Warranty': '1 Year Official Samsung India Warranty'
    },
    images: [
      '/products/samsung-z-fold6.png'
    ]
  },
  {
    id: 'prod-sam-5',
    name: 'Samsung Galaxy A55 5G (Awesome Iceblue, 8GB+128GB)',
    sku: 'SAM-A55-128-BLU',
    brand: 'Samsung',
    category: 'Smartphones',
    price: 39999,
    salePrice: 34999,
    stock: 30,
    rating: 4.7,
    reviewCount: 112,
    isFeatured: false,
    isNewArrival: false,
    isFlashSale: true,
    isBestSeller: true,
    description: 'Premium metal frame, Gorilla Glass Victus+, 50MP Big Pixel camera with OIS, Samsung Knox Vault, and 4 generations of OS upgrades.',
    features: [
      'Brushed metal frame with flat edge design',
      '6.6" FHD+ Super AMOLED 120Hz Vision Booster display',
      '50MP OIS camera with nightography improvements',
      '5000 mAh battery with up to 2-day battery life'
    ],
    specifications: {
      'Display': '6.6" FHD+ Super AMOLED, 120Hz, 1000 nits',
      'Processor': 'Samsung Exynos 1480 (4nm) with AMD Xclipse GPU',
      'RAM / Storage': '8GB + 128GB (expandable up to 1TB)',
      'Camera': '50MP (OIS) + 12MP + 5MP Macro',
      'Warranty': '1 Year Samsung India Warranty'
    },
    images: [
      '/products/samsung-a55.png'
    ]
  },

  // ================= 3. ONEPLUS FLAGSHIPS =================
  {
    id: 'prod-op-1',
    name: 'OnePlus 13 5G (Midnight Black, 16GB+512GB)',
    sku: '1P-13-512-BLK',
    brand: 'OnePlus',
    category: 'Smartphones',
    price: 75999,
    salePrice: 69999,
    stock: 25,
    rating: 4.9,
    reviewCount: 92,
    isFeatured: true,
    isNewArrival: true,
    isFlashSale: true,
    isBestSeller: true,
    description: 'Never Settle. OnePlus 13 combines the blazing Snapdragon 8 Elite chipset, revolutionary 6000 mAh Glacier battery, Hasselblad Master Camera System, and IP68/IP69 water resistance.',
    features: [
      'Snapdragon 8 Elite (3nm) with Next-Gen Trinity Engine',
      '6.82" 2K 120Hz Oriental Screen with Glove Mode & Rain Water Touch',
      'Hasselblad 50MP Sony LYT-808 + 50MP Periscope 3x + 50MP Ultrawide',
      'Massive 6000 mAh Silicon-Carbon Glacier Battery with 100W SuperVOOC',
      'Dual IP68 + IP69 dust and high-pressure water resistance'
    ],
    specifications: {
      'Display': '6.82" 2K QHD+ 120Hz LTPO AMOLED, 4500 nits peak',
      'Processor': 'Qualcomm Snapdragon 8 Elite (4.32 GHz)',
      'RAM / Storage': '16GB LPDDR5X + 512GB UFS 4.0',
      'Camera': '50MP (OIS) + 50MP (3x Periscope) + 50MP (120° Ultrawide)',
      'Battery': '6000 mAh with 100W Wired + 50W Wireless SuperVOOC',
      'Warranty': '1 Year OnePlus India Official Warranty'
    },
    images: [
      '/products/oneplus-nord6-black.png'
    ]
  },
  {
    id: 'prod-op-2',
    name: 'OnePlus 12 5G (Flowy Emerald, 16GB+512GB)',
    sku: '1P-12-512-EMR',
    brand: 'OnePlus',
    category: 'Smartphones',
    price: 69999,
    salePrice: 62999,
    stock: 20,
    rating: 4.8,
    reviewCount: 115,
    isFeatured: true,
    isNewArrival: false,
    isFlashSale: true,
    isBestSeller: true,
    description: '4th Gen Hasselblad Camera, 2K 120Hz ProXDR display, Snapdragon 8 Gen 3, and 100W SUPERVOOC fast charging.',
    features: [
      'Snapdragon 8 Gen 3 with Cryo-Velocity Dual VC cooling',
      '64MP Periscope Telephoto Camera with 3x optical, 120x digital zoom',
      '5400 mAh battery with 100W charger included in box'
    ],
    specifications: {
      'Display': '6.82" 2K 120Hz ProXDR display',
      'Processor': 'Snapdragon 8 Gen 3',
      'RAM / Storage': '16GB + 512GB',
      'Camera': '50MP LYT-808 + 64MP Periscope + 48MP Ultrawide',
      'Warranty': '1 Year Manufacturer Warranty'
    },
    images: [
      '/products/oneplus-15-sandstorm.png'
    ]
  },
  {
    id: 'prod-op-3',
    name: 'OnePlus Nord 4 5G (Mercurial Silver, 8GB+256GB)',
    sku: '1P-NRD4-256-SLV',
    brand: 'OnePlus',
    category: 'Smartphones',
    price: 32999,
    salePrice: 28999,
    stock: 28,
    rating: 4.7,
    reviewCount: 88,
    isFeatured: false,
    isNewArrival: true,
    isFlashSale: false,
    isBestSeller: true,
    description: 'The only all-metal unibody smartphone in the 5G era. Powered by Snapdragon 7+ Gen 3 with 5500 mAh battery and 100W SUPERVOOC.',
    features: [
      'Sleek all-metal unibody craftsmanship',
      'Snapdragon 7+ Gen 3 flagship-grade chipset',
      '5500 mAh battery with 100W SUPERVOOC charging',
      'Sony 50MP LYT-600 OIS camera'
    ],
    specifications: {
      'Display': '6.74" 120Hz AMOLED, 2150 nits',
      'Processor': 'Qualcomm Snapdragon 7+ Gen 3',
      'RAM / Storage': '8GB + 256GB UFS 4.0',
      'Battery': '5500 mAh with 100W fast charge',
      'Warranty': '1 Year OnePlus Warranty'
    },
    images: [
      '/products/oneplus-lavender.png'
    ]
  },
  {
    id: 'prod-op-4',
    name: 'OnePlus 12R 5G (Cool Blue, 8GB+128GB)',
    sku: '1P-12R-128-BLU',
    brand: 'OnePlus',
    category: 'Smartphones',
    price: 39999,
    salePrice: 35999,
    stock: 24,
    rating: 4.8,
    reviewCount: 130,
    isFeatured: true,
    isNewArrival: false,
    isFlashSale: true,
    isBestSeller: true,
    description: 'Smooth Beyond Belief. Powered by Snapdragon 8 Gen 2, 4th Gen LTPO 120Hz ProXDR display, and 5500 mAh battery with 100W SUPERVOOC.',
    features: [
      'Snapdragon 8 Gen 2 flagship chipset',
      '6.78" 1.5K 4th Gen LTPO 120Hz display with 4500 nits peak brightness',
      'Largest 5500 mAh battery ever in a OnePlus phone',
      'Sony 50MP IMX890 camera with OIS'
    ],
    specifications: {
      'Display': '6.78" 1.5K LTPO4 AMOLED, 120Hz, Dolby Vision',
      'Processor': 'Qualcomm Snapdragon 8 Gen 2',
      'RAM / Storage': '8GB LPDDR5X + 128GB UFS 3.1',
      'Camera': '50MP (OIS) + 8MP (Ultra) + 2MP (Macro)',
      'Battery': '5500 mAh with 100W SuperVOOC included',
      'Warranty': '1 Year OnePlus Official Warranty'
    },
    images: [
      '/products/oneplus-n6x-burgundy.png'
    ]
  },
  {
    id: 'prod-op-5',
    name: 'OnePlus Nord CE4 5G (Celadon Marble, 8GB+128GB)',
    sku: '1P-NCE4-128-MRB',
    brand: 'OnePlus',
    category: 'Smartphones',
    price: 24999,
    salePrice: 22999,
    stock: 32,
    rating: 4.7,
    reviewCount: 95,
    isFeatured: false,
    isNewArrival: false,
    isFlashSale: false,
    isBestSeller: true,
    description: 'All-day power and pristine marble styling. Snapdragon 7 Gen 3, 100W SUPERVOOC charging, and 50MP Sony LYT-600 OIS camera.',
    features: [
      'Qualcomm Snapdragon 7 Gen 3 4nm processor',
      '100W SUPERVOOC charging (1-100% in 29 minutes)',
      '5500 mAh battery with 4 years health guarantee',
      '6.7" 120Hz Fluid AMOLED display'
    ],
    specifications: {
      'Display': '6.7" FHD+ 120Hz AMOLED',
      'Processor': 'Qualcomm Snapdragon 7 Gen 3',
      'RAM / Storage': '8GB + 128GB (expandable up to 1TB)',
      'Camera': '50MP Sony LYT-600 OIS + 8MP Ultrawide',
      'Warranty': '1 Year Official Warranty'
    },
    images: [
      '/products/oneplus-nord6-black.png'
    ]
  },
  {
    id: 'prod-op-n6x',
    name: 'OnePlus N6x 5G (Burgundy Red, 4GB+128GB, 7000mAh Battery)',
    sku: '1P-N6X-128-BRG',
    brand: 'OnePlus',
    category: 'Smartphones',
    price: 28999,
    salePrice: 22999,
    stock: 35,
    rating: 3.5,
    reviewCount: 223,
    isFeatured: true,
    isNewArrival: true,
    isFlashSale: true,
    isBestSeller: true,
    couponText: '21% Off Special Sale',
    description: 'OnePlus N6x | 4GB+128GB | Burgundy Red | 7000mAh Smoothness | Smooth 120Hz Display | Massive 7000mAh Battery | MIL-STD-810H & IP64.',
    features: [
      'Massive 7000mAh Battery for up to 3 days of uninterrupted usage',
      'Ultra-Smooth 120Hz Refresh Rate Display with eye-comfort certification',
      'MIL-STD-810H Military-Grade Drop Resistance & IP64 Dust and Splash Protection',
      '50MP Ultra-Clear Dual Camera with Portrait Retouching & HDR',
      '45W SUPERVOOC Fast Charging with Smart Charging Protection'
    ],
    specifications: {
      'Display': '6.72" FHD+ 120Hz Ultra-Smooth Display, 1000 nits, Wet Hand Touch',
      'Processor': 'Qualcomm Snapdragon 6 Gen 1 5G (4nm)',
      'RAM / Storage': '4GB RAM (+ 4GB RAM Expansion) + 128GB Storage (expandable up to 1TB)',
      'Battery': '7000 mAh Massive Battery with 45W SUPERVOOC',
      'Durability': 'MIL-STD-810H Military Standard Shockproof + IP64 Splash Resistance',
      'Camera': '50MP Primary + 2MP Portrait + 8MP Selfie with Night Mode',
      'Audio': 'Dual Stereo Speakers with 300% Ultra Volume Mode',
      'Warranty': '1 Year OnePlus India Manufacturer Warranty'
    },
    images: [
      '/products/oneplus-n6x-burgundy.png'
    ]
  },
  {
    id: 'prod-op-nord6',
    name: 'OnePlus Nord 6 5G (Pitch Black, 12GB+256GB, 9000mAh Battery)',
    sku: '1P-NRD6-256-BLK',
    brand: 'OnePlus',
    category: 'Smartphones',
    price: 56999,
    salePrice: 52999,
    stock: 20,
    rating: 4.4,
    reviewCount: 908,
    isFeatured: true,
    isNewArrival: true,
    isFlashSale: true,
    isBestSeller: true,
    couponText: 'Flat ₹500 Off on Select Bank Cards',
    description: "OnePlus Nord 6 | 12GB+256GB | Pitch Black | The Ultimate All-Rounder | Segment's 1st Steady-smooth 165 FPS BGMI and CODM gaming | Segment's largest 9000 mAh battery for 2.5+ days of power | Powered by OnePlus AI.",
    features: [
      "Segment's 1st Steady-smooth 165 FPS BGMI and CODM gaming performance",
      "Segment's largest 9000 mAh Glacier battery for 2.5+ days of non-stop endurance",
      'Powered by OnePlus AI: AI Eraser 2.0, AI Best Face, AI Summary',
      '6.83" 1.5K 165Hz Super Fluid AMOLED with ProXDR display',
      '100W SUPERVOOC Flash Charging (1-100% in 35 minutes)'
    ],
    specifications: {
      'Display': '6.83" 1.5K 165Hz Super Fluid AMOLED, 4000 nits, Rain Water Touch',
      'Processor': 'Qualcomm Snapdragon 8s Gen 3 (4nm) with Trinity Gaming Engine',
      'RAM / Storage': '12GB LPDDR5X + 256GB UFS 4.0',
      'Battery': '9000 mAh Glacier Silicon-Carbon with 100W SUPERVOOC',
      'Gaming': '165 FPS eSports Steady-Frame Rate for BGMI, CODM, Genshin',
      'Camera': '50MP Sony LYT-808 (f/1.8, OIS) + 50MP Ultrawide + 16MP Selfie',
      'OS': 'OxygenOS 15 with OnePlus AI & Google Gemini Assistant',
      'Warranty': '1 Year Official OnePlus India Warranty'
    },
    images: [
      '/products/oneplus-nord6-black.png'
    ]
  },
  {
    id: 'prod-op-15',
    name: 'OnePlus 15 5G (Sand Storm, 12GB+256GB, 7400mAh Battery)',
    sku: '1P-15-256-SST',
    brand: 'OnePlus',
    category: 'Smartphones',
    price: 89999,
    salePrice: 85999,
    stock: 14,
    rating: 4.6,
    reviewCount: 801,
    isFeatured: true,
    isNewArrival: true,
    isFlashSale: true,
    isBestSeller: true,
    couponText: 'Save extra with No Cost EMI',
    description: "OnePlus 15 | 12GB+256GB | Sand Storm | Never Settle | India's First 7400mAh Glacier Battery | Personalised AI | Game-Changing 165Hz ProXDR Display.",
    features: [
      "Never Settle flagship powerhouse with India's First 7400mAh Glacier Battery",
      'Game-Changing 165Hz 2K ProXDR LTPO AMOLED with 5000 nits peak brightness',
      'Personalised AI with real-time computational photography and AI Assistant',
      'Qualcomm Snapdragon 8 Elite (3nm, 4.32GHz) with Dual Vapor Chamber cooling',
      '120W SUPERVOOC wired and 50W AIRVOOC wireless charging'
    ],
    specifications: {
      'Display': '6.82" 2K 165Hz ProXDR LTPO AMOLED, 5000 nits, Dolby Vision',
      'Processor': 'Qualcomm Snapdragon 8 Elite (3nm, 4.32GHz Oryon CPU)',
      'RAM / Storage': '12GB LPDDR5X + 256GB UFS 4.0',
      'Battery': '7400 mAh Glacier Silicon-Carbon with 120W Wired + 50W Wireless',
      'Camera': '50MP Sony LYT-900 (1-inch) + 50MP Periscope (3x optical) + 50MP Ultrawide',
      'Color & Craftsmanship': 'Sand Storm Luxury Matte Ceramic with Titanium Frame',
      'Warranty': '1 Year OnePlus India Official Warranty'
    },
    images: [
      '/products/oneplus-15-sandstorm.png'
    ]
  },

  // ================= 4. VIVO FLAGSHIPS =================
  {
    id: 'prod-vivo-1',
    name: 'Vivo X200 Pro 5G (Titanium Gray, 16GB+512GB)',
    sku: 'VIV-X200P-512-TGR',
    brand: 'Vivo',
    category: 'Smartphones',
    price: 99999,
    salePrice: 94999,
    stock: 15,
    rating: 4.9,
    reviewCount: 68,
    isFeatured: true,
    isNewArrival: true,
    isFlashSale: true,
    isBestSeller: true,
    description: 'The undisputed camera king. Co-engineered with ZEISS featuring the 200MP APO Telephoto lens, MediaTek Dimensity 9400 flagship core, and 6000 mAh BlueOcean battery.',
    features: [
      'ZEISS 200MP APO Floating Telephoto Camera (1/1.4" sensor)',
      'MediaTek Dimensity 9400 (3nm) second-gen All-Big-Core engine',
      '6000 mAh BlueOcean Silicon-Carbon battery with 90W FlashCharge',
      '6.78" 1.5K Equal-depth Quad Curved AMOLED 120Hz',
      '4K 120fps Cinematic Portrait Video recording'
    ],
    specifications: {
      'Display': '6.78" 1.5K 120Hz LTPO AMOLED, 4500 nits peak',
      'Processor': 'MediaTek Dimensity 9400 (3.63 GHz)',
      'RAM / Storage': '16GB LPDDR5X + 512GB UFS 4.0',
      'Camera': '50MP Sony LYT-818 (1/1.28") + 200MP ZEISS APO + 50MP Ultrawide',
      'Battery': '6000 mAh with 90W FlashCharge and 30W Wireless',
      'Warranty': '1 Year Vivo Official India Warranty'
    },
    images: [
      '/products/vivo-x200-pro.png'
    ]
  },
  {
    id: 'prod-vivo-2',
    name: 'Vivo V40 Pro 5G (Ganges Blue, 12GB+512GB)',
    sku: 'VIV-V40P-512-BLU',
    brand: 'Vivo',
    category: 'Smartphones',
    price: 54999,
    salePrice: 48999,
    stock: 22,
    rating: 4.8,
    reviewCount: 84,
    isFeatured: true,
    isNewArrival: true,
    isFlashSale: false,
    isBestSeller: true,
    description: 'ZEISS Multifocal Portrait specialist with Dimensity 9200+, 5500 mAh battery in a super-slim 7.58mm body, and IP68 water resistance.',
    features: [
      'Triple 50MP ZEISS Camera System (Main, 2x Telephoto, Ultrawide)',
      'MediaTek Dimensity 9200+ flagship performance',
      '5500 mAh battery with 80W FlashCharge',
      'IP68 dust and water resistance'
    ],
    specifications: {
      'Display': '6.78" 1.5K 3D Curved AMOLED, 120Hz',
      'Processor': 'MediaTek Dimensity 9200+ (4nm)',
      'RAM / Storage': '12GB + 512GB',
      'Camera': '50MP Sony IMX921 OIS + 50MP Telephoto + 50MP Ultrawide',
      'Warranty': '1 Year Official Warranty'
    },
    images: [
      '/products/vivo-v40-pro.png'
    ]
  },
  {
    id: 'prod-vivo-3',
    name: 'Vivo T3 Ultra 5G (Frost Green, 12GB+256GB)',
    sku: 'VIV-T3U-256-GRN',
    brand: 'Vivo',
    category: 'Smartphones',
    price: 37999,
    salePrice: 31999,
    stock: 25,
    rating: 4.7,
    reviewCount: 75,
    isFeatured: false,
    isNewArrival: true,
    isFlashSale: true,
    isBestSeller: false,
    description: 'Turbocharged performance with MediaTek Dimensity 9200+, Sony IMX921 OIS camera, and 3D curved 1.5K display.',
    features: [
      'Dimensity 9200+ flagship grade 4nm processor',
      'Sony 50MP IMX921 with OIS and Aura Light',
      '5500 mAh battery with 80W fast charging'
    ],
    specifications: {
      'Display': '6.78" 1.5K 3D Curved AMOLED, 120Hz',
      'Processor': 'MediaTek Dimensity 9200+',
      'RAM / Storage': '12GB + 256GB',
      'Warranty': '1 Year Manufacturer Warranty'
    },
    images: [
      '/products/vivo-v40-pro.png'
    ]
  },
  {
    id: 'prod-vivo-4',
    name: 'Vivo V40 5G (Titanium Grey, 8GB+256GB)',
    sku: 'VIV-V40-256-GRY',
    brand: 'Vivo',
    category: 'Smartphones',
    price: 42999,
    salePrice: 36999,
    stock: 25,
    rating: 4.8,
    reviewCount: 94,
    isFeatured: false,
    isNewArrival: true,
    isFlashSale: true,
    isBestSeller: true,
    description: 'Ultra-slim 7.58mm body housing a gigantic 5500 mAh battery with ZEISS optics and IP68 dust/water protection.',
    features: [
      'Co-engineered with ZEISS: 50MP Main + 50MP Ultrawide',
      'Snapdragon 7 Gen 3 performance',
      '5500 mAh BlueOcean battery with 80W FlashCharge',
      'IP68 & IP69 water and dust resistance'
    ],
    specifications: {
      'Display': '6.78" 1.5K 120Hz 3D Curved AMOLED',
      'Processor': 'Qualcomm Snapdragon 7 Gen 3 (4nm)',
      'RAM / Storage': '8GB + 256GB',
      'Camera': '50MP ZEISS OIS + 50MP ZEISS Ultrawide',
      'Warranty': '1 Year Vivo Official Warranty'
    },
    images: [
      '/products/vivo-v40-pro.png'
    ]
  },
  {
    id: 'prod-vivo-5',
    name: 'Vivo X100 Pro 5G (Asteroid Black, 16GB+512GB)',
    sku: 'VIV-X100P-512-BLK',
    brand: 'Vivo',
    category: 'Smartphones',
    price: 89999,
    salePrice: 84999,
    stock: 12,
    rating: 4.9,
    reviewCount: 78,
    isFeatured: true,
    isNewArrival: false,
    isFlashSale: true,
    isBestSeller: true,
    description: 'ZEISS APO 100mm floating periscope camera, Sony IMX989 1-inch sensor, Dimensity 9300, and Vivo V3 imaging chip.',
    features: [
      '1-inch Sony IMX989 sensor with ZEISS T* coating',
      'MediaTek Dimensity 9300 4nm flagship engine',
      '100W Dual-Cell FlashCharge + 50W Wireless',
      'Vivo V3 dedicated 6nm imaging chip'
    ],
    specifications: {
      'Display': '6.78" 1.5K 120Hz LTPO AMOLED, 3000 nits',
      'Processor': 'MediaTek Dimensity 9300',
      'RAM / Storage': '16GB + 512GB',
      'Camera': '50MP (1-inch) + 50MP APO Periscope + 50MP Ultrawide',
      'Warranty': '1 Year Vivo India Warranty'
    },
    images: [
      '/products/vivo-x100-pro.png'
    ]
  },

  // ================= 5. OPPO FLAGSHIPS =================
  {
    id: 'prod-oppo-1',
    name: 'Oppo Find X8 Pro 5G (Space Black, 16GB+512GB)',
    sku: 'OPP-X8P-512-BLK',
    brand: 'Oppo',
    category: 'Smartphones',
    price: 109999,
    salePrice: 99999,
    stock: 14,
    rating: 4.9,
    reviewCount: 52,
    isFeatured: true,
    isNewArrival: true,
    isFlashSale: true,
    isBestSeller: true,
    description: 'Dual Periscope Hasselblad Master Camera innovation. Powered by Dimensity 9400, Quick Button camera shutter, and 5910 mAh Silicon-Carbon battery.',
    features: [
      'World-first Dual Periscope Camera (3x + 6x optical periscopes)',
      'Hasselblad Master Photography & Studio Portrait Mode',
      'MediaTek Dimensity 9400 flagship 3nm processor',
      'Dedicated capacitive Quick Button for instant camera capture',
      '5910 mAh Glacier battery with 80W SUPERVOOC and 50W AIRVOOC'
    ],
    specifications: {
      'Display': '6.78" 1.5K Infinite View 120Hz Quad-Curved AMOLED, 4500 nits',
      'Processor': 'MediaTek Dimensity 9400',
      'RAM / Storage': '16GB LPDDR5X + 512GB UFS 4.0',
      'Camera': '50MP Sony LYT-800 + 50MP (3x) + 50MP (6x Periscope) + 50MP Ultra',
      'Battery': '5910 mAh with 80W wired and 50W wireless charging',
      'Warranty': '1 Year Oppo Official India Warranty'
    },
    images: [
      '/products/oppo-find-x8-pro.png'
    ]
  },
  {
    id: 'prod-oppo-2',
    name: 'Oppo Reno 12 Pro 5G (Sunset Gold, 12GB+512GB)',
    sku: 'OPP-RN12P-512-GLD',
    brand: 'Oppo',
    category: 'Smartphones',
    price: 41999,
    salePrice: 36999,
    stock: 24,
    rating: 4.8,
    reviewCount: 90,
    isFeatured: true,
    isNewArrival: true,
    isFlashSale: false,
    isBestSeller: true,
    description: 'AI Portrait Expert with futuristic fluid aesthetic, 50MP Sony telephoto portrait camera, and Splash Touch technology.',
    features: [
      'OPPO AI Studio: AI Eraser 2.0, AI Clear Voice & AI Best Face',
      'Triple 50MP camera with 2x Telephoto optical zoom',
      '5000 mAh battery with 80W SUPERVOOC charging'
    ],
    specifications: {
      'Display': '6.7" Quad Curved Infinite View 120Hz AMOLED',
      'Processor': 'MediaTek Dimensity 7300-Energy (4nm)',
      'RAM / Storage': '12GB + 512GB',
      'Camera': '50MP Sony LYT-600 OIS + 50MP Telephoto + 8MP Ultra',
      'Warranty': '1 Year Official Warranty'
    },
    images: [
      '/products/oppo-reno12-pro-gold-512.png'
    ]
  },
  {
    id: 'prod-oppo-3',
    name: 'Oppo Find X8 5G (Starry Gray, 12GB+256GB)',
    sku: 'OPP-X8-256-GRY',
    brand: 'Oppo',
    category: 'Smartphones',
    price: 74999,
    salePrice: 69999,
    stock: 18,
    rating: 4.8,
    reviewCount: 65,
    isFeatured: true,
    isNewArrival: true,
    isFlashSale: true,
    isBestSeller: true,
    description: 'Compact flagship masterpiece. Flat screen with razor-thin 1.45mm bezels, Hasselblad Master Triple Camera, and Dimensity 9400 power.',
    features: [
      'Ultra-thin 1.45mm symmetrical bezels on 6.59" flat display',
      'Hasselblad 50MP Sony LYT-700 + 50MP 3x Periscope + 50MP Ultrawide',
      '5630 mAh Silicon-Carbon battery with 80W SUPERVOOC',
      'IP68 and IP69 water and dust ingress protection'
    ],
    specifications: {
      'Display': '6.59" 1.5K 120Hz AMOLED, 4500 nits peak',
      'Processor': 'MediaTek Dimensity 9400 (3nm)',
      'RAM / Storage': '12GB + 256GB',
      'Camera': '50MP (OIS) + 50MP (3x Periscope) + 50MP (Ultrawide)',
      'Warranty': '1 Year Official India Warranty'
    },
    images: [
      '/products/oppo-reno16c-purple.png'
    ]
  },
  {
    id: 'prod-oppo-4',
    name: 'Oppo Reno 12 5G (Matte Brown, 8GB+256GB)',
    sku: 'OPP-RN12-256-BRN',
    brand: 'Oppo',
    category: 'Smartphones',
    price: 34999,
    salePrice: 29999,
    stock: 26,
    rating: 4.7,
    reviewCount: 82,
    isFeatured: false,
    isNewArrival: false,
    isFlashSale: false,
    isBestSeller: true,
    description: 'Sleek, futuristic design with advanced GenAI features, 50MP Sony camera with OIS, and 80W SUPERVOOC charging.',
    features: [
      '6.7" 120Hz 3D Curved AMOLED with Splash Touch',
      '5000 mAh battery with 80W flash charging',
      'OPPO AI Studio: AI Eraser 2.0 & AI Summary'
    ],
    specifications: {
      'Display': '6.7" FHD+ 120Hz 3D Curved AMOLED',
      'Processor': 'MediaTek Dimensity 7300-Energy',
      'RAM / Storage': '8GB + 256GB',
      'Camera': '50MP Sony LYT-600 OIS + 8MP + 2MP',
      'Warranty': '1 Year Official Warranty'
    },
    images: [
      '/products/oppo-reno12-pro-gold-256.png'
    ]
  },
  {
    id: 'prod-oppo-5',
    name: 'Oppo F27 Pro+ 5G (Dusk Pink, 8GB+256GB)',
    sku: 'OPP-F27PP-256-PNK',
    brand: 'Oppo',
    category: 'Smartphones',
    price: 29999,
    salePrice: 24999,
    stock: 28,
    rating: 4.8,
    reviewCount: 110,
    isFeatured: false,
    isNewArrival: true,
    isFlashSale: true,
    isBestSeller: true,
    description: "India's first IP69 waterproof smartphone with Armour Body 360-degree damage-proof protection and stunning vegan leather finish.",
    features: [
      'Triple certified IP66, IP68, and IP69 waterproof protection',
      'Armour body 360° drop resistance with Swiss SGS 5-star certification',
      '6.7" 3D Curved 120Hz AMOLED display',
      '64MP Ultra-clear Main camera with AI Studio portrait tools'
    ],
    specifications: {
      'Display': '6.7" FHD+ 120Hz 3D Curved AMOLED, Gorilla Glass Victus 2',
      'Processor': 'MediaTek Dimensity 7050 (6nm)',
      'RAM / Storage': '8GB + 256GB',
      'Camera': '64MP Main + 2MP Portrait',
      'Battery': '5000 mAh with 67W SUPERVOOC charging',
      'Warranty': '1 Year Oppo Official Warranty'
    },
    images: [
      '/products/oppo-f27-pro.png'
    ]
  },
  {
    id: 'prod-oppo-reno16c-wht',
    name: 'OPPO Reno16C 5G (White, 12GB+256GB, 7000mAh Battery)',
    sku: 'OPP-RN16C-256-WHT',
    brand: 'Oppo',
    category: 'Smartphones',
    price: 63199,
    salePrice: 59999,
    stock: 22,
    rating: 4.5,
    reviewCount: 591,
    isFeatured: true,
    isNewArrival: true,
    isFlashSale: true,
    isBestSeller: true,
    couponText: 'You pay ₹59,999 with coupon',
    description: 'OPPO Reno16C 5G Smartphone 12+256GB White with AMOLED, 7000mAh Battery, 80W Fast Charging, 50MP 3.5x Telephoto Camera, 4K Auto Straighten Video, AI Remix Collage.',
    features: [
      'OPPO AI Phone with 50MP 3.5x Telephoto Camera with OIS',
      'Massive 7000mAh Battery with 80W Fast SUPERVOOC Flash Charge',
      '4K Auto Straighten Video for cinematic leveled handheld footage',
      'Make your Photo Dump In Motion with AI Remix Collage',
      '6.7" 120Hz Ultra-Bright Curved AMOLED with 1.07 Billion Colors'
    ],
    specifications: {
      'Display': '6.7" FHD+ 120Hz 3D Curved AMOLED, HDR10+, 2400 nits peak',
      'Processor': 'MediaTek Dimensity 8350 AI 5G (4nm, Octa-Core)',
      'RAM / Storage': '12GB LPDDR5X + 256GB UFS 3.1',
      'Battery': '7000 mAh High-Density Battery with 80W SUPERVOOC Fast Charge',
      'Camera': '50MP Primary (Sony LYT-700 OIS) + 50MP 3.5x Telephoto + 8MP Ultrawide',
      'Video Capabilities': '4K Auto Straighten Video, AI Motion Snapshot, 4K HDR',
      'Special Features': 'AI Remix Collage, In-Display Fingerprint, Dual Stereo Speakers',
      'Warranty': '1 Year OPPO India Official Manufacturer Warranty'
    },
    images: [
      '/products/oppo-reno16c-white.png'
    ]
  },
  {
    id: 'prod-oppo-reno16c-prp',
    name: 'OPPO Reno16C 5G (Nebula Purple, 8GB+128GB, 7000mAh Battery)',
    sku: 'OPP-RN16C-128-PRP',
    brand: 'Oppo',
    category: 'Smartphones',
    price: 52699,
    salePrice: 49999,
    stock: 28,
    rating: 4.5,
    reviewCount: 268,
    isFeatured: true,
    isNewArrival: true,
    isFlashSale: true,
    isBestSeller: true,
    couponText: 'You pay ₹49,999 with coupon',
    description: 'OPPO Reno16C 5G Smartphone 8+128GB Purple with 7000mAh Battery, 80W Fast Charging, 50MP 3.5x Telephoto Camera, and AI Studio.',
    features: [
      '7000mAh High-Capacity Battery with 80W Fast SUPERVOOC',
      '50MP 3.5x Telephoto Camera with portrait bokeh perfection',
      '4K Auto Straighten Video for rock-steady motion capture',
      'AI Remix Collage & Photo Dump in Motion',
      'Striking Nebula Purple shimmer finish with splash protection'
    ],
    specifications: {
      'Display': '6.7" 120Hz Curved AMOLED, 2200 nits, Wet Touch Technology',
      'Processor': 'MediaTek Dimensity 8350 AI 5G',
      'RAM / Storage': '8GB + 128GB UFS 3.1',
      'Battery': '7000 mAh with 80W Fast Charging (50% in 22 mins)',
      'Camera': '50MP (OIS) + 50MP (3.5x Optical Zoom) + 8MP Ultrawide',
      'Front Camera': '32MP Ultra-sensing selfie camera with 4K recording',
      'Warranty': '1 Year Official OPPO India Warranty'
    },
    images: [
      '/products/oppo-reno16c-purple.png'
    ]
  },
  {
    id: 'prod-oppo-reno12p-512',
    name: 'OPPO Reno 12 Pro 5G (Sunset Gold, 12GB+512GB)',
    sku: 'OPP-RN12P-512-GLD-AMZ',
    brand: 'Oppo',
    category: 'Smartphones',
    price: 55999,
    salePrice: 52999,
    stock: 2,
    rating: 4.1,
    reviewCount: 84,
    isFeatured: true,
    isNewArrival: false,
    isFlashSale: true,
    isBestSeller: true,
    couponText: 'Only 2 left in stock',
    description: 'OPPO Reno 12 Pro 5G (Sunset Gold, 512 GB) | AI Portrait Expert with 50MP Telephoto Camera, Dimensity 7300-Energy, and 80W SUPERVOOC charging.',
    features: [
      'OPPO AI Studio: AI Eraser 2.0, AI Best Face, AI Clear Voice',
      '50MP Sony Telephoto Portrait Camera with 2x optical zoom',
      'Liquid magnetic fluid finish in radiant Sunset Gold',
      '5000 mAh battery with 80W SUPERVOOC charging',
      'IP65 water and dust resistance with Splash Touch'
    ],
    specifications: {
      'Display': '6.7" Quad Curved Infinite View 120Hz AMOLED, Gorilla Glass Victus 2',
      'Processor': 'MediaTek Dimensity 7300-Energy (4nm flagship platform)',
      'RAM / Storage': '12GB LPDDR4X + 512GB UFS 3.1',
      'Battery': '5000 mAh with 80W SUPERVOOC (1-100% in 46 mins)',
      'Camera': '50MP Sony LYT-600 OIS + 50MP Telephoto + 8MP Ultrawide',
      'Front Camera': '50MP with Auto-Focus and 4K video',
      'Warranty': '1 Year Official OPPO India Warranty'
    },
    images: [
      '/products/oppo-reno12-pro-gold-512.png'
    ]
  },
  {
    id: 'prod-oppo-reno12p-256',
    name: 'OPPO Reno 12 Pro 5G (Sunset Gold, 12GB+256GB)',
    sku: 'OPP-RN12P-256-GLD-AMZ',
    brand: 'Oppo',
    category: 'Smartphones',
    price: 53999,
    salePrice: 52499,
    stock: 2,
    rating: 4.4,
    reviewCount: 100,
    isFeatured: true,
    isNewArrival: false,
    isFlashSale: false,
    isBestSeller: true,
    couponText: 'Only 2 left in stock',
    description: 'OPPO Reno 12 Pro 5G (Sunset Gold, 256 GB) with AI Portrait Studio, 50MP 2x Telephoto lens, and 80W Fast Charging.',
    features: [
      'AI Portrait Expert with dual 50MP camera sensors',
      'Quad-Curved 120Hz AMOLED display with Splash Touch',
      '5000 mAh long-lasting battery with 80W SUPERVOOC',
      'Sunset Gold aerospace-grade alloy unibody'
    ],
    specifications: {
      'Display': '6.7" FHD+ 120Hz Quad-Curved AMOLED',
      'Processor': 'MediaTek Dimensity 7300-Energy (4nm)',
      'RAM / Storage': '12GB + 256GB',
      'Battery': '5000 mAh with 80W Flash Charge',
      'Camera': '50MP OIS + 50MP Telephoto + 8MP Ultrawide',
      'Warranty': '1 Year Official OPPO India Warranty'
    },
    images: [
      '/products/oppo-reno12-pro-gold-256.png'
    ]
  },

  // ================= 6. SMART TVS & HOME APPLIANCES =================
  {
    id: 'prod-tv-1',
    name: 'Sony BRAVIA XR 65" 4K HDR Google TV (Cognitive Processor XR)',
    sku: 'SNY-XR65-4K-TV',
    brand: 'Sony',
    category: 'Smart TV',
    price: 169990,
    salePrice: 144990,
    stock: 8,
    rating: 4.9,
    reviewCount: 64,
    isFeatured: true,
    isNewArrival: true,
    isFlashSale: false,
    isBestSeller: true,
    description: 'Immerse in breathtaking contrast powered by Sony Cognitive Processor XR. Acoustic Surface Audio+ turns the entire screen into a masterclass cinema speaker.',
    features: [
      'Cognitive Processor XR replicates human vision and hearing',
      'XR Triluminos Pro with over a billion pure vibrant colors',
      'Acoustic Multi-Audio and Dolby Atmos cinema sound'
    ],
    specifications: {
      'Display': '65 Inch 4K Ultra HD (3840 x 2160) 120Hz',
      'Sound Output': '50 Watts Acoustic Multi-Audio',
      'Smart Platform': 'Google TV with Voice Assistant',
      'Warranty': '3 Years Comprehensive Brand Warranty'
    },
    images: [
      '/products/sony-bravia-oled.png'
    ]
  },
  {
    id: 'prod-ref-1',
    name: 'LG 343L 3-Star Smart Inverter Frost-Free Double Door Refrigerator',
    sku: 'LG-GL-T382VESX',
    brand: 'LG',
    category: 'Refrigerator',
    price: 48990,
    salePrice: 38990,
    stock: 10,
    rating: 4.8,
    reviewCount: 42,
    isFeatured: true,
    isNewArrival: false,
    isFlashSale: true,
    isBestSeller: true,
    description: 'Door Cooling+ with Smart Inverter Compressor provides uniform cooling and 35% faster temperature restoration.',
    features: [
      'Door Cooling+ provides uniform freshness everywhere',
      'Smart Inverter Compressor with 10-year warranty',
      'Auto Smart Connect connects to home inverter during power cuts'
    ],
    specifications: {
      'Capacity': '343 Litres',
      'Energy Rating': '3 Star BEE Rating',
      'Compressor': 'Smart Inverter Compressor',
      'Warranty': '1 Year Comprehensive + 10 Years on Compressor'
    },
    images: [
      '/products/lg-instaview-fridge.png'
    ]
  },
  {
    id: 'prod-ac-1',
    name: 'Daikin 1.5 Ton 5-Star Inverter Split Air Conditioner (Copper Condenser)',
    sku: 'DKN-FTKM50U',
    brand: 'Whirlpool',
    category: 'Air Conditioner',
    price: 58400,
    salePrice: 44990,
    stock: 12,
    rating: 4.9,
    reviewCount: 56,
    isFeatured: true,
    isNewArrival: true,
    isFlashSale: true,
    isBestSeller: true,
    description: '5-Star Energy Rated Inverter AC with PM2.5 filter, Dew Clean Technology, and triple display for instant temperature status.',
    features: [
      'Triple Display shows set temperature & real-time power consumption',
      'Dew Clean Technology automatically cleans the indoor evaporator coil',
      '100% Copper Condenser with anti-corrosion fins'
    ],
    specifications: {
      'Capacity': '1.5 Ton',
      'Energy Efficiency': '5 Star BEE Rating (ISEER: 5.2)',
      'Refrigerant': 'Eco-Friendly R32',
      'Warranty': '1 Year Product, 5 Years PCB, 10 Years Compressor'
    },
    images: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'prod-spk-1',
    name: 'Bose QuietComfort Ultra Wireless Noise Cancelling Headphones',
    sku: 'BSE-QCU-WHT',
    brand: 'Bose',
    category: 'Speakers',
    price: 35900,
    salePrice: 29900,
    stock: 15,
    rating: 4.9,
    reviewCount: 72,
    isFeatured: true,
    isNewArrival: false,
    isFlashSale: false,
    isBestSeller: true,
    description: 'World-class active noise cancellation with spatial audio, CustomTune technology, and up to 24 hours of playback.',
    features: [
      'Bose Immersive Audio pushes boundaries of spatial listening',
      'CustomTune technology personalizes sound to the shape of your ears',
      'Quiet, Aware, and Immersion modes with 24 hours battery life'
    ],
    specifications: {
      'Form Factor': 'Over-Ear Wireless',
      'Battery Life': 'Up to 24 Hours',
      'Connectivity': 'Bluetooth 5.3 with Multipoint',
      'Warranty': '1 Year Bose Official Warranty'
    },
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80'
    ]
  }
];

// ================= BRIGHT & STYLISH HERO SLIDES =================
// Designed with vibrant, bright, high-converting festival & luxury gradients (NO dark muddy backgrounds)
export const INITIAL_BANNERS = [
  {
    id: 'banner-oppo-reno16c',
    title: 'OPPO AI REVOLUTION',
    subtitle: 'OPPO Reno16C 5G (7000mAh)',
    tagline: '50MP 3.5x Telephoto Camera • 4K Auto Straighten Video • Photo Dump In Motion • 80W Fast Charging',
    buttonText: 'Shop Reno16C 5G',
    link: '/product/prod-oppo-reno16c-wht',
    brand: 'Oppo',
    accentColor: '#7C3AED',
    badgeText: '7000mAh BATTERY • 3.5x TELEPHOTO',
    bgGradient: 'bg-gradient-to-r from-purple-50 via-fuchsia-50 to-pink-100/70',
    borderColor: 'border-purple-200',
    image: '/products/oppo-reno16c-white.png',
    priceText: '₹59,999',
    mrpText: '₹63,199',
    couponText: 'You pay ₹59,999 with coupon',
    enabled: true
  },
  {
    id: 'banner-oneplus-nord6',
    title: 'THE ULTIMATE ALL-ROUNDER',
    subtitle: 'OnePlus Nord 6 5G (Pitch Black)',
    tagline: "Segment's 1st Steady-smooth 165 FPS Gaming • Segment's Largest 9000 mAh Battery (2.5+ Days) • OnePlus AI",
    buttonText: 'Order Nord 6',
    link: '/product/prod-op-nord6',
    brand: 'OnePlus',
    accentColor: '#0F172A',
    badgeText: '165 FPS GAMING • 9000mAh',
    bgGradient: 'bg-gradient-to-r from-slate-100 via-zinc-100 to-cyan-50',
    borderColor: 'border-slate-300',
    image: '/products/oneplus-nord6-black.png',
    priceText: '₹52,999',
    mrpText: '₹56,999',
    couponText: 'Flat ₹500 Off on Select Bank Cards',
    enabled: true
  },
  {
    id: 'banner-oneplus-15',
    title: 'NEVER SETTLE POWERHOUSE',
    subtitle: 'OnePlus 15 5G (Sand Storm)',
    tagline: "India's First 7400mAh Glacier Battery • Personalised AI • Game-Changing 165Hz ProXDR Display",
    buttonText: 'Explore OnePlus 15',
    link: '/product/prod-op-15',
    brand: 'OnePlus',
    accentColor: '#B45309',
    badgeText: '7400mAh GLACIER • 165Hz 2K',
    bgGradient: 'bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-100/70',
    borderColor: 'border-amber-200',
    image: '/products/oneplus-15-sandstorm.png',
    priceText: '₹85,999',
    mrpText: '₹89,999',
    couponText: 'Save extra with No Cost EMI',
    enabled: true
  },
  {
    id: 'banner-apple-17',
    title: 'NEXT-GEN APPLE INTELLIGENCE',
    subtitle: 'Apple iPhone 17 512 GB',
    tagline: '15.93 cm (6.3") ProMotion 120Hz Display • Apple A19 Bionic • Center Stage Group Selfies • Improved Scratch Resistance',
    buttonText: 'Shop iPhone 17',
    link: '/product/prod-apple-17',
    brand: 'Apple',
    accentColor: '#1E293B',
    badgeText: 'APPLE A19 • 6.3" PROMOTION',
    bgGradient: 'bg-gradient-to-r from-blue-50 via-slate-50 to-indigo-50',
    borderColor: 'border-blue-200',
    image: '/products/apple-iphone17-spacegray.png',
    priceText: '₹1,02,900',
    mrpText: '₹1,12,900',
    couponText: '₹10,000 Special Launch Offer',
    enabled: true
  },
  {
    id: 'banner-oneplus-n6x',
    title: 'MASSIVE BATTERY SMOOTHNESS',
    subtitle: 'OnePlus N6x 5G (Burgundy Red)',
    tagline: 'Massive 7000mAh Battery • Ultra-Smooth 120Hz Display • MIL-STD-810H Military-Grade & IP64',
    buttonText: 'Buy OnePlus N6x',
    link: '/product/prod-op-n6x',
    brand: 'OnePlus',
    accentColor: '#991B1B',
    badgeText: '7000mAh • 21% OFF SALE',
    bgGradient: 'bg-gradient-to-r from-rose-50 via-red-50 to-pink-100/60',
    borderColor: 'border-rose-200',
    image: '/products/oneplus-n6x-burgundy.png',
    priceText: '₹22,999',
    mrpText: '₹28,999',
    couponText: '21% Off Special Sale',
    enabled: true
  },
  {
    id: 'banner-oppo-reno12p',
    title: 'AI PORTRAIT EXPERT',
    subtitle: 'OPPO Reno 12 Pro 5G (Sunset Gold)',
    tagline: 'AI Studio 2.0 • 50MP 2x Telephoto Optical Zoom • 80W SUPERVOOC Fast Charge',
    buttonText: 'Shop Reno 12 Pro',
    link: '/product/prod-oppo-reno12p-512',
    brand: 'Oppo',
    accentColor: '#D97706',
    badgeText: 'SUNSET GOLD • 50MP TELEPHOTO',
    bgGradient: 'bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-100/70',
    borderColor: 'border-amber-200',
    image: '/products/oppo-reno12-pro-gold-512.png',
    priceText: '₹52,999',
    mrpText: '₹55,999',
    couponText: 'Only 2 left in stock',
    enabled: true
  },
  {
    id: 'banner-apple-16',
    title: '5G MOBILE WITH CAMERA CONTROL',
    subtitle: 'Apple iPhone 16 128 GB (Black)',
    tagline: 'Camera Control • Apple A18 Bionic All-Day Battery • 48MP Fusion Camera • Works with AirPods',
    buttonText: 'Shop iPhone 16',
    link: '/product/prod-apple-16-blk',
    brand: 'Apple',
    accentColor: '#0F172A',
    badgeText: 'CAMERA CONTROL • 16% OFF',
    bgGradient: 'bg-gradient-to-r from-slate-100 via-gray-50 to-slate-200/60',
    borderColor: 'border-slate-300',
    image: '/products/apple-iphone16-black.png',
    priceText: '₹67,490',
    mrpText: '₹79,900',
    couponText: 'Amazon Match Price 16% Off',
    enabled: true
  },
  {
    id: 'banner-samsung',
    title: 'GALAXY AI REVOLUTION',
    subtitle: 'Samsung Galaxy S25 Ultra 5G',
    tagline: '200MP Quad Telephoto • Snapdragon 8 Elite • S Pen Included',
    buttonText: 'Order S25 Ultra',
    link: '/product/prod-sam-1',
    brand: 'Samsung',
    accentColor: '#1D4ED8',
    badgeText: 'AI FLAGSHIP 2026',
    bgGradient: 'bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-100/60',
    borderColor: 'border-blue-200',
    image: '/products/samsung-s25-ultra.png',
    priceText: '₹1,34,999',
    mrpText: '₹1,44,999',
    couponText: 'Exchange Bonus Up to ₹12,000',
    enabled: true
  },
  {
    id: 'banner-sony-tv',
    title: 'CINEMATIC PURITY AT HOME',
    subtitle: 'Sony BRAVIA XR 65" 4K OLED',
    tagline: 'Cognitive Processor XR • Acoustic Multi-Audio • Up to 35% Off Prayagraj Showroom Deal',
    buttonText: 'Explore Smart 4K TVs',
    link: '/shop?category=Smart TV',
    brand: 'Sony',
    accentColor: '#0F766E',
    badgeText: 'CINEMA EXPERIENCE',
    bgGradient: 'bg-gradient-to-r from-teal-50 via-cyan-50 to-blue-100/60',
    borderColor: 'border-teal-200',
    image: '/products/sony-bravia-oled.png',
    priceText: '₹1,44,990',
    mrpText: '₹1,69,990',
    couponText: 'Showroom Upgrade Offer',
    enabled: true
  },
  {
    id: 'banner-appliances',
    title: 'LUXURY SMART HOME APPLIANCES',
    subtitle: 'LG InstaView AI Refrigerator',
    tagline: 'Knock Twice & See Inside • LinearCooling • Smart Diagnosis & Energy Saving',
    buttonText: 'Shop Smart Appliances',
    link: '/shop?category=Refrigerator',
    brand: 'LG',
    accentColor: '#BE185D',
    badgeText: 'PREMIUM HOME',
    bgGradient: 'bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50',
    borderColor: 'border-rose-200',
    image: '/products/lg-instaview-fridge.png',
    priceText: '₹84,990',
    mrpText: '₹99,990',
    couponText: 'Festival Exchange Deal',
    enabled: true
  }
];

export const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    productId: 'prod-apple-1',
    userName: 'Vikram Malhotra',
    rating: 5,
    title: 'Outstanding Luxury & Original Apple Unit',
    comment: 'Purchased iPhone 16 Pro Max from Audio Den store in Prayagraj. Genuine Apple warranty, bill provided with GST. Delivered within 3 hours at Civil Lines! Outstanding service.',
    date: '2026-08-20',
    verified: true,
    approved: true
  },
  {
    id: 'rev-2',
    productId: 'prod-sam-1',
    userName: 'Pooja Agarwal',
    rating: 5,
    title: 'Galaxy AI is Mindblowing',
    comment: 'The Galaxy S25 Ultra is a beast. Great exchange rate offered at the Tripathi Chauraha store. Highly recommend Audio Den for all electronics.',
    date: '2026-08-22',
    verified: true,
    approved: true
  },
  {
    id: 'rev-3',
    productId: 'prod-op-1',
    userName: 'Rohit Mishra',
    rating: 5,
    title: 'OnePlus 13 Speed is Unbeatable',
    comment: 'Battery lasts almost 2 full days and charges in 25 mins. Smooth 2K display. Audio Den gave the best price in all of Prayagraj!',
    date: '2026-08-25',
    verified: true,
    approved: true
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'ORD-99351',
    customerName: 'Rohit Verma',
    customerEmail: 'rohit.verma26@gmail.com',
    customerPhone: '9839123456',
    date: '2026-09-09',
    items: [
      {
        id: 'prod-apple-1',
        productId: 'prod-apple-1',
        name: 'Apple iPhone 16 Pro Max (Desert Titanium, 256GB)',
        price: 139900,
        quantity: 1,
        image: '/products/apple-iphone16-pro-max.png',
        brand: 'Apple',
        specs: 'Desert Titanium • 256GB • 5G'
      }
    ],
    totalAmount: 139900,
    paymentMethod: 'Razorpay UPI (Verified)',
    paymentStatus: 'Paid',
    status: 'Processing',
    shippingAddress: '18/4 Civil Lines, Near Subhash Chauraha, Prayagraj 211001',
    courier: 'Blue Dart Express',
    trackingNumber: 'BD-9935102727IN',
    invoiceNumber: 'AD-INV-2026-99351',
    timeline: [
      { title: 'Order Confirmed', date: '09 Sep 2026, 10:15 AM', desc: 'Order verified & UPI payment received', completed: true },
      { title: 'Processing at Audio Den', date: '09 Sep 2026, 11:00 AM', desc: 'Assigned to Showroom Dispatch Queue', completed: true },
      { title: 'Packed & Ready', date: '09 Sep 2026, 02:30 PM', desc: 'Handover scheduled to Blue Dart Express', completed: false },
      { title: 'Out for Delivery', date: 'Expected 10 Sep 2026', desc: 'Doorstep delivery Prayagraj', completed: false },
      { title: 'Delivered', date: 'Pending', desc: 'OTP verification upon delivery', completed: false }
    ]
  }
];

export const INITIAL_CUSTOMERS = [
  {
    id: 'cust-1',
    name: 'Rohit Verma',
    email: 'rohit.verma26@gmail.com',
    phone: '9839123456',
    city: 'Prayagraj',
    totalOrders: 1,
    totalSpent: 139900,
    joinedDate: '2026-09-09'
  }
];

export const INITIAL_OFFERS = [
  {
    id: 'offer-1',
    title: 'Monsoon Mega Sale',
    description: 'Flat 15% off on all Samsung smartphones. Limited period offer!',
    discountPercent: 15,
    applicableTo: 'brand',
    applicableValue: 'Samsung',
    couponCode: 'MONSOON15',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    enabled: true
  },
  {
    id: 'offer-2',
    title: 'Apple Days Special',
    description: 'Get up to ₹10,000 off on iPhone 16 series with exchange bonus',
    discountPercent: 8,
    applicableTo: 'brand',
    applicableValue: 'Apple',
    couponCode: 'APPLEDAYS',
    startDate: '2026-09-05',
    endDate: '2026-09-20',
    enabled: true
  },
  {
    id: 'offer-3',
    title: 'Smart TV Bonanza',
    description: 'Upto 30% off on premium Smart TVs from Sony, Samsung & LG',
    discountPercent: 30,
    applicableTo: 'category',
    applicableValue: 'Smart TV',
    couponCode: 'TVDEAL30',
    startDate: '2026-09-01',
    endDate: '2026-10-15',
    enabled: false
  },
  {
    id: 'offer-4',
    title: 'OnePlus Festive Offer',
    description: 'Extra 10% cashback on all OnePlus models with HDFC cards',
    discountPercent: 10,
    applicableTo: 'brand',
    applicableValue: 'OnePlus',
    couponCode: 'OP10FEST',
    startDate: '2026-09-10',
    endDate: '2026-09-25',
    enabled: true
  }
];
