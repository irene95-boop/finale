'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  images?: string[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/api/products'); // <-- URL EXTERNE
        setProducts(res.data.products);
      } catch (err) {
        console.error('Erreur récupération produits:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Tous les Produits</h1>

      {loading ? (
        <p className="text-center text-gray-600">Chargement...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-600">Aucun produit disponible</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link key={product._id} href={`/products/${product._id}`}>
              <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition-all cursor-pointer">
                <img
                  src={product.images?.[0] || '/placeholder.jpg'}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{product.category}</p>
                  <p className="text-blue-600 font-bold">{product.price} €</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
