// import Head from 'next/head';
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { getSortedPostsData } from '../lib/posts'
import { useRouter } from 'next/router';

export default function Home ({ allPostsData }) {
  console.log(allPostsData)
  const router = useRouter();
  return (
    <Layout home>
      <div className={`${utilStyles.imgContainer}`}>
        <span className={`${utilStyles.imgText}`}>
          WELCOME TO MR.ROBERT'S BLOG
        </span>
        <img src='/images/bg.png' className={`${utilStyles.img}`}></img>
      </div>
      {/* <section className={utilStyles.headingMd}>…</section> */}
      <main>
        <section className='pt-8 pl-[21%] pr-[21%] w-full'>
          <ul className='flex flex-col gap-8'>
            {allPostsData.map(({ id, date, title }) => (
              <li key={id} className='h-96 flex flex-row '>
                <img
                      src='/images/bg.png'
                      className='object-cover h-full w-[46%] cursor-pointer'
					  onClick={() => router.push(`/posts/${id}`)}
                    ></img>

                <div className='flex flex-col border-[1px] w-full border-gray-300 pt-8 pb-8 pl-10 pr-10'>
                  <div className='flex flex-row'>
                    <div>Avatar</div>
                    <div className='flex flex-col'>
                      <span>Admin</span>
                      <span>Mar 21, 2023 - 1min</span>
                    </div>
                  </div>
                  <Link href={`/posts/${id}`}>
                    <div>{title}</div>
                    <div>{'This is a description.'}</div>
                  </Link>
                </div>

                {/* <br /> */}
                {/* <small className={utilStyles.lightText}> */}
                {/* <Date dateString={date} /> */}
                {/* </small> */}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </Layout>
  )
}

export async function getStaticProps () {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData
    }
  }
}
