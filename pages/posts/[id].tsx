import Head from 'next/head'
import Layout from '../../components/layout'
import { getAllPostIds, getPostData } from '../../lib/posts'
import Date from '../../components/date'
import Markdown from 'react-markdown'
import utilStyles from '../../styles/utils.module.css'
import { GetStaticPaths, GetStaticProps } from 'next'

export default function Post({ postData }: {
  postData: {
    id:string
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
  
  const remapImgSrc = (id:string,mdStr: string) => {
    // 将所有图片url添加images/前缀
    const reg = /!\[.*\]\((.*)\)/g
    const regResult = mdStr.match(reg)
    console.log(regResult)
    if (regResult) {
      for (let i = 0; i < regResult.length; i++) {
        const imgSrc = regResult[i].match(/\((.*)\)/)
        if (imgSrc) {
          const newImgSrc = `/images/${id}/` + imgSrc[1]
          mdStr = mdStr.replace(imgSrc[1], newImgSrc)
        }
      }
    }
    return mdStr
    
    
  }
  
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
        <div id='md'>
        <Markdown >{remapImgSrc(postData.id,postData.contentHtml)}</Markdown>
        </div>
        {/* <div className={utilStyles.md} dangerouslySetInnerHTML={{ __html: postData.contentHtml }} /> */}
        
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
