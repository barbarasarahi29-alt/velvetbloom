import React from 'react';
import { X, Trash2, ShoppingBag, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext.tsx';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotal,
    cartCount,
    getWhatsAppCartUrl,
    openWhatsAppUrl,
    setActiveView,
  } = useCatalog();

  if (!isCartOpen) return null;

  const handleCheckoutWhatsApp = () => {
    const url = getWhatsAppCartUrl();
    openWhatsAppUrl(url);
  };

  const handleContinueShopping = () => {
    setIsCartOpen(false);
    setActiveView('catalog');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#381058]/10 animate-slideIn">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#381058]/10 flex items-center justify-between bg-[#FAF8F5]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#381058]" />
              <h2 className="font-serif text-lg font-bold text-[#381058]">
                Tu Carrito ({cartCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-white text-gray-400 hover:text-[#381058] transition-colors"
              aria-label="Cerrar carrito"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#C3A6FF]/40 flex items-center justify-center text-[#8668D8]">
                  <ShoppingBag className="w-8 h-8 opacity-40" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold text-[#381058]">
                    Tu carrito está vacío
                  </h3>
                  <p className="text-xs text-[#6B5B7E] mt-1 max-w-xs">
                    Descubre nuestras piezas de joyería, flores eternas y accesorios exclusivos.
                  </p>
                </div>
                <button
                  onClick={handleContinueShopping}
                  className="px-6 py-2.5 rounded-full bg-[#381058] text-white text-xs font-semibold hover:bg-[#4d1877] transition-all shadow-sm"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const img = item.product.images?.[0] || '';
                return (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3.5 rounded-2xl bg-[#FAF8F5]/80 border border-[#381058]/6 hover:border-[#8668D8]/20 transition-all"
                  >
                    {/* Item Image */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-white shrink-0 border border-[#381058]/5">
                      {img ? (
                        <img
                          src={img}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#8668D8]">
                          <Sparkles className="w-5 h-5" />
                        </div>
                      )}
                    </div>

                    {/* Info & Quantity */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="font-serif text-sm font-semibold text-[#381058] line-clamp-1">
                            {item.product.name}
                          </h4>
                          {(item.selectedColor || item.selectedSize) && (
                            <p className="text-[11px] text-[#8668D8] mt-0.5">
                              {[item.selectedColor, item.selectedSize].filter(Boolean).join(' · ')}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                          title="Eliminar producto"
                          aria-label="Eliminar producto del carrito"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price and Stepper */}
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-sans font-bold text-sm text-[#381058] tabular-nums">
                          ${(item.product.price * item.quantity).toFixed(2)}{' '}
                          <span className="text-[10px] font-normal text-gray-500">USD</span>
                        </span>

                        <div className="flex items-center bg-white border border-[#381058]/15 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="px-2.5 py-1 text-xs text-[#381058] hover:bg-[#C3A6FF]/20 font-bold transition-colors"
                            aria-label="Restar 1"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-semibold text-[#381058] tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="px-2.5 py-1 text-xs text-[#381058] hover:bg-[#C3A6FF]/20 font-bold transition-colors"
                            aria-label="Sumar 1"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#381058]/10 bg-[#FAF8F5] space-y-4">
              {/* Subtotal & Total */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-500 text-xs">
                  <span>Subtotal estimado</span>
                  <span className="tabular-nums font-medium text-[#381058]">
                    ${cartTotal.toFixed(2)} USD
                  </span>
                </div>
                <div className="flex justify-between font-serif text-lg font-bold text-[#381058] pt-1 border-t border-[#381058]/5">
                  <span>Total</span>
                  <span className="font-sans text-xl tabular-nums text-[#381058]">
                    ${cartTotal.toFixed(2)} <span className="text-xs font-normal">USD</span>
                  </span>
                </div>
              </div>

              {/* Main Button: Finalizar pedido por WhatsApp */}
              <button
                onClick={handleCheckoutWhatsApp}
                className="w-full py-4 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-[#25D366]/20 transition-all hover:scale-101 active:scale-98"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Finalizar pedido por WhatsApp</span>
              </button>

              <div className="flex items-center justify-between text-xs text-[#8668D8] pt-1">
                <button
                  onClick={handleContinueShopping}
                  className="hover:underline flex items-center gap-1 font-medium"
                >
                  <span>Continuar comprando</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={clearCart}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  Vaciar carrito
                </button>
              </div>

              <p className="text-[10px] text-center text-gray-400 pt-1">
                Al hacer clic, se abrirá WhatsApp con el resumen de tu compra listo para enviar.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
