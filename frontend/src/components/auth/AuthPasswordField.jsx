import { useState } from 'react'
import AuthField from './AuthField'
import AuthIcon from './AuthIcon'

export default function AuthPasswordField({
  id,
  label,
  labelAlt,
  value,
  onChange,
  placeholder = '••••••••••••',
  autoComplete = 'current-password',
  error,
}) {
  const [visible, setVisible] = useState(false)

  return (
    <AuthField
      id={id}
      label={label}
      labelAlt={labelAlt}
      icon="lock"
      type={visible ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={autoComplete}
      required
      error={error}
      rightElement={
        <button
          type="button"
          onClick={() => setVisible((actuel) => !actuel)}
          aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          className="absolute right-2.5 flex items-center justify-center rounded-lg p-1.5 text-brand-taupe transition-colors hover:text-brand-burnt focus:outline-none focus:ring-2 focus:ring-brand-burnt/25"
        >
          <AuthIcon name={visible ? 'eye-off' : 'eye'} />
        </button>
      }
    />
  )
}
