"use client";

import { useState } from "react";

interface ReviewData {
  name: string;
  email: string;
  rating: number;
  comment: string;
}

export function ReviewFormSimple() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save to localStorage
      const reviews = JSON.parse(localStorage.getItem("reviews") || "[]");
      const newReview = {
        id: Date.now().toString(),
        name,
        email,
        rating: parseInt(rating.toString()),
        comment,
        createdAt: new Date().toISOString(),
      };
      reviews.unshift(newReview);
      localStorage.setItem("reviews", JSON.stringify(reviews));

      setSuccess(true);
      setName("");
      setEmail("");
      setComment("");
      setRating(5);

      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving review:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Nome
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Il tuo nome"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="La tua email"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

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
        <p className="text-sm text-gray-600 mt-2">{rating} stella{rating !== 1 ? "e" : "a"}</p>
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
        disabled={loading}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-semibold text-lg"
      >
        {loading ? "Invio in corso..." : "Invia Recensione"}
      </button>

      {/* Success Message */}
      {success && (
        <div className="p-4 bg-green-100 text-green-800 rounded-lg text-center font-medium">
          Grazie! La tua recensione è stata salvata.
        </div>
      )}
    </form>
  );
}
