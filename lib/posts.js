import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

import { marked } from 'marked'

const postsDirectory = path.join(process.cwd(), 'posts')

export function getSortedPostsData () {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory)
    const filteredFileNames = fileNames.filter(fileName =>
    fileName.endsWith('.html')
  )
  console.log('filteredFileNames', filteredFileNames)
  const allPostsData = filteredFileNames.map(fileName => {
    const id = fileName.replace(/\.html$/, '')
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    return {
      id,
      title:id
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

export async function getPostData (id) {
  const fullPath = path.join(postsDirectory, `${id}.html`)
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

  return fileNames.map(fileName => {
    return {
      params: {
        id: fileName.replace(/\.html$/, '')
      }
    }
  })
}
