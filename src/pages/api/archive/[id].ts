import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

// PUT /api/archive/:id
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', 'PUT')
    return res.status(405).json({ error: `Method ${req.method} not allowed` })
  }

  const postId = Number(req.query.id)
  if (!Number.isInteger(postId)) {
    return res.status(400).json({ error: 'Invalid post id' })
  }

  const post = await prisma.post.findUnique({ where: { id: postId } })
  if (!post) {
    return res.status(404).json({ error: 'Post not found' })
  }

  // Already archived: keep the original timestamp.
  if (post.archivedAt) {
    return res.json(post)
  }

  const archivedPost = await prisma.post.update({
    where: { id: postId },
    data: { archivedAt: new Date() },
  })
  return res.json(archivedPost)
}
