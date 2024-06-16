// import Head from 'next/head';
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { getSortedPostsData } from '../lib/posts'
import { useRouter } from 'next/router'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import { GetStaticProps } from 'next'

export default function Home({ allPostsData }: {
  allPostsData: {
    date: string
    title: string
    id: string
	cover:string
  }[]
}) {
  console.log(allPostsData)
  const router = useRouter()
  return (
    <Layout home>
      <div className={`${utilStyles.imgContainer}`}>
        <span className='text-3xl font-serif absolute top-8'>
          WELCOME TO MR.ROBERT'S BLOG
        </span>
        <img src='/images/bg.png' className={`${utilStyles.img}`}></img>
      </div>
      {/* <section className={utilStyles.headingMd}>…</section> */}
      <main>
        <section className='pt-8 pl-[21%] pr-[21%] w-full'>
          <ul className='flex flex-col gap-8'>
            {allPostsData.map(({ id, date, title,cover }) => (
              <li key={id} className='h-[30rem] flex flex-row '>
                <img
                  src={'/images/covers/'+cover}
                  className='object-cover h-full w-[46%] cursor-pointer'
                  onClick={() => router.push(`/posts/${id}`)}
                ></img>

                <div className='flex flex-col border-[1px] w-full border-gray-300 pt-4 pb-8 pl-12 pr-12 gap-2'>
                  <div className='flex flex-row gap-4 items-center h-[30%]'>
                    <Avatar src='/broken-image.jpg' />
                    <div className='flex flex-col'>
                      <span>Admin</span>
                      <span>Mar 21, 2023 - 1min</span>
                    </div>
                  </div>
                  <div className='h-[60%]'>
                    <Link href={`/posts/${id}`}>
                      <div className='flex flex-col gap-4 items-start'>
                        <div className='text-3xl font-serif'>{title}</div>
                        <div className='text-xl font-serif'>
                          {'……'}
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className='h-[10%]'>
                    <div className='left-10 bg-slate-500 w-full h-[0.05rem]'></div>
					<div className=' text-lg font-serif'>
                          {'TAGS: #tag1 #tag2 #tag3'}
                        </div>
                  </div>
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

// export async function getStaticProps () {
//   const allPostsData = getSortedPostsData()
//   return {
//     props: {
//       allPostsData
//     }
//   }
// }

export const getStaticProps: GetStaticProps = async (context) => {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData
    }
  }
}