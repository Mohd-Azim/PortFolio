import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, BookOpen, Calendar, Clock, X, ArrowUpRight } from 'lucide-react'
import blogData from '../data/blog.json'

export default function Blog() {
  const [sortedBlogs, setSortedBlogs] = useState([])
  const [activeBlog, setActiveBlog] = useState(null) // For the reading modal
  const sliderRef = useRef(null)

  useEffect(() => {
    // Sort latest first and slice the 5 most recent articles
    const processed = [...blogData]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
    setSortedBlogs(processed)
  }, [])

  const scroll = (direction) => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current
      const offset = direction === 'left' ? -clientWidth / 1.4 : clientWidth / 1.4
      sliderRef.current.scrollTo({ left: scrollLeft + offset, behavior: 'smooth' })
    }
  }

  // Prevent scroll when modal is active
  useEffect(() => {
    if (activeBlog) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [activeBlog])

  return (
    <section id="blog" className="relative z-10 py-24 bg-secondary/15">
      <div className="section-container">
        
        {/* Header with Slider Controls */}
        <div className="flex items-end justify-between select-none">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-medium text-primary">Articles</p>
            <h2 className="section-title mt-2">Latest Insights</h2>
            <p className="section-subtitle">
              Sharing concepts about RAG pipelines, distributed systems, and JVM internals.
            </p>
          </motion.div>

          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2.5 rounded-lg border border-border bg-card/60 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
              aria-label="Slide left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2.5 rounded-lg border border-border bg-card/60 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
              aria-label="Slide right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Carousel Slider */}
        <div 
          ref={sliderRef}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          className="mt-12 flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4 snap-x snap-mandatory"
        >
          {sortedBlogs.map((post, index) => (
            <motion.button
              type="button"
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="snap-start shrink-0 w-[290px] sm:w-[350px] glass-card p-6 flex flex-col justify-between hover:border-primary/45 transition-colors group cursor-pointer text-left"
              onClick={() => setActiveBlog(post)}
              aria-haspopup="dialog"
              aria-controls="blog-modal"
            >
              <div>
                {/* Meta details */}
                <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground mb-4 select-none">
                  <span className="px-2 py-0.5 rounded border border-primary/20 bg-primary/5 text-primary uppercase font-bold">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={10} />
                    {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <h3 className="text-base font-bold text-foreground mb-3 leading-snug group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                  {post.excerpt}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-border/40 pt-4 select-none">
                <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                  <Clock size={10} />
                  {post.readTime}
                </span>
                
                <span className="text-xs text-primary font-semibold flex items-center gap-0.5 group-hover:underline">
                  Read Article
                  <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Read Article Modal */}
        <AnimatePresence>
          {activeBlog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999] bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
              onClick={() => setActiveBlog(null)}
              role="dialog"
              aria-modal="true"
              aria-labelledby="blog-modal-title"
            >
              <motion.div
                id="blog-modal"
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="bg-card border border-border shadow-2xl rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between bg-muted/20 select-none">
                  <div className="flex items-center gap-2 text-primary font-mono text-xs">
                    <BookOpen size={14} />
                    <span>READING INDEX</span>
                  </div>
                  <button
                    onClick={() => setActiveBlog(null)}
                    aria-label="Close blog article"
                    className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 select-text no-scrollbar">
                  {/* Category, Date, readTime */}
                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground mb-4 select-none">
                    <span className="px-2 py-0.5 rounded border border-primary/20 bg-primary/5 text-primary uppercase font-bold">
                      {activeBlog.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(activeBlog.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {activeBlog.readTime}
                    </span>
                  </div>

                  <h1 id="blog-modal-title" className="text-xl md:text-3xl font-bold text-foreground mb-6 leading-tight">
                    {activeBlog.title}
                  </h1>

                  {/* Body paragraphs mapped */}
                  <div className="text-sm md:text-base text-zinc-300 leading-relaxed space-y-4">
                    {activeBlog.content.split('\n\n').map((paragraph, index) => {
                      if (paragraph.startsWith('### ')) {
                        return (
                          <h3 key={index} className="text-base md:text-lg font-bold text-foreground pt-4 mb-2">
                            {paragraph.replace('### ', '')}
                          </h3>
                        )
                      }
                      if (paragraph.startsWith('* ')) {
                        return (
                          <ul key={index} className="space-y-1 pl-4 list-disc text-sm md:text-base text-zinc-300">
                            {paragraph.split('\n').map((item, idx) => (
                              <li key={idx}>{item.replace('* ', '')}</li>
                            ))}
                          </ul>
                        )
                      }
                      if (paragraph.startsWith('```java')) {
                        const code = paragraph.replace('```java\n', '').replace('```', '')
                        return (
                          <pre key={index} className="p-4 rounded-lg bg-black/45 border border-border/50 overflow-x-auto text-xs md:text-sm font-mono text-emerald-400 my-4 leading-relaxed">
                            <code>{code}</code>
                          </pre>
                        )
                      }
                      return (
                        <p key={index}>
                          {paragraph}
                        </p>
                      )
                    })}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-border/50 bg-muted/20 flex justify-end select-none">
                  <button
                    onClick={() => setActiveBlog(null)}
                    className="px-5 py-2 rounded-lg bg-secondary hover:bg-muted text-foreground transition-all text-xs font-semibold border border-border"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
      
      {/* Dynamic encapsulated scrollbar hidden utility */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none !important;
        }
      `}</style>
    </section>
  )
}
