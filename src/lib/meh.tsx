// import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { PostData } from '../types/posts'
import {  useState } from "react";
const postsDirectory = path.join(process.cwd(), 'posts')
var hasil;
var fname = [];
var contentsplit;
export function getfromDB()
{
  var axios = require('axios');
var data = JSON.stringify({
    "operation": "sql",
    "sql": "SELECT * FROM Totok431Pasien.Blog"
});

var config = {
  method: 'post',
  url: 'https://terapi-totok-recreate.harperdbcloud.com',
  headers: { 
    'Content-Type': 'application/json', 
    'Authorization': 'Basic dGVyYXBpX3RvdG9rOjEyM3F3ZWFzZHp4Yw=='
  },
  data : data
};

axios(config)
.then(function (response) {
  const splitData = response.data;
  fname=[];
  for (let index = 0; index < splitData.length; index++) {
    contentsplit =  "---"+"\ntitle: '"+splitData[index].title+"'\ndate: '"+splitData[index].date+
    "'\ndescription: "+splitData[index].description+"\nfeatured: "+splitData[index].featured+"\ntopics: '"+splitData[index].topics+
    "'\nrecommended: '"+splitData[index].recommended+"'\nwriter: '"+splitData[index].writer+"'\n---\n"+"\n"+splitData[index].content;
    fname.push(splitData[index].recommended)
  }
  const matterResult = matter(contentsplit) 
  // console.log(JSON.stringify(response.data));
  hasil = matterResult;
  // console.log(matterResult);
})
.catch(function (error) {
  console.log(error);
});
}




export const getPost = (id: string, includeContent = false): PostData => {
  // getfromDB();
  const fullPath = path.join(postsDirectory, `${id}.md`)
  console.log(id)
  return getPostFromFile(contentsplit, id, includeContent)
}

export const getSortedPostsData = (): PostData[] => {
  // Get file names under /posts
  // const fileNames = fs.readdirSync(postsDirectory)
  // console.log(fileNames); 
  // console.log(fname);
  const allPostsData: PostData[] = fname.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '')

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName)
    return getPostFromFile(contentsplit, id)
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

const getPostFromFile = (fullPath: string, id: string, includeContent = false): PostData => {
  // const fileContents = fs.readFileSync(fullPath, 'utf8')

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fullPath)  
  // console.log(fileContents)
  
  // Combine the data with the id
  return {
    id,
    ...matterResult.data,
    content: includeContent ? matterResult.content : null,
    topics: matterResult.data.topics.split(','),
  } as PostData
}

export const getSortedTopics = (): string[] => {
  const posts = getSortedPostsData()

  const allTopics = posts.reduce((prev: string[], current: PostData) => {
    return [...prev, ...current.topics]
  }, [])

  const map: Record<string, number> = {}

  allTopics.map((t) => {
    map[t] = allTopics.filter((topic) => t === topic).length
  })

  return Array.from(new Set(allTopics)).sort((a, b) => map[b] - map[a])
}
