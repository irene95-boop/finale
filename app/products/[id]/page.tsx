'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Heart, ShoppingCart, Star, Plus, Minus, Share2, Shield, Truck, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Mock product data (same as in listing page)
const mockProducts = [
  {
    _id: '1',
    name: 'Rouge à Lèvres Luxury Matte',
    description: 'Rouge à lèvres longue tenue avec fini mat luxueux. Formule hydratante enrichie en vitamines E et C pour des lèvres douces et protégées. Disponible en 12 teintes tendance.',
    price: 29.99,
    category: 'cosmetics',
    subcategory: 'makeup',
    brand: 'Luxury Beauty',
    images: [
      'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3992132/pexels-photo-3992132.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.8,
    reviewCount: 124,
    stock: 15,
    featured: true,
    specifications: {
      'Type': 'Rouge à lèvres mat',
      'Contenance': '3.5g',
      'Fini': 'Mat',
      'Tenue': '8 heures',
      'Ingrédients clés': 'Vitamine E, Vitamine C, Cire de carnauba'
    }
  },
  {
    _id: '2',
    name: 'Sérum Anti-Âge Premium',
    description: 'Sérum concentré en acide hyaluronique et peptides pour une peau visiblement plus jeune. Formule avancée qui stimule la production de collagène et réduit les signes de l\'âge.',
    price: 89.99,
    category: 'cosmetics',
    subcategory: 'skincare',
    brand: 'Skincare Pro',
    images: [
      'https://images.pexels.com/photos/3992132/pexels-photo-3992132.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.9,
    reviewCount: 89,
    stock: 8,
    featured: true,
    specifications: {
      'Type': 'Sérum anti-âge',
      'Contenance': '30ml',
      'Concentration': 'Acide hyaluronique 2%',
      'Usage': 'Matin et soir',
      'Ingrédients actifs': 'Acide hyaluronique, Peptides, Vitamine C'
    }
  },
  {
    _id: '3',
    name: 'Smartphone Pro Max 256GB',
    description: 'Smartphone dernière génération avec écran OLED 6.7", triple caméra 108MP et 5G. Processeur ultra-rapide, batterie longue durée et design premium en aluminium.',
    price: 1199.99,
    category: 'electronics',
    subcategory: 'smartphones',
    brand: 'TechBrand',
    images: [
      'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.7,
    reviewCount: 256,
    stock: 12,
    featured: false,
    specifications: {
      'Écran': '6.7" OLED 120Hz',
      'Stockage': '256GB',
      'RAM': '12GB',
      'Caméra': 'Triple 108MP + 12MP + 12MP',
      'Batterie': '4500mAh',
      'OS': 'Android 14',
      'Connectivité': '5G, WiFi 6, Bluetooth 5.3'
    }
  },
  {
    _id: '4',
    name: 'Écouteurs Sans Fil Premium',
    description: 'Écouteurs Bluetooth avec réduction de bruit active et autonomie 30h. Son haute fidélité, confort optimal et résistance à l\'eau IPX4.',
    price: 299.99,
    category: 'electronics',
    subcategory: 'audio',
    brand: 'AudioTech',
    images: [
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3945667/pexels-photo-3945667.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.6,
    reviewCount: 178,
    stock: 25,
    featured: false,
    specifications: {
      'Type': 'Écouteurs sans fil',
      'Autonomie': '30h avec boîtier',
      'Réduction de bruit': 'Active (ANC)',
      'Résistance': 'IPX4',
      'Connectivité': 'Bluetooth 5.2',
      'Drivers': '40mm dynamiques'
    }
  }
];

// Mock reviews data
const mockReviews = [
  {
    id: '1',
    customerName: 'Marie L.',
    rating: 5,
    title: 'Excellent produit !',
    comment: 'Je recommande vivement ce produit. La qualité est au rendez-vous et le rapport qualité-prix est excellent.',
    date: '2024-01-15',
    verified: true
  },
  {
    id: '2',
    customerName: 'Pierre M.',
    rating: 4,
    title: 'Très satisfait',
    comment: 'Produit conforme à mes attentes. Livraison rapide et emballage soigné.',
    date: '2024-01-10',
    verified: true
  },
  {
    id: '3',
    customerName: 'Sophie D.',
    rating: 5,
    title: 'Parfait !',
    comment: 'Exactement ce que je cherchais. Je rachèterai sans hésiter.',
    date: '2024-01-05',
    verified: false
  }
];

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    // Simulate API call
    const productId = params.id as string;
    const foundProduct = mockProducts.find(p => p._id === productId);
    
    setTimeout(() => {
      setProduct(foundProduct || null);
      setLoading(false);
    }, 500);
  }, [params.id]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Veuillez vous connecter pour ajouter au panier');
      return;
    }

    if (!product) return;

    try {
      for (let i = 0; i < quantity; i++) {
        await addToCart(product._id);
      }
      toast.success(`${quantity} produit(s) ajouté(s) au panier !`);
    } catch (error) {
      toast.error('Erreur lors de l\'ajout au panier');
    }
  };

  const toggleFavorite = () => {
    if (!user) {
      toast.error('Veuillez vous connecter pour ajouter aux favoris');
      return;
    }

    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Lien copié dans le presse-papiers');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h1>
            <p className="text-gray-600 mb-8">Le produit que vous recherchez n'existe pas.</p>
            <Link href="/products">
              <Button>Retour aux produits</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/products" className="hover:text-blue-600 flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Retour aux produits
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-xl bg-white shadow-lg">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index 
                        ? 'border-blue-500 ring-2 ring-blue-200' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-3">
                {product.brand}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    {product.rating.toFixed(1)} ({product.reviewCount} avis)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  {product.price.toFixed(2)}€
                </span>
                {product.stock <= 5 && (
                  <Badge variant="secondary" className="text-orange-600 bg-orange-100">
                    Plus que {product.stock} en stock
                  </Badge>
                )}
              </div>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed">
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Quantité:</span>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="rounded-r-none"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="px-4 py-2 text-center min-w-[3rem] border-x">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="rounded-l-none"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
              </Button>
              
              <Button
                variant="outline"
                onClick={toggleFavorite}
                className="px-4 py-3"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              
              <Button
                variant="outline"
                onClick={handleShare}
                className="px-4 py-3"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Garantie 2 ans</p>
              </div>
              <div className="text-center">
                <Truck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Livraison 24h</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Retour 30 jours</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="specifications">Caractéristiques</TabsTrigger>
                <TabsTrigger value="reviews">Avis ({product.reviewCount})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-6">
                <div className="prose max-w-none">
                  <h3 className="text-xl font-semibold mb-4">Description détaillée</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                  <div className="mt-6">
                    <h4 className="font-semibold mb-2">Points forts :</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>Qualité premium garantie</li>
                      <li>Testé et approuvé par nos experts</li>
                      <li>Livraison rapide et sécurisée</li>
                      <li>Service client disponible 7j/7</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="specifications" className="mt-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Caractéristiques techniques</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications || {}).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-700">{key}:</span>
                        <span className="text-gray-600">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-6">
                <div>
                  <h3 className="text-xl font-semibold mb-6">Avis clients</h3>
                  
                  {/* Reviews Summary */}
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-4xl font-bold text-gray-900">
                        {product.rating.toFixed(1)}
                      </div>
                      <div>
                        <div className="flex items-center text-yellow-400 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-600">
                          Basé sur {product.reviewCount} avis
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Individual Reviews */}
                  <div className="space-y-6">
                    {mockReviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-100 pb-6">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">
                              {review.customerName}
                            </span>
                            {review.verified && (
                              <Badge variant="secondary" className="text-xs">
                                Achat vérifié
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.date).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-yellow-400 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        
                        <h4 className="font-medium text-gray-900 mb-2">
                          {review.title}
                        </h4>
                        
                        <p className="text-gray-600">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}