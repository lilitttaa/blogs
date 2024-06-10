export default function Header () {
  return (
    <header className='flex flex-row pl-80 pr-80 pt-4 pb-4 justify-between'>
      <div>Input</div>
      <nav className='flex flex-row gap-16'>
        <div>HOME</div>
        <div>RECENT</div>
        <div>BLOG</div>
        <div>ABOUT</div>
      </nav>
    </header>
  )
}
