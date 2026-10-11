"use client";

import { useState } from "react";

interface Review {
  id: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewFormProps {
  userName: string;
  userEmail: string;
  onSubmit: (review: Omit<Review, "id" | "createdAt">) => void;
}

export function ReviewForm({ userName, userEmail, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      onSubmit({
        name: userName,
        email: userEmail,
        rating: parseInt(rating.toString()),
        comment,
      });
      setComment("");
      setRating(5);
      setSuccess(true);
      setLoading(false);
      setTimeout(() => setSuccess(false), 3000);
    }, 300);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Valutazione (stelle)
        </label>
        <select
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          <option value={1}>⭐ 1 stella</option>
          <option value={2}>⭐⭐ 2 stelle</option>
          <option value={3}>⭐⭐⭐ 3 stelle</option>
          <option value={4}>⭐⭐⭐⭐ 4 stelle</option>
          <option value={5}>⭐⭐⭐⭐⭐ 5 stelle</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          La tua opinione
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Racconta la tua esperienza con L'outlet del giocattolo..."
          required
          minLength={10}
          maxLength={500}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
          rows={4}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:bg-gray-400 transition-colors font-medium"
      >
        {loading ? "Invio in corso..." : "Invia Recensione"}
      </button>

      {success && (
        <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm">
          Grazie! La tua recensione è stata pubblicata.
        </div>
      )}
    </form>
  );
}
