"use client";

import { useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  // Remove any extension-added classes during hydration
  useEffect(() => {
    // This runs only on the client after hydration
    document.body.className = "antialiased";
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <div className="antialiased">{children}</div>
      </CartProvider>
    </AuthProvider>
  );
}
