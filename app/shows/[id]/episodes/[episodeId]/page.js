import Image from 'next/image';
import { notFound } from 'next/navigation';  


export async function generateMetadata({ params }) {
  const { episodeId } = await params;

  const res = await fetch(`https://api.tvmaze.com/episodes/${episodeId}`);
  if (!res.ok) {
    return {
      title: "Epizoda nije pronađena",
      description: "Pokušali ste pristupiti nepostojećoj epizodi.",
    };
  }

  const episode = await res.json();
  const image = episode.image?.original || "/default-image.jpg";

  return {
    title: `Epizoda │ ${episode.name}`,
    description: `Sezona ${episode.season}, epizoda ${episode.number}. Trajanje: ${episode.runtime} minuta.`,
    openGraph: {
      images: [{ url: image, width: 800, height: 450 }],
    },
    twitter: {
      card: "summary_large_image",
      images: [image],
    },
  };
}


// Dohvaćanje detalja epizode prema id-u iz TVmaze API-ja
async function fetchEpisodeDetails(episodeId) {
  const response = await fetch(`https://api.tvmaze.com/episodes/${episodeId}`);

  // Ako fetch ne uspije (npr. epizoda ne postoji), vraćamo null
  if (!response.ok) return null;

  return await response.json();
}


export default async function EpisodeDetailPage({ params }) {
  const { episodeId } = await params;

  // Dohvaćamo podatke o epizodi
  const episode = await fetchEpisodeDetails(episodeId);

  // Ako epizoda nije pronađena – prikazujemo 404 stranicu
  if (!episode) return notFound();

  // Ako slika ne postoji, koristimo zadanu sliku
  const imageUrl = episode.image?.original || "/default-image.jpg";  

  return (
    <main className="min-h-screen text-white p-6 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white/10 backdrop-blur-md p-6 rounded-3xl shadow-2xl">
        {/* Naslov epizode */}
        <h1 className="text-3xl font-bold text-yellow-300 mb-4">{episode.name}</h1>

        {/* Slika epizode */}
        <div className="mb-4 flex justify-center">
          <div className="relative w-full aspect-video mb-4"> 
            <Image
              src={imageUrl}
              alt={episode.name}
              fill
              className="object-cover rounded-xl"
              sizes="(max-width: 768px) 100vw, 500px"
              priority
            />
          </div>
        </div>

        {/* Opis epizode – koristi se HTML iz API-ja pa ga treba koristiti dangerouslySetInnerHTML za prikazati  ga*/}
        <div
          className="text-white mb-4"
          dangerouslySetInnerHTML={{ __html: episode.summary || "Opis nije dostupan" }}
        />

        <hr className="my-4 border-t border-dashed border-white" />

        {/* Dodatne informacije o epizodi */}
        <div className="text-gray-300 text-sm space-y-1">
          <p><strong>Sezona:</strong> {episode.season}</p>
          <p><strong>Epizoda:</strong> {episode.number}</p>
          <p><strong>Datum emitiranja:</strong> {episode.airdate}</p>
          <p><strong>Trajanje:</strong> {episode.runtime} minuta</p>
        </div>
      </div>
    </main>
  );
}
