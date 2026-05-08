import { clsx } from 'clsx'

interface SkeletonProps {
  className?: string
  rounded?: 'sm' | 'md' | 'lg' | 'full'
}

export default function Skeleton({ className, rounded = 'md' }: SkeletonProps) {
  return (
    <div
      className={clsx(
        'animate-pulse bg-white/5',
        {
          'rounded-sm': rounded === 'sm',
          'rounded-md': rounded === 'md',
          'rounded-lg': rounded === 'lg',
          'rounded-full': rounded === 'full',
        },
        className
      )}
    />
  )
}