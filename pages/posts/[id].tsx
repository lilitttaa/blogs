import Head from 'next/head'
import Layout from '../../components/layout'
import { getAllPostIds, getMetaInfo, getPostData } from '../../lib/posts'
import Date from '../../components/date'
import Markdown from 'react-markdown'
import utilStyles from '../../styles/utils.module.css'
import { GetStaticPaths, GetStaticProps } from 'next'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { ReactNode } from 'react'
export default function Post ({
  postData,
  meta
}: {
  postData: {
    id: string
    title: string
    date: string
    contentHtml: string
  },
  meta:{
	title:string
	cover:string
	created_at:string
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

const text2Spans = (pChild: ReactNode) => {
	if(typeof pChild !== 'string'){
		return pChild
	}
	const text = pChild as string
	console.log('text:', text)	
	// 根据换行符分割文本
	const lines = text.split('\n')
	const spans = []
	for (let i = 0; i < lines.length; i++) {
		spans.push(<p key={i} className='text-lg font-serif mt-1 mb-1'>{lines[i]}</p>)
	}
	return spans
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
        <div className='w-full'>
          <div className='pt-4 pb-12 pl-[25%] pr-[25%]'>
            <div id='md'>
				<div className='text-4xl font-black font-sans mt-4 mb-8'>{meta.title}</div>
              <Markdown
                className={''}
                components={{
                  h2: ({children, ...data }): JSX.Element => (
                    <h2
                      className='text-2xl font-black font-sans mt-4 mb-4'
                      {...data}
                    >
						{'# ' + children}
					</h2>
                  ),
                  h3: ({children, ...data }): JSX.Element => (
                    <h3
                      className='text-xl font-black font-sans mt-4 mb-4'
					  
                      {...data}
                    >{'# ' + children}</h3>
                  ),
                  h4: ({children, ...data }): JSX.Element => (
                    <h4
                      className='text-lg font-black font-sans mt-4 mb-4'
                      {...data}
                    >{'# ' + children}</h4>
                  ),
                  p: ({children, ...data }): JSX.Element => (
                    <div
                      className='mt-2 mb-2'
                      {...data}
                    >{text2Spans(children)}</div>
                  ),
                  img: ({ ...data }): JSX.Element => (
                    <img alt={'img'} className='w-[100%] mt-2 mb-2' {...data} />
                  ),
                  a: ({ ...data }): JSX.Element => (
                    <a className='text-gray-500 underline' {...data} />
                  ),
                  ul: ({ ...data }): JSX.Element => (
                    <ul className='list-disc list-inside' {...data} />
                  ),
                  li: ({ ...data }): JSX.Element => (
                    <li className='text-lg font-serif mt-2 mb-2' {...data} />
                  ),
                  code ({ className, children, ...data }): JSX.Element {
                    const match = /language-(\w+)/.exec(className || '')
                    return match ? (
                      <SyntaxHighlighter
                        //@ts-ignore
                        style={oneLight}
                        language={match[1]}
                        PreTag='div'
                        children={String(children).replace(/\n$/, '')}
                        {...data}
                      />
                    ) : (
                      <code className={className} {...data}>
                        {children}
                      </code>
                    )
                  }
                }}
              >
                {remapImgSrc(postData.id, removeMeta(postData.contentHtml))}
              </Markdown>
            </div>
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
	const metaInfo = getMetaInfo()
  return {
    props: {
      postData,
	  meta:metaInfo[context.params.id as string]
    }
  }
}
