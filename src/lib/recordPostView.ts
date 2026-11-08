import prisma from './prisma'

// Only published, non-archived posts count. updateMany is used instead of
// update because it does nothing, rather than throwing, when no row matches.
export async function recordPostView(id: number): Promise<void> {
  await prisma.post.updateMany({
    where: { id, published: true, archivedAt: null },
    data: { viewCount: { increment: 1 } },
  })
}
