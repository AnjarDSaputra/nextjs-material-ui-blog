// import { getfromDB } from '../src/lib/posts'
import { GetStaticPropsResult } from 'next'
import { PostData } from '../src/types/posts'
import React, { ReactElement } from 'react'
import { Grid, Typography } from '@material-ui/core'
import styles from '../styles/Shared.module.css'
import Box from '@material-ui/core/Box'
import TopicsDisplay from '../src/components/TopicsDisplay'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { Preview } from '../src/components/Preview'
import Head from 'next/head'
import matter from 'gray-matter'
import { NAME, NAME_AND_DOMAIN } from '../src/types/constants'
var fname = [];
var fname2 = [];
var avatars;
var contentsplit;
const Home = ({ postsData, sortedTopics }: { postsData: PostData[]; sortedTopics: string[] }): ReactElement => {
  const large = useMediaQuery('(min-width:700px)')
  
  return (
    <>
      <Head>
        <title>{NAME}: Aneka Kurma Premium | SARIKURMA.ID.</title>
        <meta
          name="description"
          content={`${NAME} menyediakan grosir kurma yang berkualitas premium dan higenis. 
          kami pastikan produk-produk kami baru dan memiliki expired yang panjang.`}
        />
      </Head>
      <Grid container>
        <Grid item xs={12} className={styles.headings}>
          <Box p={5}>
            <Typography variant={large ? 'h1' : 'h4'}>{NAME_AND_DOMAIN}</Typography>
            <Typography className={styles.secondHeading} variant={large ? 'h3' : 'h6'}>
              Hidup Sehat ala Rasulullah
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <TopicsDisplay topics={sortedTopics} n={5} />
        </Grid>
        <Grid item xs={12}>
          <Box pt={3}>
            <Preview posts={postsData} />
          
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

// export const getStaticProps = async (): Promise<
//   GetStaticPropsResult<{
//     postsData: PostData[]
//     sortedTopics: string[]
//   }>
// > => {
//   getfromDB()
//   const sortedTopics = getSortedTopics()
//   const postsData = getSortedPostsData()
  
//   // console.log(sortedTopics)
//   return {
//     props: {
//       postsData: postsData,
//       sortedTopics,
//     },
//   }
// }

export const getSortedPostsData = (): PostData[] => {
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
  console.log(posts)
  const allTopics = posts.reduce((prev: string[], current: PostData) => {
    return [...prev, ...current.topics]
  }, [])

  const map: Record<string, number> = {}

  allTopics.map((t) => {
    map[t] = allTopics.filter((topic) => t === topic).length
  })

  return Array.from(new Set(allTopics)).sort((a, b) => map[b] - map[a])
}
export async function getStaticProps() {
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
  avatars = await fetch('https://terapi-totok-recreate.harperdbcloud.com', requestOptions).then(res => res.json());
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
  console.log(sortedTopics)
  return {
    props: {
      postsData: avatars,
      sortedTopics
      
    }
  }
}

export default Home
