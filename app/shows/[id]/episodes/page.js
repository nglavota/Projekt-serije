import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

async function fetchEpisodes(showId) {
  const response = await fetch(`https://api.tvmaze.com/shows/${showId}/episodes`);

  if (response.status === 404) notFound(); // Ako dani show id nije pronađen
  if (!response.ok) throw new Error('Greška pri dohvaćanju epizoda!');

  const data = await response.json();
  if (!data || data.length === 0) notFound(); // Ako nema epizoda

  return data;
}

export default async function EpisodesPage({ params }) {
  const { id } = await params; 
  const episodes = await fetchEpisodes(id);

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">Epizode</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {episodes.map((episode) => (
          <Link
            key={episode.id}
            href={`/shows/${id}/episodes/${episode.id}`}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-4 flex flex-col"
          >
            <div className="relative w-full h-48 mb-4 rounded overflow-hidden">
              <Image
                src={episode.image?.medium || '/default-image.jpg'}
                alt={episode.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover"
                priority
              />
            </div>
            <h2 className="text-lg font-semibold text-indigo-800 mb-1">{episode.name}</h2>
            <p className="text-sm text-gray-600">
              Sezona {episode.season}, Epizoda {episode.number}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
