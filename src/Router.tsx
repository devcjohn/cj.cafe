import { Helmet } from 'react-helmet-async'
import { Navigate, RouteObject, RouterProvider, createBrowserRouter } from 'react-router-dom'
import FormFillDemo from './components/FormFillDemo'
import { Contact } from './pages/Contact'
import { Home } from './pages/Home'
import { NavBar } from './components/NavBar'
import { FallbackComponent } from './components/FallbackComponent'
import { WhatIKnowAboutYou } from './pages/WhatIKnowAboutYou'
import { Suspense, lazy } from 'react'
import { LoadingFallback } from './components/LoadingFallback'

/* 
  Lazy load pages
  This allows faster loading of the inital page the user visits, because the vite bundler will create a separate chunk for each page
  instead of bundling all pages into one giant chunk.
*/
const WhiteBoard = lazy(() =>
  import('./pages/WhiteBoard').then((module) => ({ default: module.WhiteBoard }))
)

const BlogPost = lazy(() =>
  import('./components/BlogPost').then((module) => ({ default: module.BlogPost }))
)

const Posts = lazy(() => import('./pages/Posts').then((module) => ({ default: module.Posts })))

const WordGame = lazy(() =>
  import('./pages/wordGame/WordGame').then((module) => ({ default: module.WordGame }))
)

const Crash = lazy(() => import('./pages/Crash').then((module) => ({ default: module.Crash })))

const routes = [
  {
    path: '/',
    title: 'CJ.Cafe',
    component: <Home />,
  },
  {
    path: '/hintle',
    title: 'Hintle',
    component: <WordGame />,
  },
  {
    path: '/formfill',
    title: 'Form Fill Demo',
    component: <FormFillDemo />,
  },
  {
    path: '/crash',
    title: 'Crash',
    component: <Crash />,
  },
  {
    path: '/contact',
    title: 'Contact',
    component: <Contact />,
  },
  {
    path: '/whiteboard',
    title: 'whiteboard',
    component: <WhiteBoard />,
    hideNavBar: true,
  },
  {
    path: '/blog',
    title: 'Blogposts',
    component: <Posts />,
  },
  {
    path: '/blog/:slug',
    title: 'Post',
    component: <BlogPost />,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loader: async ({ params }: { params: any }) => {
      /* Having the loader here makes it easy to 404 when a post doesn't exist.
        A downside is that it seems the loader call must finish before the page starts loading */
      const res = await fetch(`/blog/${params.slug}.md`)
      if (res.status === 404) {
        throw new Response('Not Found', { status: 404 })
      }
      return res.text()
    },
  },
  {
    path: '/404',
    title: '404',
    component: <FallbackComponent />,
  },
  {
    path: '/what-i-know-about-you',
    title: 'What I Know About You',
    component: <WhatIKnowAboutYou />,
  },
]

const allRoutes: RouteObject[] = routes.map(({ path, title, component, hideNavBar, loader }) => {
  return {
    path,
    element: (
      <Suspense /* This is shown while components are being lazy loaded */
        fallback={
          <>
            <NavBar />
            <LoadingFallback />
          </>
        }
      >
        <Helmet>
          <title>{title}</title>
          <meta property="og:title" content={title} />
          <meta name="description" content="cj.cafe" />
          <meta name="author" content="Charles Johnson" />
          <meta
            name="keywords"
            content="Programming, Coding, Software Development, Charles Johnson, cj.cafe"
          />
          <meta name="robots" content="index, follow" />
          <meta property="og:locale" content="en_US" />
        </Helmet>
        {!hideNavBar && <NavBar />}
        {component}
      </Suspense>
    ),
    errorElement: <FallbackComponent />,
    loader: loader,
  }
})

/* Deprecated route.  Redirect to new route */
allRoutes.push({
  path: '/posts',
  element: <Navigate to="/blog" replace />,
})

/* Deprecated route.  Redirect to new route */
allRoutes.push({
  path: '/posts/1',
  element: <Navigate to="/blog/chatgpt-for-developers-10-examples" replace />,
})

export const Router = () => <RouterProvider router={createBrowserRouter(allRoutes)} />
