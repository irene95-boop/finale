'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Plus,
  Edit,
  Trash2,
  Eye,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useApp } from '@/contexts/AppContext';
import { ProductForm } from '@/components/dashboard/ProductForm';
import { OrderManagement } from '@/components/dashboard/OrderManagement';
import { toast } from 'sonner';

export default function DashboardPage() {
  const router = useRouter();
  const { user, products, orders, deleteProduct } = useApp();
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  useEffect(() => {
    if (!user || user.role !== 'seller') {
      toast.error('Accès non autorisé');
      router.push('/login');
    }
  }, [user, router]);

  if (!user || user.role !== 'seller') {
    return null;
  }

  // Filter products and orders for current seller
  const sellerProducts = products.filter(p => p.sellerId === user.id);
  const sellerOrders = orders.filter(order => 
    order.items.some(item => {
      const product = products.find(p => p.id === item.productId);
      return product?.sellerId === user.id;
    })
  );

  // Calculate stats
  const totalRevenue = sellerOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = sellerOrders.length;
  const totalProducts = sellerProducts.length;
  const pendingOrders = sellerOrders.filter(order => order.status === 'pending').length;

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      deleteProduct(productId);
      toast.success('Produit supprimé avec succès');
    }
  };

  const handleCloseForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Tableau de Bord Vendeur
          </h1>
          <p className="text-lg text-gray-600">
            Bienvenue, {user.name} ! Gérez vos produits et commandes.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Chiffre d'affaires</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {totalRevenue.toFixed(2)}€
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Commandes</p>
                  <p className="text-3xl font-bold text-gray-900">{totalOrders}</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Produits</p>
                  <p className="text-3xl font-bold text-gray-900">{totalProducts}</p>
                </div>
                <Package className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En attente</p>
                  <p className="text-3xl font-bold text-gray-900">{pendingOrders}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products">Gestion des Produits</TabsTrigger>
            <TabsTrigger value="orders">Gestion des Commandes</TabsTrigger>
          </TabsList>

          {/* Products Management */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Mes Produits ({sellerProducts.length})</CardTitle>
                  <Button 
                    onClick={() => setShowProductForm(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un produit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {sellerProducts.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Aucun produit
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Commencez par ajouter votre premier produit
                    </p>
                    <Button onClick={() => setShowProductForm(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter un produit
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sellerProducts.map((product) => (
                      <Card key={product.id} className="overflow-hidden">
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-gray-900 line-clamp-2">
                              {product.name}
                            </h3>
                            <Badge variant="outline">
                              {product.category}
                            </Badge>
                          </div>
                          
                          <p className="text-2xl font-bold text-gray-900 mb-2">
                            {product.price.toFixed(2)}€
                          </p>
                          
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-gray-600">
                              Stock: {product.stock}
                            </span>
                            <div className="flex items-center text-yellow-400">
                              <span className="text-sm text-gray-600">
                                {product.rating.toFixed(1)} ⭐
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditProduct(product)}
                              className="flex-1"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Modifier
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Management */}
          <TabsContent value="orders">
            <OrderManagement orders={sellerOrders} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <ProductForm
          product={editingProduct}
          onClose={handleCloseForm}
        />
      )}
      
      <Footer />
    </div>
  );
}