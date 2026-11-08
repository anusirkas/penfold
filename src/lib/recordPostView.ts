import prisma from './prisma'

// Only published, non-archived posts count. updateMany is used instead of
// update because it does nothing, rather than throwing, when no row matches.
// A failed count is logged and ignored, so it can't stop a post from loading.
export async function recordPostView(id: number): Promise<void> {
  try {
    await prisma.post.updateMany({
      where: { id, published: true, archivedAt: null },
      data: { viewCount: { increment: 1 } },
    })
  } catch (error) {
    console.error(`Failed to record a view for post ${id}`, error)
  }
}
