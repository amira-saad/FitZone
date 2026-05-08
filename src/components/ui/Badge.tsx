import type { ReactNode } from 'react'
import { clsx } from 'clsx'

interface BadgeProps {
  children: ReactNode
  color?: 'green' | 'yellow' | 'red' | 'blue' | 'gray'
  className?: string
}

const colorMap = {
  green: 'bg-green-900/40 text-green-300 border-green-700/40',
  yellow: 'bg-yellow-900/40 text-yellow-300 border-yellow-700/40',
  red: 'bg-red-900/40 text-red-300 border-red-700/40',
  blue: 'bg-blue-900/40 text-blue-300 border-blue-700/40',
  gray: 'bg-white/5 text-white/60 border-white/10',
}

export default function Badge({ children, color = 'gray', className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
        colorMap[color],
        className
      )}
    >
      {children}
    </span>
  )
}