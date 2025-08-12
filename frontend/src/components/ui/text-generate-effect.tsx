'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TextGenerateEffectProps {
  words: string
  className?: string
}

export function TextGenerateEffect({ words, className }: TextGenerateEffectProps) {
  const wordsArray = words.split(' ')

  return (
    <div className={cn('', className)}>
      {wordsArray.map((word, idx) => (
        <motion.span
          key={word + idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: idx * 0.1,
          }}
          className="inline-block mr-2"
        >
          {word}
        </motion.span>
      ))}
    </div>
  )
}
