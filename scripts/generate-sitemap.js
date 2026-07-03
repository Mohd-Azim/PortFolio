import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.resolve(__dirname, '../public')
const outputPath = path.join(publicDir, 'sitemap.xml')
const domain = 'https://mohdazim.dev'

const portfolioPath = path.join(__dirname, '../src/data/portfolio.js')
const blogDataPath = path.join(__dirname, '../src/data/blog.json')

const { portfolio } = await import(pathToFileURL(portfolioPath).href)
const blogData = JSON.parse(await fs.readFile(blogDataPath, 'utf8'))
const now = new Date().toISOString().slice(0, 10)

const sectionUrls = portfolio.navLinks.map((link) => ({
  loc: `${domain}/${link.href.replace(/^#/, '') ? `#${link.href.replace(/^#/, '')}` : ''}`,
  changefreq: 'monthly',
  priority: 0.7,
}))

const blogUrls = blogData.map((post) => ({
  loc: `${domain}/#${post.id}`,
  lastmod: post.date,
  changefreq: 'monthly',
  priority: 0.7,
}))

const staticUrls = [
  { loc: `${domain}/`, changefreq: 'monthly', priority: 1.0 },
  { loc: `${domain}/resume/resume.pdf`, changefreq: 'yearly', priority: 0.5 },
  { loc: `${domain}/llms.txt`, changefreq: 'weekly', priority: 0.3 },
  { loc: `${domain}/manifest.webmanifest`, changefreq: 'yearly', priority: 0.1 },
  { loc: `${domain}/robots.txt`, changefreq: 'weekly', priority: 0.1 },
]

const reserveSections = sectionUrls.filter((url) => url.loc !== `${domain}/`)
const entries = [...staticUrls, ...reserveSections, ...blogUrls]

const xml = [`<?xml version="1.0" encoding="UTF-8"?>`,
`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`,
`        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"`,
`        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9`,
`        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`,
'']

for (const entry of entries) {
  xml.push('  <url>')
  xml.push(`    <loc>${entry.loc}</loc>`)
  xml.push(`    <lastmod>${entry.lastmod ?? now}</lastmod>`)
  xml.push(`    <changefreq>${entry.changefreq}</changefreq>`)
  xml.push(`    <priority>${entry.priority.toFixed(1)}</priority>`)
  xml.push('  </url>')
  xml.push('')
}

xml.push('</urlset>')

await fs.writeFile(outputPath, xml.join('\n'), 'utf8')
console.log(`Generated sitemap at ${outputPath}`)
