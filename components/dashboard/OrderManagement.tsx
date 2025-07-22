'use client';

import { useState } from 'react';
import { Package, Clock, Truck, CheckCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';

interface OrderManagementProps {
  orders: any[];
}

const statusConfig = {
  pending: {
    label: 'En attente',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock
  },
  processing: {
    label: 'En traitement',
    color: 'bg-blue-100 text-blue-800',
    icon: Package
  },
  delivered: {
    label: 'Livré',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle
  }
};

export function OrderManagement({ orders }: OrderManagementProps) {
  const { updateOrderStatus } = useApp();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    updateOrderStatus(orderId, newStatus as any);
    toast.success('Statut de la commande mis à jour');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Commandes Reçues ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Aucune commande
              </h3>
              <p className="text-gray-600">
                Les commandes de vos produits apparaîtront ici
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const status = statusConfig[order.status];
                const StatusIcon = status.icon;
                
                return (
                  <Card key={order.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            Commande #{order.id}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {formatDate(order.date)} • {order.clientName}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge className={status.color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {status.label}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            {selectedOrder?.id === order.id ? 'Masquer' : 'Détails'}
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Client</p>
                          <p className="font-medium">{order.clientName}</p>
                          <p className="text-sm text-gray-600">{order.clientEmail}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600">Total</p>
                          <p className="font-bold text-lg">{order.total.toFixed(2)}€</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Changer le statut</p>
                          <Select
                            value={order.status}
                            onValueChange={(value) => handleStatusUpdate(order.id, value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">En attente</SelectItem>
                              <SelectItem value="processing">En traitement</SelectItem>
                              <SelectItem value="delivered">Livré</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {selectedOrder?.id === order.id && (
                        <div className="border-t pt-4 mt-4">
                          <h4 className="font-semibold mb-3">Détails de la commande</h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h5 className="font-medium mb-2">Articles commandés</h5>
                              <div className="space-y-2">
                                {order.items.map((item: any, index: number) => (
                                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                    <div>
                                      <p className="font-medium">{item.productName}</p>
                                      <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                                    </div>
                                    <p className="font-medium">{(item.price * item.quantity).toFixed(2)}€</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h5 className="font-medium mb-2">Adresse de livraison</h5>
                              <div className="p-3 bg-gray-50 rounded">
                                <p className="font-medium">{order.deliveryInfo.name}</p>
                                <p className="text-sm text-gray-600">{order.deliveryInfo.address}</p>
                                <p className="text-sm text-gray-600">{order.deliveryInfo.phone}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}