/* eslint-disable react/no-children-prop */
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism-light'
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { ClassAttributes, FC, HTMLAttributes } from 'react'
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx'
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown'
import scheme from 'react-syntax-highlighter/dist/esm/languages/prism/scheme'
import hcl from 'react-syntax-highlighter/dist/esm/languages/prism/hcl'
import docker from 'react-syntax-highlighter/dist/esm/languages/prism/docker'
import nginx from 'react-syntax-highlighter/dist/esm/languages/prism/nginx'
import ReactMarkdown, { ExtraProps } from 'react-markdown'
import { useLoaderData } from 'react-router-dom'
import { parseMarkdownHeaders } from '../util/util'
import rehypeRaw from 'rehype-raw'

/* Because we are using prism-light, we need to register the languages we want to use
xml and js seem to be supported out of the box for some unknown reason */
SyntaxHighlighter.registerLanguage('jsx', jsx)
SyntaxHighlighter.registerLanguage('markdown', markdown)
SyntaxHighlighter.registerLanguage('scheme', scheme)
SyntaxHighlighter.registerLanguage('hcl', hcl)
SyntaxHighlighter.registerLanguage('docker', docker)
SyntaxHighlighter.registerLanguage('nginx', nginx)

type CodeBlockProps = ClassAttributes<HTMLElement> & HTMLAttributes<HTMLElement> & ExtraProps

/* If code is detected, show code block with syntax highlighting */
const CodeBlock = (props: CodeBlockProps) => {
  const { children, className, ...rest } = props

  /* In the markdown files, the code blocks are specified like this:

  ```nginx:nginx.conf
  {some code goes here}
  ```

  or just 

  ```nginx
  {some code goes here}
  ```

  This regex matches the language (eg nginx) and filename (eg nginx.conf) 
   and the code after that renders the code block
  */

  const match = /language-(\w+)(?::([^ ]+))?/.exec(className || '')
  const language = match ? match[1] : undefined /* eg 'nginx' 'xml', 'js', 'jsx', or 'markdown' */
  const fileName = match && match[2] ? match[2] : undefined /* eg 'nginx.conf', 'foo.js' */
  const res = match ? (
    <>
      {/* Show filename as label if it exists */}
      {fileName ?? <div>{fileName}</div>}
      <SyntaxHighlighter
        language={language}
        PreTag="div"
        {...rest}
        children={String(children).replace(/\n$/, '')}
        style={materialDark}
        wrapLongLines={false}
        ref={null} /* Override ref because the types are not compatible */
      />
    </>
  ) : (
    <code {...rest} className={className}>
      {children}
    </code>
  )

  return <div className="text-xs">{res}</div>
}

export const BlogPost: FC = () => {
  const contentWithMetadata = useLoaderData() as string /* Data is loaded in Router */

  type MarkdownHeaderTags = {
    title: string
    date: string
    tags: string
  }

  const { title } = parseMarkdownHeaders<MarkdownHeaderTags>(contentWithMetadata)

  /* Remove the metadata at the top of the content.  Metadata begins and ends with --- */
  const content = contentWithMetadata.replace(/(---[\s\S]*?)---/, '')

  return (
    <>
      <article>
        <title>{title}</title>
      </article>
      <div className="flex justify-center">
        <article className="prose prose-sm  m-4 md:prose-base md:m-20 overflow-hidden leading-7 text-opacity-80">
          <ReactMarkdown
            children={content}
            // Allows raw html in markdown. Useful for rendering images with specific sizes
            rehypePlugins={[rehypeRaw]}
            components={{ code: (props) => CodeBlock(props) }}
          />
        </article>
      </div>
    </>
  )
}
