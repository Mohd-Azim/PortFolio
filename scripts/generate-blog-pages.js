import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const projectDir = path.resolve(scriptDir, '..')
const publicDir = path.join(projectDir, 'public')
const blogData = JSON.parse(await fs.readFile(path.join(projectDir, 'src/data/blog.json'), 'utf8'))
const siteUrl = 'https://mohdazim.vercel.app'

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function renderInlineMarkdown(value) {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/__([^_]+)__/g, '<strong>$1</strong>')
}

function renderMarkdown(content) {
  const formattedContent = content.replace(/(^|\n)(#{1,6}\s+[^\n]+)\n/g, '$1$2\n\n')
  const blocks = formattedContent.trim().split(/\n\s*\n/)

  return blocks.map((block) => {
    const trimmed = block.trim()
    const codeBlock = trimmed.match(/^```[a-z0-9+-]*\n([\s\S]*?)\n```$/i)
    if (codeBlock) {
      return `<pre><code>${escapeHtml(codeBlock[1])}</code></pre>`
    }

    const heading = trimmed.match(/^(#{1,6})\s+(.+)$/)
    if (heading) {
      const level = Math.min(Math.max(heading[1].length - 1, 2), 6)
      return `<h${level}>${renderInlineMarkdown(heading[2])}</h${level}>`
    }

    const lines = trimmed.split('\n')
    const renderedLines = []
    let paragraphLines = []
    let listItems = []
    let listTag = ''

    const flushParagraph = () => {
      if (paragraphLines.length) {
        renderedLines.push(`<p>${renderInlineMarkdown(paragraphLines.join(' '))}</p>`)
        paragraphLines = []
      }
    }

    const flushList = () => {
      if (listItems.length) {
        renderedLines.push(`<${listTag}>${listItems.map((item) => `<li>${renderInlineMarkdown(item)}</li>`).join('')}</${listTag}>`)
        listItems = []
        listTag = ''
      }
    }

    for (const line of lines) {
      const item = line.match(/^\s*(?:([-*])|(\d+\.))\s+(.+)$/)
      if (!item) {
        flushList()
        paragraphLines.push(line.trim())
        continue
      }

      flushParagraph()
      const nextTag = item[2] ? 'ol' : 'ul'
      if (listTag && listTag !== nextTag) flushList()
      listTag = nextTag
      listItems.push(item[3])
    }

    flushParagraph()
    flushList()
    return renderedLines.join('\n')
  }).join('\n')
}

for (const post of blogData) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.id)) {
    throw new Error(`Invalid blog post id: ${post.id}`)
  }

  const url = `${siteUrl}/blog/${post.id}/`
  const description = escapeHtml(post.excerpt)
  const publishedAt = new Date(`${post.date}T00:00:00.000Z`).toISOString()
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: post.title,
    description: post.excerpt,
    datePublished: publishedAt,
    dateModified: publishedAt,
    author: {
      '@type': 'Person',
      '@id': `${siteUrl}/#person`,
      name: 'Mohd Azim',
      url: `${siteUrl}/`,
    },
    articleSection: post.category,
    inLanguage: 'en-IN',
  }
  const html = `<!doctype html>
<html lang="en-IN">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <title>${escapeHtml(post.title)} | Mohd Azim</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${url}">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <meta property="og:type" content="article">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${escapeHtml(post.title)}">
    <meta property="og:description" content="${description}">
    <meta property="og:site_name" content="Mohd Azim">
    <meta property="og:image" content="${siteUrl}/og-image.svg">
    <meta property="article:published_time" content="${publishedAt}">
    <meta property="article:author" content="${siteUrl}/">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(post.title)}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${siteUrl}/og-image.svg">
    <script type="application/ld+json">${JSON.stringify(structuredData)}</script>
    <style>
      :root { color-scheme: light; font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; color: #191d24; background: #f7f5ef; }
      * { box-sizing: border-box; }
      body { margin: 0; color: #191d24; background: #f7f5ef; line-height: 1.75; }
      a { color: #8a3515; }
      .site-header, main, footer { width: min(100% - 2rem, 760px); margin-inline: auto; }
      .site-header { padding-block: 1.5rem; border-bottom: 1px solid #d5d0c6; }
      .site-header a { color: #191d24; text-decoration: none; font-weight: 650; }
      main { padding-block: 2rem 4rem; }
      nav[aria-label="Breadcrumb"] { font-size: .9rem; margin-bottom: 2rem; }
      .eyebrow, .meta { color: #55514a; font-size: .9rem; }
      h1 { font-size: clamp(2rem, 7vw, 3.25rem); line-height: 1.15; letter-spacing: -.035em; margin: .5rem 0 1rem; }
      .excerpt { font-size: 1.15rem; color: #37342f; }
      article { margin-top: 2.5rem; }
      article h2 { font-size: 1.5rem; line-height: 1.35; margin: 2rem 0 .75rem; }
      article h3, article h4 { line-height: 1.4; margin-top: 1.75rem; }
      article p, article li { color: #191d24; }
      article li { margin-block: .5rem; }
      pre { overflow-x: auto; padding: 1rem; border: 1px solid #d5d0c6; border-radius: .4rem; background: #eeece6; color: #191d24; }
      code { font-family: ui-monospace, SFMono-Regular, Consolas, monospace; }
      footer { border-top: 1px solid #d5d0c6; padding-block: 1.5rem 2rem; color: #45413b; }
      @media (max-width: 480px) { .site-header, main, footer { width: min(100% - 1.5rem, 760px); } }
    </style>
  </head>
  <body>
    <header class="site-header"><a href="/">Mohd Azim <span aria-hidden="true">·</span> Portfolio</a></header>
    <main>
      <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/#blog">Articles</a> / ${escapeHtml(post.title)}</nav>
      <article>
        <header>
          <p class="eyebrow">${escapeHtml(post.category)}</p>
          <h1>${escapeHtml(post.title)}</h1>
          <p class="excerpt">${description}</p>
          <p class="meta">By <a href="/">Mohd Azim</a> · <time datetime="${escapeHtml(post.date)}">${new Date(`${post.date}T00:00:00.000Z`).toLocaleDateString('en-IN', { dateStyle: 'long', timeZone: 'UTC' })}</time> · ${escapeHtml(post.readTime)}</p>
        </header>
        ${renderMarkdown(post.content)}
      </article>
    </main>
    <footer>
      <p>Written by Mohd Azim, Senior Software Engineer.</p>
      <p><a href="/#blog">More articles</a> · <a href="/#contact">Contact</a> · <a href="https://www.linkedin.com/in/mohd-azim-922373204" rel="me noopener noreferrer">LinkedIn</a></p>
    </footer>
  </body>
</html>
`

  const outputDir = path.join(publicDir, 'blog', post.id)
  await fs.mkdir(outputDir, { recursive: true })
  await fs.writeFile(path.join(outputDir, 'index.html'), html, 'utf8')
}

console.log(`Generated ${blogData.length} standalone blog pages`)
