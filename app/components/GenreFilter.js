'use client';

import { useState } from 'react';

// Lista žanrova koje ću prikazati kao checkbox-ove
const genres = [
  'Action', 'Adventure', 'Anime', 'Comedy', 'Crime', 'Drama', 'Horror', 'History', 'Family',
  'Fantasy', 'Legal', 'Medical', 'Mystery', 'Romance', 'Science-Fiction',
  'Sports', 'Supernatural', 'Thriller', 'War', 'Western'
];

// Komponenta za filtriranje serija po žanrovima
export default function GenreFilter({ selectedGenres, onChange }) {
  // State koji upravlja vidljivošću filtera
  const [showFilters, setShowFilters] = useState(false);

  // Funkcija za uključivanje/isključivanje pojedinog žanra
  const toggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      // Ako je već odabran - makni ga
      onChange(selectedGenres.filter(g => g !== genre));
    } else {
      // Ako nije - dodaj ga
      onChange([...selectedGenres, genre]);
    }
  };

  return (
    <section className="mb-4">
      {/* Gumb za otvaranje/zatvaranje prikaza žanrova */}
      <button
        onClick={() => setShowFilters(prev => !prev)}
        className="bg-purple-300 text-black font-semibold px-4 py-2 rounded hover:bg-purple-400 transition"
      >
        {showFilters ? "❌ Zatvori" : "Filtriraj po žanrovima"}
      </button>

      {/* Prikaz checkbox-ova ako su filteri otvoreni */}
      {showFilters && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {genres.map((genre) => (
            <label
              key={genre}
              className="flex items-center bg-gray-800/70 px-2 py-1 rounded hover:bg-gray-700 transition cursor-pointer"
            >
              {/* Checkbox za pojedini žanr */}
              <input
                type="checkbox"
                checked={selectedGenres.includes(genre)} // Označen ako je žanr odabran
                onChange={() => toggleGenre(genre)} // Mijenja stanje kada se klikne
                className="accent-yellow-400 mr-2 w-4 h-4"
              />
              {/* Naziv žanra */}
              <span className="text-sm text-white truncate">{genre}</span>
            </label>
          ))}
        </div>
      )}
    </section>
  );
}
