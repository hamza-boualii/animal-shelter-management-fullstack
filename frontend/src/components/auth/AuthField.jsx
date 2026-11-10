import AuthIcon from './AuthIcon'

export default function AuthField({
  id,
  label,
  labelAlt,
  icon,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  required = false,
  error,
  rightElement,
}) {
  const hasError = Boolean(error)

  return (
    <div className="space-y-1.5 text-left">
      <label htmlFor={id} className="flex items-center justify-between gap-3 text-[13px] font-semibold text-brand-dark">
        <span>
          {label}
          {required && <span className="ml-1 text-brand-burnt">*</span>}
        </span>
        {labelAlt && (
          <span className="text-[12px] font-normal text-brand-taupe">{labelAlt}</span>
        )}
      </label>
      <div className="relative flex items-center">
        <span className="pointer-events-none absolute left-3.5 flex items-center text-brand-taupe/80">
          <AuthIcon name={icon} />
        </span>
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : undefined}
          className={`h-12 w-full rounded-xl bg-white pl-11 text-[15px] text-brand-dark shadow-[0px_1px_3px_rgba(52,46,43,0.05),0px_1px_2px_rgba(52,46,43,0.03)] outline-none transition-all placeholder:text-brand-taupe/60 focus:border-brand-burnt/60 focus:shadow-[0px_0px_0px_3.5px_rgba(198,83,53,0.18)] ${
            rightElement ? 'pr-11' : 'pr-4'
          } ${
            hasError
              ? 'border border-rose-500/70 bg-rose-50/40 focus:border-rose-600 focus:shadow-[0px_0px_0px_3.5px_rgba(225,29,72,0.15)]'
              : 'border border-brand-stone/70'
          }`}
        />
        {rightElement}
      </div>
      {hasError && (
        <p id={`${id}-error`} role="alert" className="text-[12px] font-medium text-rose-700">
          {error}
        </p>
      )}
    </div>
  )
}
