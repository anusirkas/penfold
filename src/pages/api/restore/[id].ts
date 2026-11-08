import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

// PUT /api/restore/:id
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

  // `published` is left alone, so the post returns to its previous state.
  const restoredPost = await prisma.post.update({
    where: { id: postId },
    data: { archivedAt: null },
  })
  return res.json(restoredPost)
}
