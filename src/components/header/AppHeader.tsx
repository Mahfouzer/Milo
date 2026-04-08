import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import type { MillionaireCalculation } from '@/types'

interface AppHeaderProps {
  netWorth: string
  currency: string
  result: MillionaireCalculation | null
}

export function AppHeader(_props: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between">
      <div className="text-lg sm:text-xl font-extrabold tracking-tight text-gray-900">
        Millionair Millionair
      </div>
      <LanguageSwitcher />
    </header>
  )
}
