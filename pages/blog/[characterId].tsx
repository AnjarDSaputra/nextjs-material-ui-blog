import React, { FC, ReactElement, useEffect } from 'react'
import Head from 'next/head'
import { BASE_URL, NAME } from '../../src/types/constants'
import styles from '../../styles/Slug.module.css'
import { PageHeading } from '../../src/components/PageHeading'
import { Card, CardMedia, Typography } from '@material-ui/core'
import TopicsDisplay from '../../src/components/TopicsDisplay'
import marked from 'marked'
import PreviewCard from '../../src/components/PreviewCard'
import matter from 'gray-matter'
import { PostData } from '../../src/types/posts'
var fname = [];
var fname2 = [];
var words = [];

type Props = { character: PostData}
  const Slug: FC<Props> = ({ character }): ReactElement => {
    marked.setOptions({
      highlight: function (code) {
        return hljs.highlightAuto(code).value
      },
    })
  
    useEffect(() => {
      document.querySelectorAll('pre code').forEach((block: HTMLElement) => {
        hljs.highlightBlock(block)
      })
    }, [character])
  return (
    <>
      <Head>
        <title>{character.title}</title>
        <meta name="description" content={character.description} />
        <meta property="article:published_time" content={`${character.date}T10:00:00Z`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:description" content={character.description} />
        <meta name="twitter:title" content={character.title} />
        <meta name="twitter:image" content={`${BASE_URL}/large/${character.id}.png`} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={character.title} />
        <meta property="og:description" content={character.description} />
        <meta property="og:url" content={`${BASE_URL}/blog/${character.id}`} />
        <meta property="og:site_name" content={NAME} />
        <meta property="og:image" content={`${BASE_URL}/large/${character.id}.png`} />
        <meta property="og:image:secure_url" content={`${BASE_URL}/large/${character.id}.png`} />
      </Head>
      <div className={styles['text-content']}>
        <PageHeading title={character.title} />
      </div>
      <div className={styles['image-container']}>
        <div className={styles.info}>
          <Typography variant="body1">
            {character.date} — written by{' '}
            <a
              href="http://www.finlup.id"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              {character.writer ? character.writer : 'Admin'}
            </a>
          </Typography>
          {/* <TopicsDisplay topics={words} n={2}  /> */}
        </div>
      </div>
      <div className={styles['image-container']}>
        <Card className={styles.image}>
          <CardMedia>
            <img
              className={styles['img-width']}
              alt={character.title}
              loading="lazy"
              src={`/large/${character.id}.png`}
            />
          </CardMedia>
        </Card>
      </div>
      <div className={styles['post-container']} dangerouslySetInnerHTML={{ __html: marked(character.content) }} />
      <div className={styles['post-container']} style={{ paddingTop: 50 }}>
        <hr />
        <Typography variant="h4" component="p" style={{ paddingBottom: 20 }}>
          Bacaan yang lain
        </Typography>
      </div>
    </>
  )

}

const getPostFromFile = (fullPath: string, id: string, includeContent = false): PostData => {
  const matterResult = matter(fullPath)  
  // Combine the data with the id
  return {
    id,
    ...matterResult.data,
    content: includeContent ? matterResult.content : null,
    topics: matterResult.data.topics.split(','),
  } as PostData
}

export const getSortedPostsData = (): PostData[] => {
  var i = -1;
  const allPostsData: PostData[] = fname.map((fileName) => {
    const id = fileName.replace(/\.md$/, '')
    i++
    return getPostFromFile(fname2[i], id)
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

export async function getStaticProps({ params }) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Basic dGVyYXBpX3RvdG9rOjEyM3F3ZWFzZHp4Yw==");

  var raw = JSON.stringify({
      "operation": "sql",
      "sql": "SELECT * FROM Totok431Pasien.Blog where id = '"+params.characterId+"'"
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
  };
  const post =  await fetch('https://terapi-totok-recreate.harperdbcloud.com', requestOptions).then(res => res.json());
  words = post[0].topics.split(',');
  const paths = getSortedPostsData()
  const nextPath = !post.recommended
    ? paths.reduce((prev, curr, i) => (curr.id === params && i >= 1 ? paths[i - 1] : curr), paths[paths.length - 1])
    : paths.filter((p) => p.id === post.recommended).pop()
  return {
    props: {
      character: post[0],
    }
  }
}

export async function getStaticPaths() {
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
  const post =  await fetch('https://terapi-totok-recreate.harperdbcloud.com', requestOptions).then(res => res.json());
  return {
    paths: post.map(character => {
      const characterId = character.id.toLowerCase().replace(/ /g, '-');
      return {
        params: {
          characterId
        }
      }
    }),
    fallback: false
  }
}

export default Slug