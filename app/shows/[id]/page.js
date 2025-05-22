// Stranica prikazuje detalje o pojedinačnoj TV seriji na temelju ID-ja.
//Dohvaća se serija iz vanjskog API-ja (TVmaze), prikazuju se osnovne informacije i korisnik može dodati seriju u 
// favorite.


import Image from 'next/image';
import { notFound } from 'next/navigation';
import FavoriteButton from '@/app/components/FavoriteButton';

// Generira SEO metapodatke za seriju (naslov, opis, slika)
// Ovdje ne koristimo `cache: 'no-store'` jer se podaci o serijama rijetko mijenjaju, pa su sigurni za cache
export async function generateMetadata({ params }) {
  const { id } = await params;

  // Dohvaćamo podatke o seriji 
  const response = await fetch(`https://api.tvmaze.com/shows/${id}`);
  if (!response.ok) {
    // Ako API vrati grešku (npr. ID ne postoji), vraćamo osnovne metapodatke za 404 prikaz
    return {
      title: "Serija nije pronađena",
      description: "Pokušali ste pristupiti nepostojećoj seriji.",
    };
  }

  const show = await response.json();
  const image = show.image?.original || "/default-image.jpg"; // Ako API ne vrati sliku, koristimo zadanu

  return {
    title: `Serija │ ${show.name}`,
    description: show.summary
      ? show.summary.replace(/<[^>]+>/g, "").slice(0, 160) // Brišemo HTML tagove iz summary-ja
      : "Opis nije dostupan.",
    openGraph: {
      images: [{ url: image, width: 800, height: 450 }],
    }
  };
}

// Serverska funkcija koja dohvaća podatke o seriji iz vanjskog API-ja (TVmaze)
// Ako API vrati grešku (npr. ID ne postoji), poziva se notFound() iz Next.js navigacije
// To automatski prikazuje moju app/not-found.js stranicu 

async function fetchShowDetails(id) {
  const response = await fetch(`https://api.tvmaze.com/shows/${id}`);
  if (!response.ok) {
    notFound(); // Funkcija iz Next.js navigacije koja baca 404
  }
  const show = await response.json();
  return show;
}

// Komponenta stranice s detaljima o seriji
export default async function ShowDetailPage({ params }) {
  const { id } = await params;

  // Dohvaćanje podataka o seriji s TVmaze API-ja
  const show = await fetchShowDetails(id);

  // Ako API ne vrati sliku, koristi se zadana koja nam se nalazi u mapi public
  const showImage = show.image?.original || '/default-image.jpg';

  return (
    <main className="min-h-screen text-white p-4 sm:p-6 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-gradient-to-br from-violet-100 via-indigo-100 to-blue-100 text-gray-800 p-4 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border border-indigo-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-indigo-800 mb-6 sm:mb-8 break-words">
          {show.name}
        </h1>

        <div className="flex flex-col md:flex-row gap-6 mb-6 sm:mb-8 items-center md:items-start">
          {/* Prikaz slike*/}
          <div className="w-[200px] sm:w-[250px] h-[300px] sm:h-[350px] relative rounded-xl overflow-hidden shadow-md">
            <Image
              src={showImage}
              alt={show.name || 'TV serija'}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 250px"
              className="object-cover object-top"
            />
          </div>

          {/* Prikaz osnovnih informacija o seriji */}
          {/* Korištenje dangerouslySetInnerHTML je sigurno jer podaci dolaze iz kontroliranog API-ja */}
          <div className="flex-1 text-sm sm:text-base text-indigo-900 space-y-2 w-full">
            <div
              dangerouslySetInnerHTML={{
                __html: show.summary || 'Opis nije dostupan',
              }}
              className="text-sm sm:text-base"
            />
            <p><strong>Žanrovi:</strong> {show.genres?.join(', ') || 'Nema podataka'}</p>
            <p><strong>Ocjena:</strong> {show.rating?.average || 'Nema podataka'}</p>
            <p><strong>Premijera:</strong> {show.premiered || 'Nema podataka'}</p>
            <p><strong>Status:</strong> {show.status || 'Nema podataka'}</p>
            <p><strong>Jezik:</strong> {show.language || 'Nema podataka'}</p>
          </div>
        </div>

        {/* Komponenta za spremanje serije u favorite */}
        <div className="text-center mt-4">
          <FavoriteButton
            id={show.id}
            title={show.name}
            poster_path={show.image?.original || ''}
          />
        </div>
      </div>
    </main>
  );
}
