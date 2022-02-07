import React, { FC, ReactElement } from 'react'
import styles from '../styles/404.module.css'
import { PageHeading } from '../src/components/PageHeading'
import { Typography } from '@material-ui/core'
import { GetStaticPropsResult } from 'next'
import TopicsDisplay from '../src/components/TopicsDisplay'
import { PostData } from '../src/types/posts'
import matter from 'gray-matter'

type FourOFourProps = { topics: string[] }

var contentsplit;
var fname = [];
var fname2 = [];
export const FourOFour: FC<FourOFourProps> = ({ topics }): ReactElement => {
  return (
    <div className={styles.error}>
      <div className={styles.container}>
        <div>
          <PageHeading title="404" />
        </div>
        <Typography variant="h6">This page could not be found 🙁</Typography>
        <div className={styles.topics}>
          <TopicsDisplay topics={topics} n={5} />
        </div>
      </div>
    </div>
  )
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
const getSortedPostsData = (): PostData[] => {
  // Get file names under /posts
  // const fileNames = fs.readdirSync(postsDirectory)
  // console.log(fileNames); 
  // console.log(fname);
  var i = -1;
  const allPostsData: PostData[] = fname.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '')
    // for (let index = 0; index < avatars.length; index++) {
    // Read markdown file as string
    // const fullPath = path.join(postsDirectory, fileName)
    i++
    return getPostFromFile(fname2[i], id)
    // }
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
const getSortedTopics = (): string[] => {
  const posts = getSortedPostsData()
  // console.log(posts)
  const allTopics = posts.reduce((prev: string[], current: PostData) => {
    return [...prev, ...current.topics]
  }, [])

  const map: Record<string, number> = {}

  allTopics.map((t) => {
    map[t] = allTopics.filter((topic) => t === topic).length
  })

  return Array.from(new Set(allTopics)).sort((a, b) => map[b] - map[a])
}
export const getStaticProps = async (): Promise<
  GetStaticPropsResult<{
    topics: string[]
  }>
> => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Basic dGVyYXBpX3RvdG9rOjEyM3F3ZWFzZHp4Yw==");

  var raw = JSON.stringify({
      "operation": "sql",
      "sql": "SELECT * FROM Totok431Pasien.Blog"
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
  };
  fname=[];
  contentsplit='';
  var avatars = await fetch('https://terapi-totok-recreate.harperdbcloud.com', requestOptions).then(res => res.json());
  for (let index = 0; index < avatars.length; index++) {
    fname.push(avatars[index].id)
    const element = avatars[index];
    contentsplit =  "---"+"\ntitle: '"+avatars[index].title+"'\ndate: '"+avatars[index].date+
    "'\ndescription: "+avatars[index].description+"\nfeatured: "+avatars[index].featured+"\ntopics: '"+avatars[index].topics+
    "'\nrecommended: '"+avatars[index].recommended+"'\nwriter: '"+avatars[index].writer+"'\n---\n"+"\n"+avatars[index].content;
    fname2.push(contentsplit);
    // console.log(fname)
    // getPostFromFile(contentsplit, avatars[index].id)
  }
  const sortedTopics = getSortedTopics()

  return {
    props: {
      topics: sortedTopics,
    },
  }
}

export default FourOFour
