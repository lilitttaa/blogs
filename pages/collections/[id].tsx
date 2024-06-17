import Head from 'next/head'
import Layout from '../../components/layout'
import { getAllPostIds, getPostData } from '../../lib/posts'
import utilStyles from '../../styles/utils.module.css'
import { GetStaticPaths, GetStaticProps } from 'next'

export default function Collection({ collectionData }: {
	collectionData: {
    title: string
  }
}) {

  return (
    <Layout>
      <Head>
        <title>{collectionData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{123}</h1>
        <div className={utilStyles.lightText}>
          {/* <Date dateString={postData.date} /> */}
        </div>
        {/* <div id='md'>
        <Markdown >{markdownTestStr}</Markdown>
        </div> */}
        <div className={utilStyles.md}  />
        
      </article>
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
  const paths = getAllPostIds()
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

export const getStaticProps: GetStaticProps = async (context) => {
  if (!context.params) throw new Error('No params found')
  if(!context.params.id) throw new Error('No id found')
  console.log(context.params.id)
  const postData = await getPostData(context.params.id as string)
  return {
      props: {
          postData
      }
  }
}
