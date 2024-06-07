import { h } from "preact"

interface ButtonProps {
  label: string
  fullWidth?: boolean
  size?: 'regular' | 'compact'
  disabled?: boolean
  onClick?: () => void
  isFormSubmit?: boolean
}

export default function Button({label, fullWidth, size = 'regular', disabled = false, onClick, isFormSubmit = false}: ButtonProps) {
  const buttonProps = isFormSubmit
  ? { type: "submit", disabled }
  : { onClick, disabled };

  return (
    <button
      {...buttonProps}
      class={`interactive-01 text-white font-semibold rounded-lg${fullWidth ? " w-full" : ""} ${size === "compact" ? " text-xs py-2 px-3" : " text-base py-2 px-3"}${disabled ? " interactive-disabled" : " hover:opacity-80"}`}
    >
      {label}
    </button>
  )
}