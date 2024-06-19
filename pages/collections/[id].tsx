import Head from 'next/head'
import Layout from '../../components/layout'
import {
  getAllCollectionIds,
  getAllPostIds,
  getCollectionData,
  getPostData
} from '../../lib/posts'
import utilStyles from '../../styles/utils.module.css'
import { GetStaticPaths, GetStaticProps } from 'next'
import router from 'next/router'
import Avatar from '@mui/material/Avatar'
import Link from 'next/link'

export default function Collection ({
  collectionData
}: {
  collectionData: {
    Name: string
    Description: string
    List: string[]
  }
}) {
  console.log(collectionData)
  return (
    <Layout>
      <Head>
        <title>{collectionData.Name}</title>
      </Head>
      <main>
        <section className='pt-8 pb-8 pl-[21%] pr-[21%] w-full'>
          <ul className='flex flex-col gap-4 border-[0.01rem]'>
            {collectionData.List.map(item => (
              <li className=' flex flex-row '>
                <div className='flex flex-col border-[1px] w-full border-gray-300 pt-4 pb-4 pl-12 pr-12 '>
                  {/* <div className='flex flex-row gap-4 items-center h-[30%]'>
                    <Avatar src='/broken-image.jpg' />
                    <div className='flex flex-col'>
                      <span>Admin</span>
                      <span>Mar 21, 2023 - 1min</span>
                    </div>
                  </div> */}
                  <div className=''>
                    <Link href={`/posts/${item}`}>
                      <div className='text-2xl font-serif'>{item}</div>
                    </Link>
                  </div>
                  {/* <div className='h-[10%]'>
                    <div className='left-10 bg-slate-500 w-full h-[0.05rem]'></div>
                    <div className=' text-lg font-serif'>
                    </div>
                  </div> */}
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

// export async function getStaticPaths() {
//     const paths = getAllPostIds()
//     return {
//         paths,
//         fallback: false
//     }
// }

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllCollectionIds()
  return {
    paths,
    fallback: false
  }
}

// export async function getStaticProps({ params }) {
//     const postData = await getPostData(params.id)
//     return {
//         props: {
//             postData
//         }
//     }
// }

export const getStaticProps: GetStaticProps = async context => {
  if (!context.params) throw new Error('No params found')
  console.log(context.params.id)
  if (!context.params.id) throw new Error('No id found')
  const collectionData = await getCollectionData(context.params.id as string)
  return {
    props: {
      collectionData
    }
  }
}
