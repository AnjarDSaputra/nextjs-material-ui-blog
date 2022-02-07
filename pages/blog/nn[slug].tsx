import React, { FC, ReactElement, useEffect } from 'react'
import matter from 'gray-matter'
import { getPost, getfromDB } from '../../src/lib/posts'
import { PostData } from '../../src/types/posts'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import marked from 'marked'
import Head from 'next/head'
import hljs from 'highlight.js'
import '../../node_modules/highlight.js/styles/monokai.css'
import '../../node_modules/highlight.js/lib/highlight'
import styles from '../../styles/Slug.module.css'
import { PageHeading } from '../../src/components/PageHeading'
import { Card, CardMedia, Typography } from '@material-ui/core'
import TopicsDisplay from '../../src/components/TopicsDisplay'
import PreviewCard from '../../src/components/PreviewCard'
import { BASE_URL, NAME } from '../../src/types/constants'
type Props = { postData: PostData; nextPath: PostData }
var contentsplit;
var fname = [];
var fname2 = [];
const Slug: FC<Props> = ({ postData, nextPath }): ReactElement => {
  marked.setOptions({
    highlight: function (code) {
      return hljs.highlightAuto(code).value
    },
  })

  useEffect(() => {
    document.querySelectorAll('pre code').forEach((block: HTMLElement) => {
      hljs.highlightBlock(block)
    })
  }, [postData])

  return (
    <>
      <Head>
        <title>{postData.title}</title>
        <meta name="description" content={postData.description} />
        <meta property="article:published_time" content={`${postData.date}T10:00:00Z`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:description" content={postData.description} />
        <meta name="twitter:title" content={postData.title} />
        <meta name="twitter:image" content={`${BASE_URL}/large/${postData.id}.png`} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={postData.title} />
        <meta property="og:description" content={postData.description} />
        <meta property="og:url" content={`${BASE_URL}/blog/${postData.id}`} />
        <meta property="og:site_name" content={NAME} />
        <meta property="og:image" content={`${BASE_URL}/large/${postData.id}.png`} />
        <meta property="og:image:secure_url" content={`${BASE_URL}/large/${postData.id}.png`} />
      </Head>
      <div className={styles['text-content']}>
        <PageHeading title={postData.title} />
      </div>
      <div className={styles['image-container']}>
        <div className={styles.info}>
          <Typography variant="body1">
            {postData.date} — written by{' '}
            <a
              href="http://www.finlup.id"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              {postData.writer ? postData.writer : 'Admin'}
            </a>
          </Typography>
          <TopicsDisplay topics={postData.topics} n={10} noMargin />
        </div>
      </div>
      <div className={styles['image-container']}>
        <Card className={styles.image}>
          <CardMedia>
            <img
              className={styles['img-width']}
              alt={postData.title}
              loading="lazy"
              src={`/large/${postData.id}.png`}
            />
          </CardMedia>
        </Card>
      </div>
      <div className={styles['post-container']} dangerouslySetInnerHTML={{ __html: marked(postData.content) }} />
      <div className={styles['post-container']} style={{ paddingTop: 50 }}>
        <hr />
        <Typography variant="h4" component="p" style={{ paddingBottom: 20 }}>
          Bacaan yang lain
        </Typography>
        <PreviewCard post={nextPath} noMargin />
      </div>
    </>
  )
}

type StaticPaths = { paths: { params: { slug: string } }[]; fallback: boolean }

// const getPostFromFile = (fullPath: string, id: string, includeContent = false): PostData => {
//   // const fileContents = fs.readFileSync(fullPath, 'utf8')

//   // Use gray-matter to parse the post metadata section
//   const matterResult = matter(fullPath)  
//   console.log(matterResult)
  
//   // Combine the data with the id
//   return {
//     id,
//     ...matterResult.data,
//     content: includeContent ? matterResult.content : null,
//     topics: matterResult.data.topics.split(','),
//   } as PostData
// }

// export const getSortedPostsData = (): PostData[] => {
//   // Get file names under /posts
//   // const fileNames = fs.readdirSync(postsDirectory)
//   // console.log(fileNames); 
//   // console.log(fname);
//   var i = -1;
//   const allPostsData: PostData[] = fname.map((fileName) => {
//     // Remove ".md" from file name to get id
//     const id = fileName.replace(/\.md$/, '')
//     // for (let index = 0; index < avatars.length; index++) {
//     // Read markdown file as string
//     // const fullPath = path.join(postsDirectory, fileName)
//     i++
//     return getPostFromFile(fname[0], id)
//     // }
//   })
//   // Sort posts by date
//   return allPostsData.sort((a, b) => {
//     if (a.date < b.date) {
//       return 1
//     } else {
//       return -1
//     }
//   })
// }

export const getSortedPostsData =  (): PostData[] => {
 
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


export const getStaticProps = async ({
  params: { slug },
}: GetStaticPropsContext<{ slug: string }>): Promise<
  GetStaticPropsResult<{
    postData: PostData
    nextPath: PostData
  }>
> => {
  console.log("slug")
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Basic dGVyYXBpX3RvdG9rOjEyM3F3ZWFzZHp4Yw==");

  var raw = JSON.stringify({
      "operation": "sql",
      "sql": "SELECT * FROM Totok431Pasien.Blog where id = '6-manfaat-kismis-salah-satu-untuk-daya-ingat' "
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
  };
  const avatars =  await fetch('https://terapi-totok-recreate.harperdbcloud.com', requestOptions).then(res => res.json());
    const element = avatars[0];
    fname.push(avatars[0].id)
    // const contentsplit =  "---"+"\ntitle: '"+avatars[index].title+"'\ndate: '"+avatars[index].date+
    // "'\ndescription: "+avatars[index].description+"\nfeatured: "+avatars[index].featured+"\ntopics: '"+avatars[index].topics+
    // "'\nrecommended: '"+avatars[index].recommended+"'\nwriter: '"+avatars[index].writer+"'\n---\n"+"\n"+avatars[index].content;
    // fname2.push(contentsplit);
    // console.log(fname)
    // getPostFromFile(contentsplit, avatars[index].id)
  

  
  const postData = await getPost(element,true)
  // getPostFromFile(avatars[0],avatars[0].id)

  const paths = await getSortedPostsData()
  console.log(postData)
  const nextPath = !postData.recommended
    ? paths.reduce((prev, curr, i) => (curr.id === slug && i >= 1 ? paths[i - 1] : curr), paths[paths.length - 1])
    : paths.filter((p) => p.id === postData.recommended).pop()

  return {
    props: {
      postData,
      nextPath,
    },
  }
}

export const getStaticPaths = async (): Promise<StaticPaths> => {
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
  const avatars = await fetch('https://terapi-totok-recreate.harperdbcloud.com', requestOptions).then(res => res.json());
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
  const paths = await getSortedPostsData().map(({ id }) => ({
    params: {
      slug: id,
    },
  }))

  return {
    paths,
    fallback: false,
  }
}

export default Slug
