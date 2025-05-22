// Ova komponenta se koristi za prikaz jedne TV serije u obliku kartice koja će biti na početnoj stranici app/page.js

import Link from 'next/link';
import Image from 'next/image';

export default function ShowPreview({ show }) {
  // Slika serije ako postoji, inače zadana slika koju imamo u mapi public
  const showImage = show.image?.medium || '/default-image.jpg';

  return (
    // Link koji vodi na stranicu detalja serije
    <Link
      href={`/shows/${show.id}`}
      className="show-card group block bg-gray-800 rounded-xl overflow-hidden shadow-md transform transition-all duration-300 hover:scale-105"
    >
      <div className="relative w-full">
        <Image
          src={showImage}
          alt={show.name || 'TV serija'}
          width={300}
          height={450}
          className="w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h3 className="text-white text-xl font-semibold">{show.name}</h3>
        </div>
      </div>

      {/* Donji dio s informacijama o žanrovima i ocjeni */}
      <div className="show-info h-20 flex flex-col justify-center p-2 bg-purple-700 rounded-b-xl text-white overflow-hidden">
        <p className="text-sm">{show.genres?.join(', ') || 'Nema podataka'}</p>
        <p className="text-lg font-semibold">Ocjena: {show.rating?.average || 'Nema podataka'}</p>
      </div>
    </Link>
  );
}
