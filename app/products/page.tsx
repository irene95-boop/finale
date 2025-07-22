'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Heart, ShoppingCart, Star, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Mock product data
const mockProducts = [
  {
    _id: '1',
    name: 'Rouge à Lèvres Luxury Matte',
    description: 'Rouge à lèvres longue tenue avec fini mat luxueux. Formule hydratante enrichie en vitamines.',
    price: 29.99,
    category: 'cosmetics',
    subcategory: 'makeup',
    brand: 'Luxury Beauty',
    images: [
      'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.8,
    reviewCount: 124,
    stock: 15,
    featured: true
  },
  {
    _id: '2',
    name: 'Sérum Anti-Âge Premium',
    description: 'Sérum concentré en acide hyaluronique et peptides pour une peau visiblement plus jeune.',
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
    featured: true
  },
  {
    _id: '3',
    name: 'Smartphone Pro Max 256GB',
    description: 'Smartphone dernière génération avec écran OLED 6.7", triple caméra 108MP et 5G.',
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
    featured: false
  },
  {
    _id: '4',
    name: 'Écouteurs Sans Fil Premium',
    description: 'Écouteurs Bluetooth avec réduction de bruit active et autonomie 30h.',
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
    featured: false
  },
  {
    _id: '5',
    name: 'Fond de Teint Fluide HD',
    description: 'Fond de teint haute définition pour un teint parfait toute la journée.',
    price: 45.99,
    category: 'cosmetics',
    subcategory: 'makeup',
    brand: 'Beauty Pro',
    images: [
      'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.5,
    reviewCount: 92,
    stock: 20,
    featured: false
  },
  {
    _id: '6',
    name: 'Tablette Graphique Pro',
    description: 'Tablette graphique professionnelle avec stylet sensible à la pression.',
    price: 599.99,
    category: 'electronics',
    subcategory: 'accessories',
    brand: 'DesignTech',
    images: [
      'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.8,
    reviewCount: 67,
    stock: 5,
    featured: false
  }
];

const categories = [
  { value: 'all', label: 'Toutes les catégories' },
  { value: 'cosmetics', label: 'Cosmétiques' },
  { value: 'electronics', label: 'Électronique' }
];

const sortOptions = [
  { value: 'featured', label: 'Mis en avant' },
  { value: 'price-low', label: 'Prix croissant' },
  { value: 'price-high', label: 'Prix décroissant' },
  { value: 'rating', label: 'Mieux notés' },
  { value: 'newest', label: 'Plus récents' }
];

export default function ProductsPage() {
  const [products, setProducts] = useState(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<string[]>([]);
  
  const { addToCart } = useCart();
  const { user } = useAuth();

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b._id).getTime() - new Date(a._id).getTime());
        break;
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory, sortBy]);

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

  const toggleFavorite = (productId: string) => {
    if (!user) {
      toast.error('Veuillez vous connecter pour ajouter aux favoris');
      return;
    }

    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
    
    toast.success(
      favorites.includes(productId) 
        ? 'Retiré des favoris' 
        : 'Ajouté aux favoris'
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nos Produits
          </h1>
          <p className="text-lg text-gray-600">
            Découvrez notre sélection de produits cosmétiques et électroniques
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Rechercher des produits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun produit trouvé
            </h3>
            <p className="text-gray-600">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {filteredProducts.map((product) => (
              <Card key={product._id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden bg-white">
                {viewMode === 'grid' ? (
                  <>
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute top-3 right-3 flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 rounded-full w-8 h-8 p-0"
                          onClick={() => toggleFavorite(product._id)}
                        >
                          <Heart className={`w-4 h-4 ${favorites.includes(product._id) ? 'fill-red-500 text-red-500' : ''}`} />
                        </Button>
                      </div>
                      {product.featured && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                            Populaire
                          </Badge>
                        </div>
                      )}
                      {product.stock <= 5 && (
                        <div className="absolute bottom-3 left-3">
                          <Badge variant="secondary" className="text-orange-600 bg-orange-100">
                            Stock limité
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="mb-2">
                        <Badge variant="outline" className="text-xs">
                          {product.brand}
                        </Badge>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>
                      
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
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-gray-900">
                          {product.price.toFixed(2)}€
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Link href={`/products/${product._id}`} className="flex-1">
                          <Button variant="outline" className="w-full">
                            Voir Détails
                          </Button>
                        </Link>
                        <Button 
                          onClick={() => handleAddToCart(product._id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3"
                          disabled={product.stock === 0}
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </>
                ) : (
                  /* List View */
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden rounded-lg">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <Badge variant="outline" className="text-xs mb-2">
                              {product.brand}
                            </Badge>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              {product.name}
                            </h3>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-gray-600 hover:text-red-500"
                            onClick={() => toggleFavorite(product._id)}
                          >
                            <Heart className={`w-5 h-5 ${favorites.includes(product._id) ? 'fill-red-500 text-red-500' : ''}`} />
                          </Button>
                        </div>
                        
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {product.description}
                        </p>
                        
                        <div className="flex items-center mb-3">
                          <div className="flex items-center text-yellow-400 mr-4">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">
                              {product.rating.toFixed(1)} ({product.reviewCount} avis)
                            </span>
                          </div>
                          {product.stock <= 5 && (
                            <Badge variant="secondary" className="text-orange-600 bg-orange-100">
                              Stock limité
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-gray-900">
                            {product.price.toFixed(2)}€
                          </span>
                          
                          <div className="flex gap-2">
                            <Link href={`/products/${product._id}`}>
                              <Button variant="outline">
                                Voir Détails
                              </Button>
                            </Link>
                            <Button 
                              onClick={() => handleAddToCart(product._id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                              disabled={product.stock === 0}
                            >
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Ajouter au panier
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}