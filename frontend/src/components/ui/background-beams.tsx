'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function BackgroundBeams() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="absolute inset-0 overflow-hidden" />
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated beams */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
          style={{
            width: '200%',
            left: '-50%',
            top: `${(i * 12.5) + 10}%`,
            transform: `rotate(${i * 45}deg)`,
          }}
          animate={{
            x: ['-100%', '100%'],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 15 + (i * 2),
            repeat: Infinity,
            delay: i * 2,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}
