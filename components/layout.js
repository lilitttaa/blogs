import Head from 'next/head'
// import styles from './layout.module.css'
// import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import Header from '../components/header';

const name = 'Mr. Robot'
export const siteTitle = 'Next.js Sample Website'

export default function Layout({ children, home }) {
  return (
    <div className={''}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Mr. Robert's personal blog."
        />
        <meta
          property="og:image"
          content={`https://og-image.now.sh/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
	  <Header>…</Header>
      {/* <header className={''}>
        {home ? (
          <>
            <img
              src="/images/profile.png"
              className={`${''} ${''}`}
              alt={name}
            />
            <h1 className={''}>{name}</h1>
          </>
        ) : (
          <>
            <Link href="/">
            <img
                  src="/images/profile.png"
                  className={`${''} ${''}`}
                  alt={name}
                />
            </Link>
            <h2 className={''}>
              <Link className={''} href="/">
                {name}
              </Link>
            </h2>
          </>
        )}
      </header> */}
      <main>{children}</main>
      {/* {!home && (
        <div className={''}>
          <Link href="/">
          ← Back to home
          </Link>
        </div>
      )} */}
    </div>
  )
}