import { FC } from 'react'

type Post = {
  slug: string
  title: string
  imageUrl: string
  date: string
  draft: boolean
}

// TODO: Get this info from MD metadata instead of hardcoding it
const allPosts: Post[] = [
  {
    slug: 'migrating-to-aws-ecs',
    title: 'Migrating from Netlify to AWS ECS',
    imageUrl: 'img/Arch_Amazon-Elastic-Container-Service_64@5x.png',
    date: '1-17-2023',
    draft: true,
  },
  {
    slug: 'chatgpt-for-developers-10-examples',
    title: 'ChatGPT For Developers: A Look at 10 Examples',
    imageUrl: '/img/ChatGPT_logo.svg',
    date: '10-30-2023',
    draft: false,
  },
]

const post: FC<Post> = ({ slug, imageUrl, date, title, draft }) => {
  if (draft) {
    // Don't show drafts in list of blog posts
    return null
  }
  return (
    <a key={title} href={`/blog/${slug}`}>
      <div className=" rounded-lg p-6 shadow-md">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={title}
            className="mb-4 h-64 w-full rounded-md object-contain object-center"
          />
        )}
        <h2 className="mb-2 text-2xl font-bold">{title}</h2>
        <p className="text-gray-500">{date}</p>
      </div>
    </a>
  )
}

export const Posts = () => {
  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-4 text-3xl font-bold">Blog Posts</h1>
        {allPosts.map((p) => post(p))}
      </div>
    </div>
  )
}
