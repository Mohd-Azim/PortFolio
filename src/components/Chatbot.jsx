import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send, Bot, User } from 'lucide-react'
import chatbotData from '../data/chatbot-data.json'

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hi there! 👋 I'm Azim's Bot Assistant. Ask me anything about my tech stack, experience at Paytm, AI work, or how to schedule a call!"
    }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [inputVal, setInputVal] = useState('')
  const chatBodyRef = useRef(null)
  const [showPromo, setShowPromo] = useState(false)

  // Trigger speech bubble tooltip every 11 seconds (show for 3.5s, hide for 7.5s)
  useEffect(() => {
    if (isOpen) {
      setShowPromo(false)
      return
    }

    const showTimer = setTimeout(() => {
      setShowPromo(true)
    }, 3000)

    const interval = setInterval(() => {
      setShowPromo(true)
      const hideTimer = setTimeout(() => {
        setShowPromo(false)
      }, 3500)
      return () => clearTimeout(hideTimer)
    }, 12000)

    return () => {
      clearTimeout(showTimer)
      clearInterval(interval)
    }
  }, [isOpen])

  // Scroll to bottom on new messages
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleSendMessage = (text) => {
    if (!text.trim()) return

    // 1. Add User Message
    const userMsg = { sender: 'user', text }
    setMessages((prev) => [...prev, userMsg])
    setIsTyping(true)

    // 2. Process Response
    setTimeout(() => {
      let botResponseText = ''
      const cleanedInput = text.toLowerCase().trim()

      // Find match based on keywords
      const match = chatbotData.find((qa) => {
        const questionLower = qa.question.toLowerCase()
        // Check if input matches or is contained in preloaded questions, or matches key terms
        if (cleanedInput.includes(qa.id)) return true
        if (questionLower.includes(cleanedInput) || cleanedInput.includes(questionLower)) return true
        
        // Custom keyword sets for broader hits
        const keywords = {
          stack: ['stack', 'tech', 'language', 'java', 'spring', 'python', 'skills', 'javascript', 'react'],
          paytm: ['paytm', 'modernization', 'billing', 'subscription', 'one97'],
          ai: ['ai', 'spring ai', 'langchain4j', 'llm', 'rag', 'gpt', 'incident', 'operational'],
          sapient: ['sapient', 'publicis', 'trading', 'endur', 'etrm'],
          contact: ['schedule', 'call', 'meet', 'phone', 'contact', 'hire', 'interview', 'calendar', 'email'],
          availability: ['job', 'open', 'contract', 'availability', 'opportunity', 'remote', 'work']
        }
        
        return keywords[qa.id]?.some(keyword => cleanedInput.includes(keyword))
      })

      if (match) {
        botResponseText = match.answer
      } else {
        // Default response guiding them to the form
        botResponseText = "I'm a preloaded Q&A assistant and couldn't find a exact match for that query. 🛠️ Please try clicking one of the quick suggestions below, or fill out the Contact Form below to schedule a direct call with Azim!"
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: botResponseText }])
      setIsTyping(false)
    }, 900)
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (!inputVal.trim()) return
    handleSendMessage(inputVal)
    setInputVal('')
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 font-sans select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="mb-4 w-[350px] sm:w-[380px] h-[500px] rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-muted/40 px-4 py-3.5 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Bot size={18} />
                  <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-background" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground leading-tight">Azim&apos;s Assistant</h4>
                  <p className="text-[10px] text-emerald-400 font-medium font-mono leading-none">● ONLINE</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted/60"
              >
                <X size={18} />
              </button>
            </div>

            {/* Message Area */}
            <div
              ref={chatBodyRef}
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              className="flex-1 p-4 overflow-y-auto space-y-4 select-text bg-black/10 no-scrollbar"
            >
              <style>{`
                .no-scrollbar::-webkit-scrollbar {
                  display: none !important;
                }
              `}</style>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-1">
                      <Bot size={14} />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-primary text-primary-foreground font-medium rounded-tr-none'
                        : 'bg-muted/80 text-foreground border border-border/40 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.sender === 'user' && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary/80 text-muted-foreground mt-1">
                      <User size={14} />
                    </div>
                  )}
                </div>
              ))}

              {/* Bot typing bubble */}
              {isTyping && (
                <div className="flex gap-2.5 justify-start">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-1 animate-pulse">
                    <Bot size={14} />
                  </div>
                  <div className="bg-muted/80 border border-border/40 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Suggestion Chips */}
            <div className="px-4 py-2 bg-muted/20 border-t border-border/30">
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider mb-1.5">Suggestions:</p>
              <div className="flex flex-wrap gap-1.5 max-h-[85px] overflow-y-auto">
                {chatbotData.map((qa) => (
                  <button
                    key={qa.id}
                    type="button"
                    onClick={() => handleSendMessage(qa.question)}
                    className="text-[11px] text-left text-primary hover:text-primary-foreground border border-primary/20 hover:bg-primary/95 px-2.5 py-1 rounded-full transition-all duration-200"
                  >
                    {qa.question.replace('What is your ', '').replace('Tell me about your ', '').replace('How can I ', '')}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Box */}
            <form
              onSubmit={handleFormSubmit}
              className="p-3 bg-muted/40 border-t border-border/50 flex gap-2"
            >
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask me a question..."
                className="flex-1 rounded-lg border border-border/60 bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 text-foreground"
              />
              <button
                type="submit"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Speech Bubble Tooltip */}
      <AnimatePresence>
        {!isOpen && showPromo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            className="absolute bottom-16 right-0 mb-2 w-44 p-3 rounded-2xl bg-card border border-border shadow-2xl text-xs text-foreground font-mono text-center"
          >
            <div className="font-semibold text-primary mb-1 flex items-center justify-center gap-1">
              <Bot size={12} className="animate-pulse" /> Assistant
            </div>
            How may I help you?
            <div className="absolute bottom-[-5px] right-6 w-2.5 h-2.5 bg-card border-r border-b border-border rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}

        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg hover:shadow-primary/30 transition-all select-none"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close-icon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="chat-icon"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative"
            >
              <MessageSquare size={24} />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400" />
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
