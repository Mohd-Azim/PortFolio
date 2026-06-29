import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { RotateCw, CornerDownRight, Sparkles } from 'lucide-react'

export default function SarcasticMessage({ onReplay, onSkip }) {
  useEffect(() => {
    // Lock scroll while overlay is active
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-zinc-950 font-sans select-none overflow-hidden px-4">
      {/* Background visual cue grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 150 }}
        className="glass-card p-8 max-w-md w-full text-center relative border border-primary/20 bg-card/80 backdrop-blur-xl shadow-2xl"
      >
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6 animate-pulse">
          <Sparkles size={24} />
        </div>

        <h3 className="text-xl font-bold font-mono tracking-tight text-foreground mb-4">
          Wait... Refreshing already? 😉
        </h3>
        
        <p className="text-sm text-muted-foreground leading-relaxed mb-6 font-mono">
          Ah, so you really liked that countdown, didn&apos;t you?
          We don&apos;t blame you—it was pretty explosive! 
        </p>

        <p className="text-xs text-primary/80 bg-primary/5 border border-primary/10 rounded-lg p-3 mb-8 font-mono flex items-center gap-2 text-left">
          <RotateCw size={14} className="shrink-0 text-primary animate-spin" style={{ animationDuration: '6s' }} />
          <span>
            <strong>Pro Tip:</strong> Click the button below to see the launch sequence again, or refresh the page once more to trigger it automatically!
          </span>
        </p>

        <div className="flex flex-col gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onReplay}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 font-mono shadow-lg shadow-primary/20"
          >
            Replay Countdown 🚀
          </motion.button>
          
          <button
            onClick={onSkip}
            className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors font-mono py-2 inline-flex items-center justify-center gap-1"
          >
            <span>Skip and enter portfolio</span>
            <CornerDownRight size={12} />
          </button>
        </div>
      </motion.div>
    </div>
  )
}
