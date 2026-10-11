"use client";

import { useEffect, useState } from "react";

export function QRDisplay() {
  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
    // Generate QR code URL using qr-server API
    const currentUrl = typeof window !== "undefined" ? window.location.href : "https://qrcode-emi.vercel.app";
    const encodedUrl = encodeURIComponent(currentUrl);
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodedUrl}`);
  }, []);

  return (
    <div className="flex justify-center">
      {qrUrl && (
        <img
          src={qrUrl}
          alt="QR Code"
          width={400}
          height={400}
          className="w-80 h-80"
        />
      )}
    </div>
  );
}
