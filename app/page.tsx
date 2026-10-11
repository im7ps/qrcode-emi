"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
    const reviewPageUrl = typeof window !== "undefined"
      ? `${window.location.origin}/review`
      : "https://qrcode-emi.vercel.app/review";
    const encodedUrl = encodeURIComponent(reviewPageUrl);
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodedUrl}`);
  }, []);

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-8">
        {/* QR Code */}
        <div className="flex justify-center">
          {qrUrl && (
            <img
              src={qrUrl}
              alt="QR Code"
              width={500}
              height={500}
              className="w-96 h-96 shadow-lg"
            />
          )}
        </div>

        {/* Message */}
        <p className="text-gray-700 text-lg font-light">
          Scannerizza il codice QR
        </p>
      </div>
    </main>
  );
}
