// Privremeno spremište favorita (u memoriji servera, nestaje pri svakom restartu)
let favorites = [];

// GET metoda – vraća popis svih favorita
export async function GET() {
  return Response.json(favorites);
}

// POST metoda – dodaje novog favorita u listu
export async function POST(request) {
  const body = await request.json();
  const { id, title, poster_path } = body;

  // Provjera valjanosti podataka – svi parametri moraju biti prisutni
  if (!id || !title || !poster_path) {
    return Response.json({ error: "Nedostaju podaci." }, { status: 400 });
  }

  // Provjera je li serija već dodana u favorite
  const alreadyExists = favorites.some(fav => fav.id === id);
  if (!alreadyExists) {
    favorites.push({ id, title, poster_path });
  }

  // Vraćamo trenutni popis favorita
  return Response.json({ ok: true, favorites });
}

// DELETE metoda – briše seriju iz favorita na temelju ID-a
export async function DELETE(request) {
  const body = await request.json(); 
  const { id } = body;

  // Provjera je li ID dodan prije u favorite
  if (!id) {
    return Response.json({ error: "Nedostaje ID." }, { status: 400 });
  }

  // Filtriramo favorite i uklanjamo onoga čiji ID odgovara
  favorites = favorites.filter(fav => fav.id !== id);

  // Vraćamo ažurirani popis favorita
  return Response.json({ ok: true, favorites });
}
