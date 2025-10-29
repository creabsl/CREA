export default function Footer() {
  return (
    <footer className="mt-12 border-t bg-white/70 backdrop-blur">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-sm text-gray-600 flex flex-col md:flex-row items-center justify-between gap-2">
        <div>
          © {new Date().getFullYear()} CREA — Central Railway Engineers Association
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="text-brand hover:text-brand-900 no-underline">Privacy</a>
          <a href="#" className="text-brand hover:text-brand-900 no-underline">Terms</a>
          <a href="#" className="text-brand hover:text-brand-900 no-underline">Contact</a>
        </div>
      </div>
    </footer>
  )
}
