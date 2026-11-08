import React from 'react'
import { GetServerSideProps } from 'next'
import Layout from '../components/Layout'
import Post, { PostProps } from '../components/Post'
import prisma from '../lib/prisma'
import styles from '@/styles/Drafts.module.css'

type Props = {
  posts: PostProps[]
}

const Archived: React.FC<Props> = (props) => {
  return (
    <Layout>
      <div>
        <h1>Archived</h1>
        <main>
          {props.posts.map((post) => (
            <div key={post.id} className={styles.post}>
              <Post post={post} />
            </div>
          ))}
        </main>
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const posts = await prisma.post.findMany({
    where: { archivedAt: { not: null } },
    include: { author: true },
    orderBy: { archivedAt: 'desc' },
  })
  return {
    props: { posts },
  }
}

export default Archived
