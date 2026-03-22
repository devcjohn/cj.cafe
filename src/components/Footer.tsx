export const Footer = () => {
  const hash = __BUILD_HASH__
  const time = new Date(__BUILD_TIME__).toLocaleString()

  return (
    <footer className="py-4 text-center text-xs text-gray-400">
      Build {hash} &middot; {time}
    </footer>
  )
}
