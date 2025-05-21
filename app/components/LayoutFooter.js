export default function LayoutFooter() {
  return (
    <footer className="text-center py-6 border-t border-white/10 bg-black/20 backdrop-blur-sm rounded-xl mx-2 mb-2 mt-2">
      <p className="text-sm text-white">
        © {new Date().getFullYear()} · Aplikacija za istraživanje TV serija · Izradila{' '}
        <span className="font-bold text-white italic">Nikolina Glavota</span>
      </p>
    </footer>
  );
}
