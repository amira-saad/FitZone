import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center font-display font-600 tracking-wide transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed',
        {
          // variants
          'bg-brand-green text-brand-darker hover:bg-brand-green-dim':
            variant === 'primary',
          'border border-brand-green text-brand-green hover:bg-brand-green hover:text-brand-darker':
            variant === 'outline',
          'text-brand-muted hover:text-white hover:bg-white/5':
            variant === 'ghost',
          // sizes
          'text-xs px-3 py-1.5 rounded-md': size === 'sm',
          'text-sm px-5 py-2.5 rounded-lg': size === 'md',
          'text-base px-8 py-3.5 rounded-xl': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}