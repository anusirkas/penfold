import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import prisma from '../src/lib/prisma'
import { recordPostView } from '../src/lib/recordPostView'

function createPost(data: { published: boolean; archivedAt?: Date }) {
  return prisma.post.create({ data: { title: 'Test post', ...data } })
}

async function viewCountOf(id: number) {
  const post = await prisma.post.findUniqueOrThrow({ where: { id } })
  return post.viewCount
}

beforeAll(() => {
  // beforeEach deletes every post, so never run against another database.
  if (process.env.DATABASE_URL !== 'file:./test.db') {
    throw new Error('Tests must run against the test database')
  }
})

beforeEach(async () => {
  await prisma.post.deleteMany()
})

afterAll(async () => {
  await prisma.$disconnect()
})

describe('recordPostView', () => {
  it('counts a view of a published post', async () => {
    const post = await createPost({ published: true })

    await recordPostView(post.id)

    expect(await viewCountOf(post.id)).toBe(1)
  })

  it('does not count a view of a draft', async () => {
    const post = await createPost({ published: false })

    await recordPostView(post.id)

    expect(await viewCountOf(post.id)).toBe(0)
  })

  it('does not count a view of an archived post', async () => {
    const post = await createPost({ published: true, archivedAt: new Date() })

    await recordPostView(post.id)

    expect(await viewCountOf(post.id)).toBe(0)
  })

  it('does not throw for a post that does not exist', async () => {
    await expect(recordPostView(999999)).resolves.toBeUndefined()
  })

  it('does not lose simultaneous views', async () => {
    const post = await createPost({ published: true })

    await Promise.all(
      Array.from({ length: 10 }, () => recordPostView(post.id)),
    )

    expect(await viewCountOf(post.id)).toBe(10)
  })
})
