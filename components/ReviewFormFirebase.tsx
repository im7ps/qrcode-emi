"use client";

import { useState, useEffect } from "react";
import { User, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";

interface Review {
  id: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  createdAt: Date;
  userPhotoUrl?: string;
}

export function ReviewFormFirebase() {
  const [user, setUser] = useState<User | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check auth state
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // Load reviews from Firestore
  useEffect(() => {
    setLoadingReviews(true);
    const q = query(
      collection(db, "reviews"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loadedReviews = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Review[];
        setReviews(loadedReviews);
        setLoadingReviews(false);
      },
      (error) => {
        console.error("Error loading reviews:", error);
        setLoadingReviews(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Se l'utente non è loggato, fai il login con Google
      let currentUser = user;
      if (!currentUser) {
        const result = await signInWithPopup(auth, googleProvider);
        currentUser = result.user;
        setUser(currentUser);
      }

      // Salva la recensione su Firestore
      await addDoc(collection(db, "reviews"), {
        name: currentUser.displayName,
        email: currentUser.email,
        rating: parseInt(rating.toString()),
        comment,
        userPhotoUrl: currentUser.photoURL,
        createdAt: Timestamp.now(),
      });

      setSuccess(true);
      setComment("");
      setRating(5);

      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving review:", error);
      alert("Errore nel salvataggio della recensione. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8">
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 pb-8 border-b border-gray-200">
        {/* Rating Stars */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Valutazione
          </label>
          <div className="flex gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-5xl transition-transform ${
                  star <= rating ? "text-yellow-400 scale-110" : "text-gray-300"
                } hover:scale-110`}
              >
                ★
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {rating} stella{rating !== 1 ? "e" : "a"}
          </p>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Il tuo commento
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Condividi la tua esperienza con L'outlet del Giocattolo..."
            required
            minLength={10}
            maxLength={500}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={5}
          />
          <p className="text-xs text-gray-500 mt-1">{comment.length}/500</p>
        </div>

        {/* User Info if logged in */}
        {user && (
          <div className="flex items-center justify-between gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3">
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div>
                <p className="text-sm font-semibold text-gray-900">{user.displayName}</p>
                <p className="text-xs text-gray-600">{user.email}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="text-xs font-medium text-red-600 hover:text-red-700 whitespace-nowrap"
            >
              Cambia account
            </button>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !comment.trim()}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-semibold text-lg"
        >
          {loading ? "Invio in corso..." : user ? "Invia Recensione" : "Accedi con Google e Invia"}
        </button>

        {/* Success Message */}
        {success && (
          <div className="p-4 bg-green-100 text-green-800 rounded-lg text-center font-medium">
            Grazie! La tua recensione è stata pubblicata.
          </div>
        )}
      </form>

      {/* Reviews List */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Tutte le Recensioni ({reviews.length})
        </h3>

        {loadingReviews ? (
          <div className="text-center text-gray-500 py-8">
            Caricamento recensioni...
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            Nessuna recensione ancora. Sii il primo!
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="p-5 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {review.userPhotoUrl && (
                    <img
                      src={review.userPhotoUrl}
                      alt={review.name}
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {review.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {review.createdAt.toLocaleDateString("it-IT")}
                        </p>
                      </div>
                      <span className="text-lg">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
