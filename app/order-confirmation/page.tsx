'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Truck, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useApp } from '@/contexts/AppContext';

export default function OrderConfirmationPage() {
  const router = useRouter();
  const { user } = useApp();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Commande Confirmée !
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Merci pour votre commande. Nous avons bien reçu votre demande et nous la préparons.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="p-6">
              <Package className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Préparation</h3>
              <p className="text-sm text-gray-600">
                Votre commande est en cours de préparation dans nos entrepôts
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Truck className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Expédition</h3>
              <p className="text-sm text-gray-600">
                Livraison prévue sous 24-48h à votre adresse
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <CreditCard className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Paiement</h3>
              <p className="text-sm text-gray-600">
                Paiement sécurisé traité avec succès
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Prochaines étapes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-semibold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Confirmation par email</h4>
                  <p className="text-gray-600 text-sm">
                    Vous recevrez un email de confirmation avec les détails de votre commande
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-semibold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Suivi de commande</h4>
                  <p className="text-gray-600 text-sm">
                    Un numéro de suivi vous sera envoyé dès l'expédition de votre colis
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-semibold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Livraison</h4>
                  <p className="text-gray-600 text-sm">
                    Réception de votre commande à l'adresse indiquée sous 24-48h
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button variant="outline" size="lg">
                Continuer les achats
              </Button>
            </Link>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Voir mes commandes
            </Button>
          </div>
          
          <p className="text-sm text-gray-600">
            Une question ? Contactez notre service client au{' '}
            <a href="tel:+33123456789" className="text-blue-600 hover:underline">
              01 23 45 67 89
            </a>
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}