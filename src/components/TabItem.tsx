import { h } from "preact"

interface TabItemProps {
  label: string
  selected: boolean
  onClick: () => void
}

export default function TabItem({label, selected, onClick}: TabItemProps) {
  return (
    <div class={`px-2 py-3 cursor-pointer hover:text-01 ${selected ? 'text-01 font-semibold' : 'text-02'}`} onClick={onClick}>
      <p class="text-sm">{label}</p>
    </div>
  )
}