"use client";

import { useState, useEffect } from "react";
import { AuthButtons } from "@/components/AuthButtons";
import { ReviewForm } from "@/components/ReviewForm";
import { ReviewsList } from "@/components/ReviewsList";
import { QRDisplay } from "@/components/QRDisplay";

interface User {
  name: string;
  email: string;
}

interface Review {
  id: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load reviews from localStorage
    const savedReviews = localStorage.getItem("reviews");
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    }
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleReviewSubmit = (reviewData: Omit<Review, "id" | "createdAt">) => {
    const newReview: Review = {
      ...reviewData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("reviews", JSON.stringify(updatedReviews));
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">
            🎁 L'outlet del Giocattolo
          </h1>
          <p className="text-xl text-gray-600">
            Reggio Calabria - I migliori giocattoli al miglior prezzo
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: QR Code */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white rounded-xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-center mb-6">
                Condividi con noi
              </h2>
              <QRDisplay />
              <p className="text-xs text-gray-400 text-center mt-6">
                Inquadra questo QR code o condividilo per visitarci
              </p>
            </div>
          </div>

          {/* Right Column: Reviews & Auth */}
          <div className="lg:col-span-2 space-y-8">
            {/* Authentication Section */}
            <div className="bg-white rounded-xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-6">✨ Accedi e Recensisci</h2>
              <AuthButtons onLogin={handleLogin} user={user} onLogout={handleLogout} />
            </div>

            {/* Review Form Section */}
            {user && (
              <div className="bg-white rounded-xl shadow-xl p-8">
                <h2 className="text-2xl font-bold mb-6">📝 Lascia una Recensione</h2>
                <ReviewForm
                  userName={user.name}
                  userEmail={user.email}
                  onSubmit={handleReviewSubmit}
                />
              </div>
            )}

            {/* Reviews List Section */}
            <div className="bg-white rounded-xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-6">⭐ Le Recensioni della Community</h2>
              <ReviewsList reviews={reviews} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-600 border-t border-gray-200 pt-8">
          <p className="mb-2">📍 Viale Calabria, 356 - 89132 Reggio di Calabria (RC)</p>
          <p className="mb-4">☎️ +39 320 317 5135</p>
          <p className="text-sm">
            Orari: Lunedì - Domenica 09:00 - 20:30
          </p>
        </div>
      </div>
    </main>
  );
}
