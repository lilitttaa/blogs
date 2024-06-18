import Head from 'next/head'
import Layout from '../../components/layout'
import { getAllPostIds, getPostData } from '../../lib/posts'
import Date from '../../components/date'
import Markdown from 'react-markdown'
import utilStyles from '../../styles/utils.module.css'
import { GetStaticPaths, GetStaticProps } from 'next'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism'
export default function Post ({
  postData
}: {
  postData: {
    id: string
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

  const remapImgSrc = (id: string, mdStr: string) => {
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

  const removeMeta = (mdStr: string) => {
    // 去除md中的meta信息
    const reg = /---[\s\S]*---/
    const regResult = mdStr.match(reg)
    if (regResult) {
      return mdStr.replace(regResult[0], '')
    }
    return mdStr
  }


  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        {/* <h1 className={'text-xl'}>{postData.title}</h1> */}
        {/* <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div> */}
        <div className='pt-12 pl-[25%] pr-[25%]'>
          <div id='md'>
            <Markdown
              className={''}
              components={{
                h1: ({ ...data }): JSX.Element => (
                  <h1 className='text-4xl font-black font-serif mt-2 mb-2' {...data} />
                ),
                h2: ({ ...data }): JSX.Element => (
                  <h2 className='text-2xl font-black font-serif mt-2 mb-2' {...data} />
                ),
                h3: ({ ...data }): JSX.Element => (
                  <h3 className='text-xl font-black font-serif mt-2 mb-2' {...data} />
                ),
                h4: ({ ...data }): JSX.Element => (
                  <h4 className='text-lg font-black font-serif mt-2 mb-2' {...data} />
                ),
                p: ({ ...data }): JSX.Element => (
                  <p className='text-lg font-serif text-justify mt-2 mb-2' {...data} />
                ),
                img: ({ ...data }): JSX.Element => (
                  <img alt={'img'} className='w-[70%]'  {...data} />
                ),
                a: ({ ...data }): JSX.Element => (
                  <a className='text-gray-500 underline' {...data} />
                ),
                ul: ({ ...data }): JSX.Element => (
                  <ul className='list-disc list-inside' {...data} />
                ),
                li: ({ ...data }): JSX.Element => (
                  <li className='text-lg font-serif' {...data} />
                ),
                code({  className, children, ...data }): JSX.Element {
                  const match = /language-(\w+)/.exec(className || '')
                  return  match ? (
                    <SyntaxHighlighter
                      //@ts-ignore
                      style={oneLight}
                      language={match[1]}
                      PreTag="div"
                      children={String(children).replace(/\n$/, '')}
                      {...data}
                    />
                  ) : (
                    <code className={className} {...data}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {remapImgSrc(postData.id, removeMeta(postData.contentHtml))}
            </Markdown>
          </div>
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

export const getStaticProps: GetStaticProps = async context => {
  if (!context.params) throw new Error('No params found')
  if (!context.params.id) throw new Error('No id found')
  const postData = await getPostData(context.params.id as string)
  return {
    props: {
      postData
    }
  }
}
