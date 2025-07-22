'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Trash2, Plus, Minus, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const router = useRouter();
  const { 
    user, 
    cart, 
    products, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    createOrder 
  } = useApp();

  const [deliveryInfo, setDeliveryInfo] = useState({
    name: '',
    address: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      toast.error('Veuillez vous connecter pour accéder au checkout');
      router.push('/login');
    }
  }, [user, router]);

  // Get cart items with product details
  const cartItems = cart.map(cartItem => {
    const product = products.find(p => p.id === cartItem.productId);
    return {
      ...cartItem,
      product
    };
  }).filter(item => item.product);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product!.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + shipping;

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateCartQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
    toast.success('Produit retiré du panier');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeliveryInfo(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!deliveryInfo.name || !deliveryInfo.address || !deliveryInfo.phone) {
      toast.error('Veuillez remplir tous les champs de livraison');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Votre panier est vide');
      return;
    }

    setLoading(true);

    try {
      // Create order
      const orderData = {
        clientId: user!.id,
        clientName: user!.name,
        clientEmail: user!.email,
        items: cartItems.map(item => ({
          productId: item.productId,
          productName: item.product!.name,
          quantity: item.quantity,
          price: item.product!.price
        })),
        total,
        status: 'pending' as const,
        deliveryInfo
      };

      createOrder(orderData);
      clearCart();
      
      toast.success('Commande passée avec succès !');
      router.push('/order-confirmation');
    } catch (error) {
      toast.error('Erreur lors de la commande');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/products" className="hover:text-blue-600 flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Continuer les achats
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Votre Panier ({cartItems.length} article{cartItems.length > 1 ? 's' : ''})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cartItems.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Votre panier est vide
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Ajoutez des produits pour commencer vos achats
                    </p>
                    <Link href="/products">
                      <Button>Découvrir nos produits</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.productId} className="flex gap-4 p-4 border rounded-lg">
                        <img
                          src={item.product!.images[0]}
                          alt={item.product!.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {item.product!.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {item.product!.brand}
                          </p>
                          <p className="text-lg font-bold text-gray-900">
                            {item.product!.price.toFixed(2)}€
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="flex items-center border rounded-lg">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="rounded-r-none"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="px-3 py-2 text-center min-w-[3rem] border-x">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                              disabled={item.quantity >= item.product!.stock}
                              className="rounded-l-none"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.productId)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary & Delivery Form */}
          <div className="space-y-6">
            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informations de livraison</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePlaceOrder} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nom complet</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={deliveryInfo.name}
                      onChange={handleInputChange}
                      placeholder="Votre nom complet"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Adresse de livraison</Label>
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      value={deliveryInfo.address}
                      onChange={handleInputChange}
                      placeholder="Votre adresse complète"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={deliveryInfo.phone}
                      onChange={handleInputChange}
                      placeholder="Votre numéro de téléphone"
                      required
                    />
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Résumé de la commande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{subtotal.toFixed(2)}€</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Livraison</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600">Gratuite</span>
                    ) : (
                      `${shipping.toFixed(2)}€`
                    )}
                  </span>
                </div>
                
                {subtotal > 0 && subtotal < 100 && (
                  <p className="text-sm text-gray-600">
                    Livraison gratuite à partir de 100€
                  </p>
                )}
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{total.toFixed(2)}€</span>
                </div>
                
                <Button
                  onClick={handlePlaceOrder}
                  disabled={loading || cartItems.length === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  {loading ? 'Commande en cours...' : 'Passer la commande'}
                </Button>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Paiement sécurisé • Livraison 24-48h
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}