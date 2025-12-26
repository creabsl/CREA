export default function SegmentedControl<T extends string>({ options, value, onChange }: { options: { label: string; value: T }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="inline-flex min-w-full sm:min-w-0 rounded-md border border-default bg-white p-1 shadow-sm">
        {options.map((o) => (
          <button 
            key={o.value} 
            onClick={() => onChange(o.value)} 
            className={`flex-1 sm:flex-none px-2.5 sm:px-3 py-1.5 sm:py-1 text-xs sm:text-sm rounded no-underline whitespace-nowrap transition-colors ${o.value===value ? 'bg-brand-700 text-white font-semibold' : 'text-brand hover:bg-brand-50'}`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}
