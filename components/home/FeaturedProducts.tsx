'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  rating: number;
  reviewCount: number;
  category: string;
  brand: string;
  stock: number;
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const data = await api.getProducts({ limit: 8, sort: 'rating' });
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Mock data for demonstration
      setProducts([
        {
          _id: '1',
          name: 'Rouge à Lèvres Luxury',
          price: 29.99,
          images: ['https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=400'],
          rating: 4.8,
          reviewCount: 124,
          category: 'cosmetics',
          brand: 'Luxury Beauty',
          stock: 15
        },
        {
          _id: '2',
          name: 'Sérum Anti-Âge Premium',
          price: 89.99,
          images: ['https://images.pexels.com/photos/3992132/pexels-photo-3992132.jpeg?auto=compress&cs=tinysrgb&w=400'],
          rating: 4.9,
          reviewCount: 89,
          category: 'cosmetics',
          brand: 'Skincare Pro',
          stock: 8
        },
        {
          _id: '3',
          name: 'Smartphone Pro Max',
          price: 1199.99,
          images: ['https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=400'],
          rating: 4.7,
          reviewCount: 256,
          category: 'electronics',
          brand: 'TechBrand',
          stock: 12
        },
        {
          _id: '4',
          name: 'Écouteurs Sans Fil Premium',
          price: 299.99,
          images: ['https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400'],
          rating: 4.6,
          reviewCount: 178,
          category: 'electronics',
          brand: 'AudioTech',
          stock: 25
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: string) => {
    if (!user) {
      toast.error('Veuillez vous connecter pour ajouter au panier');
      return;
    }

    try {
      await addToCart(productId);
      toast.success('Produit ajouté au panier !');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout au panier');
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Produits Vedettes
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <Card>
                  <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Produits Vedettes
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez nos produits les mieux notés et les plus populaires
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product._id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 rounded-full w-8 h-8 p-0"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
                <div className="absolute top-3 left-3">
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                    Populaire
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="mb-2">
                  <Badge variant="outline" className="text-xs">
                    {product.brand}
                  </Badge>
                </div>
                
                <Link href={`/products/${product._id}`}>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                
                <div className="flex items-center mb-2">
                  <div className="flex items-center text-yellow-400 mr-2">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">
                      {product.rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    ({product.reviewCount} avis)
                  </span>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-gray-900">
                    {product.price.toFixed(2)}€
                  </span>
                  {product.stock <= 5 && (
                    <Badge variant="secondary" className="text-orange-600 bg-orange-100">
                      Stock limité
                    </Badge>
                  )}
                </div>
                
                <Button 
                  onClick={() => handleAddToCart(product._id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/products">
            <Button size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3">
              Voir Tous les Produits
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}