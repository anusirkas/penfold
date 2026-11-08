import React from 'react'
import { GetServerSideProps } from 'next'
import ReactMarkdown from 'react-markdown'
import Layout from '../../components/Layout'
import Router from 'next/router'
import { PostProps } from '../../components/Post'
import prisma from '../../lib/prisma'
import styles from '@/styles/Post.module.css'

async function publish(id: number): Promise<void> {
  await fetch(`/api/publish/${id}`, {
    method: 'PUT',
  })
  await Router.push('/')
}

async function archive(id: number): Promise<void> {
  const response = await fetch(`/api/archive/${id}`, {
    method: 'PUT',
  })
  if (!response.ok) {
    window.alert('Could not archive this post. Please try again.')
    return
  }
  await Router.push('/archived')
}

async function restore(id: number, published: boolean): Promise<void> {
  const response = await fetch(`/api/restore/${id}`, {
    method: 'PUT',
  })
  if (!response.ok) {
    window.alert('Could not restore this post. Please try again.')
    return
  }
  await Router.push(published ? '/' : '/drafts')
}

async function destroy(id: number): Promise<void> {
  await fetch(`/api/post/${id}`, {
    method: 'DELETE',
  })
  await Router.push('/')
}

const Post: React.FC<PostProps> = (props) => {
  const isArchived = Boolean(props.archivedAt)
  let title = props.title
  if (isArchived) {
    title = `${title} (Archived)`
  } else if (!props.published) {
    title = `${title} (Draft)`
  }

  return (
    <Layout>
      <div>
        <h2>{title}</h2>
        <p>By {props?.author?.name || 'Unknown author'}</p>
        <ReactMarkdown>{props.content}</ReactMarkdown>
        {!props.published && !isArchived && (
          <button className={styles.button} onClick={() => publish(props.id)}>
            Publish
          </button>
        )}
        {isArchived ? (
          <button
            className={styles.button}
            onClick={() => restore(props.id, props.published)}
          >
            Restore
          </button>
        ) : (
          <button className={styles.button} onClick={() => archive(props.id)}>
            Archive
          </button>
        )}
        <button className={styles.button} onClick={() => destroy(props.id)}>
          Delete
        </button>
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = Number(
    Array.isArray(context.params?.id)
      ? context.params?.id[0]
      : context.params?.id,
  )
  const post = await prisma.post.findUnique({
    where: { id },
    include: { author: true },
  })
  if (!post) {
    return { notFound: true }
  }
  return { props: { ...post } }
}

export default Post
