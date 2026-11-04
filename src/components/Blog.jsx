import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Calendar, Clock, ArrowUpRight } from 'lucide-react'
import blogData from '../data/blog.json'

export default function Blog() {
  const sliderRef = useRef(null)
  const sortedBlogs = [...blogData]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  const scroll = (direction) => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current
      const offset = direction === 'left' ? -clientWidth / 1.4 : clientWidth / 1.4
      sliderRef.current.scrollTo({ left: scrollLeft + offset, behavior: 'smooth' })
    }
  }

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
              Notes from backend development: Spring, Java, transactions, and distributed systems.
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
          className="mt-12 flex gap-6 overflow-x-auto overscroll-x-contain no-scrollbar scroll-smooth pb-4 snap-x snap-mandatory"
        >
          {sortedBlogs.map((post, index) => (
            <motion.a
              key={post.id}
              href={`/blog/${post.id}/`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="snap-start shrink-0 w-[290px] sm:w-[350px] glass-card p-6 flex flex-col justify-between hover:border-primary/45 transition-colors group text-left"
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
            </motion.a>
          ))}
        </div>
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
