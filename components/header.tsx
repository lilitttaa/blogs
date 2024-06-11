import Link from 'next/link'
import React from 'react'
export default function Header () {
  return (
    <header className='flex flex-row pl-[24%] pr-80 pt-4 pb-4 justify-start'>
      <nav className='flex flex-row gap-16'>
        <Link href={`/`}>
          <div>HOME</div>
        </Link>
        <Link href={`/`}>
          <div>BLOG</div>
        </Link>
        <Link href={`/portfolio`}>
          <div>PORTFOLIO</div>
        </Link>
        <Link href={`/about`}>
          <div>ABOUT</div>
        </Link>
      </nav>
    </header>
  )
}
