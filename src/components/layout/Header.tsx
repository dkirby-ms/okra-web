interface HeaderProps {
  title?: string
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="flex h-14 items-center border-b px-6">
      <h1 className="text-xl font-semibold">{title || 'OKR Management'}</h1>
    </header>
  )
}
