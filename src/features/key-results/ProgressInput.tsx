import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

interface ProgressInputProps {
  currentValue: number
  targetValue: number
  onSave: (value: number) => void
  isLoading?: boolean
}

export function ProgressInput({
  currentValue,
  targetValue,
  onSave,
  isLoading = false,
}: ProgressInputProps) {
  const [value, setValue] = useState(currentValue.toString())
  const hasChanged = Number(value) !== currentValue

  const handleSave = () => {
    const numValue = Number(value)
    if (!isNaN(numValue) && numValue >= 0) {
      onSave(numValue)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && hasChanged) {
      e.preventDefault()
      handleSave()
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        min={0}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="h-8 w-24"
        disabled={isLoading}
      />
      <span className="text-sm text-muted-foreground">/ {targetValue}</span>
      {hasChanged && (
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={handleSave}
          disabled={isLoading}
        >
          <Check className="h-4 w-4" />
          <span className="sr-only">Save progress</span>
        </Button>
      )}
    </div>
  )
}
