let favorites = []; 

export async function GET() {
  return Response.json(favorites);
}

export async function POST(request) {
  const body = await request.json();
  const { id, title, poster_path } = body;

  if (!id || !title || !poster_path) {
    return Response.json({ error: "Nedostaju podaci." }, { status: 400 });
  }

  const alreadyExists = favorites.some(fav => fav.id === id);
  if (!alreadyExists) {
    favorites.push({ id, title, poster_path });
  }

  return Response.json({ ok: true, favorites });
}

export async function DELETE(request) {
  const body = await request.json();
  const { id } = body;

  if (!id) {
    return Response.json({ error: "Nedostaje ID." }, { status: 400 });
  }

  favorites = favorites.filter(fav => fav.id !== id);
  return Response.json({ ok: true, favorites });
}
