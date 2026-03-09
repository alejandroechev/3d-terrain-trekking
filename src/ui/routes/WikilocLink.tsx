const WIKILOC_URL = 'https://www.wikiloc.com/trails/hiking/chile/los-lagos/puerto-varas'

export function WikilocLink() {
  return (
    <a
      href={WIKILOC_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full text-xs px-3 py-2 rounded bg-emerald-800 hover:bg-emerald-700 text-white text-center"
    >
      🌐 Buscar en Wikiloc (descarga manual GPX)
    </a>
  )
}
