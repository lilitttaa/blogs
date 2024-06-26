import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

import { marked } from 'marked'
import { Name2Id } from './utils'

const postsDirectory = path.join(process.cwd(), 'posts')

const postFilter = (fileNames:string[]) => {
  return fileNames.filter(fileName =>
    fileName.endsWith('.md')
  )
}

const getPostFullPath = (id: string) => {
  return path.join(postsDirectory, `${id}.md`)
}

const removeExt=(fileName: string) => {
  return fileName.replace(/\.md$/, '')
}


export function getSortedPostsData () {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory)
  const metaInfoJsonStr = fs.readFileSync(path.join(postsDirectory, 'meta.json'), 'utf8')
  const metaInfo = JSON.parse(metaInfoJsonStr)
  const allPostsData = postFilter(fileNames).map(fileName => {
    const id = removeExt(fileName)
    const title: string = metaInfo[id].title
	const cover:string = metaInfo[id].cover || ''
    const createdAt = metaInfo[id].created_at
    const fullPath = path.join(postsDirectory, fileName)
    // const fileContents = fs.readFileSync(fullPath, 'utf8')

    return {
      id,
      title: title,
	  cover: cover,
      date:1 // TODO: get date from file
    }
  })
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export function getMetaInfo(){
	const metaInfoJsonStr = fs.readFileSync(path.join(postsDirectory, 'meta.json'), 'utf8')
	const metaInfo = JSON.parse(metaInfoJsonStr)
	return metaInfo
}

export function getCollectionsInfo(){
	const collectionsInfoJson = fs.readFileSync(path.join(postsDirectory, 'Collections.json'), 'utf8')
	const collectionsInfo = JSON.parse(collectionsInfoJson)
	return collectionsInfo
}



export function getCollectionData(id: string) {
  const collectionsInfoJson = fs.readFileSync(path.join(postsDirectory, 'Collections.json'), 'utf8')
  const collectionsInfo = JSON.parse(collectionsInfoJson)
  const collection = collectionsInfo.find((collection: {
    Name: string
  }) => Name2Id(collection.Name) === id)
  if(!collection) throw new Error('Collection not found')
  return collection
}

export function getAllCollectionIds() {
  const collectionsInfoJson = fs.readFileSync(path.join(postsDirectory, 'Collections.json'), 'utf8')
  const collectionsInfo = JSON.parse(collectionsInfoJson)
  return collectionsInfo.map((collection: {
    Name: string
  }) => {
    return {
      params: {
        id: Name2Id(collection.Name)
      }
    }
  })
}



export async function getPostData (id:string) {
  const fullPath = getPostFullPath(id)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml:fileContents,
      // ...matterResult.data
    // title:id
  }
}

export function getAllPostIds () {
  const fileNames = fs.readdirSync(postsDirectory)
  return postFilter(fileNames).map(fileName => {
    return {
      params: {
        id: removeExt(fileName)
      }
    }
  })
}
