// Mock Users
export const demoUsers = [
  {
    id: '1',
    role: 'client',
    email: 'client@gdk.com',
    password: 'client123',
    name: 'Marie Dupont'
  },
  {
    id: '2',
    role: 'seller',
    email: 'seller@gdk.com',
    password: 'seller123',
    name: 'Pierre Martin'
  },
];

// Mock Products
export const mockProducts = [
  {
    id: '1',
    name: 'Rouge à Lèvres Luxury Matte',
    description: 'Rouge à lèvres longue tenue avec fini mat luxueux. Formule hydratante enrichie en vitamines E et C pour des lèvres douces et protégées. Disponible en 12 teintes tendance.',
    price: 29.99,
    category: 'Cosmetics',
    subcategory: 'makeup',
    brand: 'Luxury Beauty',
    images: [
      'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.8,
    reviewCount: 124,
    stock: 15,
    sellerId: '2'
  },
  {
    id: '2',
    name: 'Sérum Anti-Âge Premium',
    description: 'Sérum concentré en acide hyaluronique et peptides pour une peau visiblement plus jeune. Formule avancée qui stimule la production de collagène et réduit les signes de l\'âge.',
    price: 89.99,
    category: 'Cosmetics',
    subcategory: 'skincare',
    brand: 'Skincare Pro',
    images: [
      'https://images.pexels.com/photos/3992132/pexels-photo-3992132.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.9,
    reviewCount: 89,
    stock: 8,
    sellerId: '2'
  },
  {
    id: '3',
    name: 'Smartphone Pro Max 256GB',
    description: 'Smartphone dernière génération avec écran OLED 6.7", triple caméra 108MP et 5G. Processeur ultra-rapide, batterie longue durée et design premium en aluminium.',
    price: 1199.99,
    category: 'Electronics',
    subcategory: 'smartphones',
    brand: 'TechBrand',
    images: [
      'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.7,
    reviewCount: 256,
    stock: 12,
    sellerId: '2'
  },
  {
    id: '4',
    name: 'Écouteurs Sans Fil Premium',
    description: 'Écouteurs Bluetooth avec réduction de bruit active et autonomie 30h. Son haute fidélité, confort optimal et résistance à l\'eau IPX4.',
    price: 299.99,
    category: 'Electronics',
    subcategory: 'audio',
    brand: 'AudioTech',
    images: [
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3945667/pexels-photo-3945667.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.6,
    reviewCount: 178,
    stock: 25,
    sellerId: '2'
  },
  {
    id: '5',
    name: 'Fond de Teint Fluide HD',
    description: 'Fond de teint haute définition pour un teint parfait toute la journée. Couvrance modulable et fini naturel.',
    price: 45.99,
    category: 'Cosmetics',
    subcategory: 'makeup',
    brand: 'Beauty Pro',
    images: [
      'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.5,
    reviewCount: 92,
    stock: 20,
    sellerId: '2'
  },
  {
    id: '6',
    name: 'Tablette Graphique Pro',
    description: 'Tablette graphique professionnelle avec stylet sensible à la pression. Idéale pour les designers et artistes.',
    price: 599.99,
    category: 'Electronics',
    subcategory: 'accessories',
    brand: 'DesignTech',
    images: [
      'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.8,
    reviewCount: 67,
    stock: 5,
    sellerId: '2'
  }
];

// Mock Orders
export const mockOrders = [
  {
    id: '1',
    clientId: '1',
    clientName: 'Marie Dupont',
    clientEmail: 'client@gdk.com',
    items: [
      {
        productId: '1',
        productName: 'Rouge à Lèvres Luxury Matte',
        quantity: 2,
        price: 29.99
      }
    ],
    total: 59.98,
    status: 'pending',
    date: '2024-01-15',
    deliveryInfo: {
      name: 'Marie Dupont',
      address: '123 Rue de la Paix, Paris',
      phone: '+33 1 23 45 67 89'
    }
  },
  {
    id: '2',
    clientId: '1',
    clientName: 'Marie Dupont',
    clientEmail: 'client@gdk.com',
    items: [
      {
        productId: '3',
        productName: 'Smartphone Pro Max 256GB',
        quantity: 1,
        price: 1199.99
      }
    ],
    total: 1199.99,
    status: 'processing',
    date: '2024-01-14',
    deliveryInfo: {
      name: 'Marie Dupont',
      address: '123 Rue de la Paix, Paris',
      phone: '+33 1 23 45 67 89'
    }
  },
  {
    id: '3',
    clientId: '1',
    clientName: 'Marie Dupont',
    clientEmail: 'client@gdk.com',
    items: [
      {
        productId: '2',
        productName: 'Sérum Anti-Âge Premium',
        quantity: 1,
        price: 89.99
      }
    ],
    total: 89.99,
    status: 'delivered',
    date: '2024-01-10',
    deliveryInfo: {
      name: 'Marie Dupont',
      address: '123 Rue de la Paix, Paris',
      phone: '+33 1 23 45 67 89'
    }
  }
];

// Mock Reviews
export const mockReviews = [
  {
    id: '1',
    productId: '1',
    customerName: 'Sophie L.',
    rating: 5,
    title: 'Excellent produit !',
    comment: 'Je recommande vivement ce produit. La qualité est au rendez-vous et le rapport qualité-prix est excellent.',
    date: '2024-01-15',
    verified: true
  },
  {
    id: '2',
    productId: '1',
    customerName: 'Pierre M.',
    rating: 4,
    title: 'Très satisfait',
    comment: 'Produit conforme à mes attentes. Livraison rapide et emballage soigné.',
    date: '2024-01-10',
    verified: true
  },
  {
    id: '3',
    productId: '2',
    customerName: 'Marie D.',
    rating: 5,
    title: 'Parfait !',
    comment: 'Exactement ce que je cherchais. Je rachèterai sans hésiter.',
    date: '2024-01-05',
    verified: false
  }
];