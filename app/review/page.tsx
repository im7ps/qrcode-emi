import { ReviewFormSimple } from "@/components/ReviewFormSimple";

export const metadata = {
  title: "Lascia una Recensione - L'outlet del Giocattolo",
  description: "Condividi la tua esperienza con L'outlet del Giocattolo di Reggio Calabria",
};

export default function ReviewPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            L'outlet del Giocattolo
          </h1>
          <p className="text-gray-600 mb-1">Reggio Calabria</p>
          <p className="text-sm text-gray-500">Viale Calabria, 356</p>
        </div>

        {/* Review Form Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Lascia una Recensione</h2>
          <p className="text-gray-600 text-sm mb-6">
            Condividi la tua esperienza e aiuta gli altri clienti a scoprire il nostro negozio.
          </p>
          <ReviewFormSimple />
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          {/* Website */}
          <a
            href="https://loutletdelgiocattolo.it"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl">🌐</div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Visita il Sito</h3>
              <p className="text-sm text-gray-600">www.loutletdelgiocattolo.it</p>
            </div>
            <div className="text-gray-400">→</div>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/loutletdelgiocattolorc/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl">📸</div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Instagram</h3>
              <p className="text-sm text-gray-600">@loutletdelgiocattolorc</p>
            </div>
            <div className="text-gray-400">→</div>
          </a>

          {/* Facebook */}
          <a
            href="https://www.facebook.com/outletdelgio/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl">👥</div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Facebook</h3>
              <p className="text-sm text-gray-600">L'outlet del Giocattolo</p>
            </div>
            <div className="text-gray-400">→</div>
          </a>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-600 text-sm space-y-2 py-8 border-t border-gray-200">
          <p>Orari di apertura</p>
          <p className="font-medium">Lunedì - Domenica: 09:00 - 20:30</p>
          <p className="text-gray-500">Tel. +39 320 317 5135</p>
        </div>
      </div>
    </main>
  );
}
