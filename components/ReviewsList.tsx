"use client";

interface Review {
  id: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewsListProps {
  reviews: Review[];
}

export function ReviewsList({ reviews }: ReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center text-gray-500">
        Nessuna recensione ancora. Sii il primo!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
              {review.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-gray-900">
                  {review.name}
                </h4>
                <span className="text-sm text-gray-500">
                  {"⭐".repeat(review.rating)}
                </span>
              </div>
              <p className="text-gray-700 text-sm">{review.comment}</p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(review.createdAt).toLocaleDateString("it-IT")}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
