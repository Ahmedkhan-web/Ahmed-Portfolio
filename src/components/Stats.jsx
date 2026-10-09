import { hero } from '@/data/portfolio.js'

export default function Stats() {
  return (
    <dl
      data-stats
      className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4 sm:gap-x-6 sm:[&>div:not(:first-child)]:before:absolute sm:[&>div:not(:first-child)]:before:left-0 sm:[&>div:not(:first-child)]:before:top-1/2 sm:[&>div:not(:first-child)]:before:h-9 sm:[&>div:not(:first-child)]:before:w-px sm:[&>div:not(:first-child)]:before:-translate-y-1/2 sm:[&>div:not(:first-child)]:before:bg-edge"
    >
      {hero.stats.map(({ value, label }) => (
        <div
          key={label}
          className="relative flex min-w-0 flex-col items-center px-2 text-center"
        >
          <dt className="mt-1.5 font-mono text-[9.5px] font-medium uppercase leading-tight tracking-[0.16em] text-accent-300 sm:text-[10px]">
            {label}
          </dt>
          <dd data-stat-value={value} className="order-first font-display text-[2rem] font-bold leading-none tracking-[-0.04em] tabular-nums text-fg sm:text-[2.4rem] lg:text-[2.8rem]">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  )
}
