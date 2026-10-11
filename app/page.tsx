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
  const [scanned, setScanned] = useState(false);
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

    if (typeof window !== "undefined") {
      localStorage.setItem("reviews", JSON.stringify(updatedReviews));
    }
  };

  if (!mounted) return null;

  // First screen: QR code only
  if (!scanned) {
    return (
      <main className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-8 max-w-md">
          {/* QR Code */}
          <div
            onClick={() => setScanned(true)}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          >
            <QRDisplay />
          </div>

          {/* Simple message */}
          <p className="text-gray-700 text-lg font-light">
            Scannerizza il codice QR
          </p>
        </div>
      </main>
    );
  }

  // Second screen: menu and options
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Back button */}
        <button
          onClick={() => setScanned(false)}
          className="mb-8 text-gray-600 hover:text-gray-900 text-sm font-medium"
        >
          ← Indietro
        </button>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            L'outlet del Giocattolo
          </h1>
          <p className="text-gray-600">Reggio Calabria</p>
        </div>

        <div className="space-y-8">
          {/* Login Section */}
          {!user && (
            <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Accedi</h2>
              <AuthButtons onLogin={handleLogin} user={user} onLogout={handleLogout} />
            </div>
          )}

          {/* User Info */}
          {user && (
            <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Benvenuto</p>
                  <p className="text-lg font-semibold text-gray-900">{user.name}</p>
                </div>
                <button
                  onClick={() => handleLogout()}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Esci
                </button>
              </div>
            </div>
          )}

          {/* Review Form */}
          {user && (
            <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Lascia una recensione</h2>
              <ReviewForm
                userName={user.name}
                userEmail={user.email}
                onSubmit={handleReviewSubmit}
              />
            </div>
          )}

          {/* Reviews List */}
          {reviews.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Recensioni ({reviews.length})</h2>
              <ReviewsList reviews={reviews} />
            </div>
          )}

          {/* Social Links */}
          <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Seguici</h2>
            <div className="grid grid-cols-1 gap-3">
              <a
                href="https://www.instagram.com/loutletdelgiocattolorc/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow font-medium"
              >
                Instagram
              </a>
              <a
                href="https://www.facebook.com/outletdelgio/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:shadow-lg transition-shadow font-medium"
              >
                Facebook
              </a>
            </div>
          </div>

          {/* Footer Info */}
          <div className="text-center text-gray-600 text-sm space-y-1 pb-8">
            <p>Viale Calabria, 356</p>
            <p>89132 Reggio di Calabria (RC)</p>
            <p>+39 320 317 5135</p>
            <p className="pt-2">Lunedì - Domenica: 09:00 - 20:30</p>
          </div>
        </div>
      </div>
    </main>
  );
}
