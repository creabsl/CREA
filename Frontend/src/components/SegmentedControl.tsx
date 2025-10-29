export default function SegmentedControl<T extends string>({ options, value, onChange }: { options: { label: string; value: T }[]; value: T; onChange: (v: T) => void }) {
  return (
  <div className="inline-flex rounded-md border border-default bg-white p-1 shadow-sm">
      {options.map((o) => (
    <button key={o.value} onClick={() => onChange(o.value)} className={`px-3 py-1 text-sm rounded no-underline ${o.value===value ? 'bg-brand-700 text-white' : 'text-brand hover:bg-brand-50'}`}>
          {o.label}
        </button>
      ))}
    </div>
  )
}
