"use client";

import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { db } from "@/lib/firebase";
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

interface ReviewFormFirebaseProps {
  user: User | null;
}

export function ReviewFormFirebase({ user }: ReviewFormFirebaseProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

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

    if (!user) {
      alert("Per favore accedi con Google prima di lasciare una recensione.");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "reviews"), {
        name: user.displayName,
        email: user.email,
        rating: parseInt(rating.toString()),
        comment,
        userPhotoUrl: user.photoURL,
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

  if (!user) {
    return (
      <div className="text-center py-8 text-gray-600">
        <p>Per lasciare una recensione, accedi con Google.</p>
      </div>
    );
  }

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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !comment.trim()}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-semibold text-lg"
        >
          {loading ? "Invio in corso..." : "Invia Recensione"}
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
