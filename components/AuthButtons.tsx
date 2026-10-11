"use client";

import { useState } from "react";

interface User {
  name: string;
  email: string;
}

interface AuthButtonsProps {
  onLogin: (user: User) => void;
  user: User | null;
  onLogout: () => void;
}

export function AuthButtons({ onLogin, user, onLogout }: AuthButtonsProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate sending magic link
    setTimeout(() => {
      onLogin({ name, email });
      setName("");
      setEmail("");
      setLoading(false);
    }, 500);
  };

  if (user) {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full mx-auto mb-2 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <p className="font-semibold text-gray-900">
            Ciao, {user.name}!
          </p>
          <p className="text-sm text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-600">Ora puoi lasciare una recensione</p>
        </div>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
        >
          Esci
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Il tuo nome"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="La tua email"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
      >
        {loading ? "Accesso in corso..." : "✉️ Accedi"}
      </button>
    </form>
  );
}
