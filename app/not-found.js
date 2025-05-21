import Link from "next/link";

export default function notFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md p-10 rounded-2xl shadow-2xl text-center max-w-md w-full transform transition duration-300 hover:scale-[1.02]">
        <h1 className="text-6xl font-extrabold text-white mb-2 tracking-tight">404</h1>
        <h2 className="text-3xl font-semibold text-white mb-4">Stranica nije pronađena</h2>
        <p className="text-xl italic text-indigo-100 mb-6">
          Čini se da stranica koju tražite ne postoji ili je premještena.
        </p>
        <Link
          href="/"
          className="inline-block px-5 py-2 rounded-full bg-white text-purple-800 font-semibold shadow hover:bg-gray-100 transition"
        >
          ← Povratak na početnu
        </Link>
      </div>
    </div>
  );
}
