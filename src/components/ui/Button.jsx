/** Shared button/anchor styles. `as` lets it render as <a> or <button>. */
const BASE =
  'group inline-flex items-center justify-center gap-2 rounded-pill font-medium uppercase tracking-[0.08em] transition-colors duration-300 select-none'

/* Primary inverts on hover: solid green becomes a green outline. */
const VARIANTS = {
  primary:
    'border border-accent bg-accent text-bg hover:bg-transparent hover:text-accent active:bg-accent-wash',
  outline:
    'border border-line-strong text-fg hover:border-accent hover:text-accent active:bg-accent-wash',
  ghost: 'border border-transparent text-dim hover:text-accent',
  soft: 'border border-accent-muted bg-accent-wash text-accent hover:border-accent hover:bg-transparent',
}

const SIZES = {
  sm: 'px-5 py-2 text-[11px]',
  md: 'px-6 py-3 text-[12px]',
  lg: 'px-8 py-3.5 text-[13px]',
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
    <Tag
      className={`${BASE} ${VARIANTS[variant] ?? VARIANTS.primary} ${SIZES[size] ?? SIZES.md} ${disabled(Tag, rest) ? 'cursor-not-allowed opacity-50' : ''} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}

function disabled(Tag, props) {
  return Tag === 'button' && props.disabled
}
