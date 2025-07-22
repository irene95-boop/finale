'use client';

import Link from 'next/link';
import { Sparkles, Smartphone, Headphones, Palette } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const categories = [
  {
    id: 'makeup',
    name: 'Maquillage',
    description: 'Rouge à lèvres, mascara, fond de teint',
    icon: Palette,
    color: 'from-pink-500 to-rose-500',
    href: '/products?category=cosmetics&subcategory=makeup',
    image: 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 'skincare',
    name: 'Soins de la peau',
    description: 'Crèmes, sérums, nettoyants',
    icon: Sparkles,
    color: 'from-emerald-500 to-teal-500',
    href: '/products?category=cosmetics&subcategory=skincare',
    image: 'https://images.pexels.com/photos/3992132/pexels-photo-3992132.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 'smartphones',
    name: 'Smartphones',
    description: 'Derniers modèles, accessoires',
    icon: Smartphone,
    color: 'from-blue-500 to-cyan-500',
    href: '/products?category=electronics&subcategory=smartphones',
    image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 'audio',
    name: 'Audio & Son',
    description: 'Écouteurs, enceintes, casques',
    icon: Headphones,
    color: 'from-purple-500 to-indigo-500',
    href: '/products?category=electronics&subcategory=audio',
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

export function Categories() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explorez Nos Catégories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez notre large sélection de produits cosmétiques et électroniques 
            soigneusement choisis pour vous
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link key={category.id} href={category.href}>
                <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden bg-white">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-80`} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <IconComponent className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link href="/products">
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold">
              Voir Tous les Produits
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}