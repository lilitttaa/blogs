import Head from 'next/head'
import Layout from '../../components/layout'
import { getAllPostIds, getPostData } from '../../lib/posts'
import Date from '../../components/date'
import Markdown from 'react-markdown'
import utilStyles from '../../styles/utils.module.css'
import { GetStaticPaths, GetStaticProps } from 'next'

export default function Post({ postData }: {
  postData: {
    title: string
    date: string
    contentHtml: string
  }
}) {

  const markdownTestStr = `
  # This is a header
  And this is a paragraph
  \`\`\`cpp
  #include <iostream>
  using namespace std;
  int main() {
    cout << "Hello World!";
    return 0;
  }
  \`\`\`
`
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          {/* <Date dateString={postData.date} /> */}
        </div>
        {/* <div id='md'>
        <Markdown >{markdownTestStr}</Markdown>
        </div> */}
        <div className={utilStyles.md} dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        
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
  const postData = await getPostData(context.params.id as string)
  return {
      props: {
          postData
      }
  }
}
