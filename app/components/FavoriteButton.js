"use client";
import { useState, useEffect, useTransition } from "react";

export default function FavoriteButton({ id, title, poster_path }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetch("/api/favorites")
      .then(res => res.json())
      .then(data => {
        setIsFavorite(data.some(f => f.id === id));
      });
  }, [id]);

  const handleAddFavorite = () => {
    startTransition(() => {
      fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title, poster_path }),
      }).then(() => setIsFavorite(true));
    });
  };

  return (
    <button
      onClick={handleAddFavorite}
      disabled={isFavorite || isPending}
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors duration-200 
        ${
          isFavorite
            ? "bg-green-100 text-green-800 border border-green-300 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700 text-white"
        }`}
    >
      {isFavorite ? (
        <>
          ✅ U favoritima
        </>
      ) : isPending ? (
        "⏳ Spremanje..."
      ) : (
        <>
          ❤️ Dodaj u favorite
        </>
      )}
    </button>
  );
}
