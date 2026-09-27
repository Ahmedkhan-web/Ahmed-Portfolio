/** Shared button/anchor styles. `as` lets it render as <a> or <button>. */
const BASE =
  'group relative inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-medium transition-all duration-300 will-change-transform'

const VARIANTS = {
  primary:
    'bg-gradient-to-r from-accent-500 to-glow text-white shadow-[0_8px_30px_-10px] shadow-accent-500/60 hover:shadow-[0_10px_40px_-8px] hover:shadow-accent-500/80 hover:-translate-y-0.5 active:translate-y-0',
  outline:
    'border border-edge-2 bg-surface/60 text-fg backdrop-blur-sm hover:border-accent-500/60 hover:bg-surface-2 hover:-translate-y-0.5 active:translate-y-0',
  ghost: 'text-dim hover:bg-surface/70 hover:text-fg',
  soft: 'border border-accent-500/25 bg-accent-500/10 text-accent-300 hover:border-accent-400/60 hover:bg-accent-500/20',
}

const SIZES = {
  sm: 'px-4 py-2 text-[13px]',
  md: 'px-5 py-3 text-sm',
  lg: 'px-6 py-3.5 text-[15px]',
}

export default function Button({
  as: Tag = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}) {
  return (
    <Tag className={`${BASE} ${VARIANTS[variant] ?? VARIANTS.primary} ${SIZES[size] ?? SIZES.md} ${className}`} {...rest}>
      {children}
    </Tag>
  )
}
