// src/views/CheckoutView.jsx
// Checkout is handled via PaymentModal in Sidebars.jsx (CartSidebar → onCheckout).
// This file is kept as a placeholder for a dedicated checkout page if needed.
export default function CheckoutView({ cart, cartTotal, onSuccess }) {
  return (
    <div className="view">
      <div className="container-sc py4 text-center">
        <h2>Checkout</h2>
        <p className="text-muted">Please use the cart sidebar to complete your purchase.</p>
      </div>
    </div>
  );
}