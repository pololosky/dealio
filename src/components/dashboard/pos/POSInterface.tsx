"use client";

import { useState } from "react";
import { Search, ShoppingCart, Trash2, Plus, Minus, CheckCircle } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface CartItem extends Product {
  quantity: number;
}

interface POSInterfaceProps {
  products: Product[];
  userId: string;
}

export default function POSInterface({ products, userId }: POSInterfaceProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  // Filtrer les produits selon la recherche
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ajouter un produit au panier
  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      // Vérifier si on peut augmenter la quantité
      if (existingItem.quantity >= product.stock) {
        setError(`Stock insuffisant pour ${product.name}`);
        setTimeout(() => setError(""), 3000);
        return;
      }
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Augmenter la quantité
  const increaseQuantity = (productId: string) => {
    const item = cart.find((i) => i.id === productId);
    if (item && item.quantity >= item.stock) {
      setError(`Stock insuffisant pour ${item.name}`);
      setTimeout(() => setError(""), 3000);
      return;
    }

    setCart(
      cart.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Diminuer la quantité
  const decreaseQuantity = (productId: string) => {
    setCart(
      cart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Retirer du panier
  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  // Vider le panier
  const clearCart = () => {
    setCart([]);
  };

  // Calculer le total
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Valider la vente
  const handleCheckout = async () => {
    if (cart.length === 0) {
      setError("Le panier est vide");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erreur lors de la vente");
      }

      // Succès !
      setShowSuccess(true);
      setCart([]);

      setTimeout(() => {
        setShowSuccess(false);
        window.location.reload(); // Recharger pour mettre à jour les stocks
      }, 2000);
    } catch (err: any) {
      setError(err.message);
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Colonne gauche : Produits */}
      <div className="lg:col-span-2 space-y-4">
        {/* Recherche */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
              <input
                type="search"
                placeholder="Rechercher un produit..."
                className="input input-bordered w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Grille de produits */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 overflow-y-auto">
              {filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-12 text-base-content/60">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Aucun produit disponible</p>
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className="btn btn-outline h-auto flex-col items-start p-4 hover:shadow-xl"
                  >
                    <div className="w-full">
                      <p className="font-semibold text-left truncate">
                        {product.name}
                      </p>
                      <p className="text-lg font-bold text-primary">
                        {product.price} FCFA
                      </p>
                      <p className="text-xs text-base-content/60">
                        Stock: {product.stock}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Colonne droite : Panier */}
      <div className="space-y-4">
        <div className="card bg-base-100 shadow-md sticky top-6">
          <div className="card-body p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Panier ({cart.length})
              </h3>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="btn btn-ghost btn-sm text-error"
                  disabled={loading}
                >
                  Vider
                </button>
              )}
            </div>

            {/* Messages */}
            {error && (
              <div className="alert alert-error mb-4">
                <span className="text-sm">{error}</span>
              </div>
            )}

            {showSuccess && (
              <div className="alert alert-success mb-4">
                <CheckCircle className="w-5 h-5" />
                <span>Vente enregistrée avec succès !</span>
              </div>
            )}

            {/* Liste du panier */}
            <div className="space-y-2 overflow-y-auto mb-4">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-base-content/60">
                  <p className="text-sm">Panier vide</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 p-3 bg-base-200 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-base-content/60">
                        {item.price.toFixed(2)}€ × {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="btn btn-ghost btn-xs btn-circle"
                        disabled={loading}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold px-2">{item.quantity}</span>
                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="btn btn-ghost btn-xs btn-circle"
                        disabled={loading}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="btn btn-ghost btn-xs btn-circle text-error"
                      disabled={loading}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <div className="font-bold">
                      {(item.price * item.quantity)} FCFA
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold">Total</span>
                <span className="text-3xl font-bold text-primary">
                  {total} FCFA
                </span>
              </div>

              {/* Bouton de validation */}
              <button
                onClick={handleCheckout}
                className="btn btn-primary w-full btn-lg"
                disabled={cart.length === 0 || loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Traitement...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Valider la vente
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}