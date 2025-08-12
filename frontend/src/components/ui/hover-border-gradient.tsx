'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface HoverBorderGradientProps {
  children: React.ReactNode
  containerClassName?: string
  className?: string
  as?: React.ElementType
  duration?: number
  clockwise?: boolean
  [key: string]: any
}

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = 'button',
  duration = 1,
  clockwise = true,
  ...otherProps
}: HoverBorderGradientProps) {
  return (
    <Tag
      className={cn(
        'relative p-[1px] overflow-hidden bg-transparent',
        containerClassName
      )}
      {...otherProps}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
        animate={{
          rotate: clockwise ? 360 : -360,
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          background: 'conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)',
        }}
      />
      <div
        className={cn(
          'relative bg-black rounded-[inherit] z-10',
          className
        )}
      >
        {children}
      </div>
    </Tag>
  )
}
