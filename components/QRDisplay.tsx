"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const STORE_LINKS = {
  website: "https://loutletdelgiocattolo.it/",
  instagram: "https://www.instagram.com/loutletdelgiocattolorc/",
  facebook: "https://www.facebook.com/outletdelgio/",
};

export function QRDisplay() {
  const [showMenu, setShowMenu] = useState(false);
  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
    // Generate QR code URL using qr-server API
    const currentUrl = typeof window !== "undefined" ? window.location.href : "https://qrcode-emi.vercel.app";
    const encodedUrl = encodeURIComponent(currentUrl);
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedUrl}`);
  }, []);

  const handleQRClick = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-6">
      {/* QR Code */}
      <div className="relative">
        <div
          onClick={handleQRClick}
          className="cursor-pointer p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          {qrUrl && (
            <img
              src={qrUrl}
              alt="QR Code"
              width={256}
              height={256}
              className="w-64 h-64"
            />
          )}
        </div>
        <p className="text-sm text-gray-500 text-center mt-2">
          Clicca sul QR code per le opzioni
        </p>
      </div>

      {/* Menu */}
      {showMenu && (
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full animate-in">
          <h2 className="text-xl font-bold mb-4 text-center">
            Scegli dove visitarci
          </h2>
          <div className="grid grid-cols-1 gap-3">
            <a
              href={STORE_LINKS.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              🌐 Visita il sito
            </a>
            <a
              href={STORE_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium"
            >
              📷 Instagram
            </a>
            <a
              href={STORE_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              👍 Facebook
            </a>
          </div>
          <button
            onClick={handleQRClick}
            className="w-full mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Chiudi
          </button>
        </div>
      )}
    </div>
  );
}
