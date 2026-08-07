'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'

/**
 * Back / Next control for the wizard.
 *
 * The previous version built its own `baseClasses` and `gradientClasses`
 * strings and layered them over the Button variants, so the two fought:
 * rounded-md from the base then rounded-full from the override, py-2 against
 * the variant's own height. It now just picks a variant.
 */
const FormNavButton = ({
  label,
  type,
  variant = 'gradient',
  onClick,
  disabled = false,
}) => {
  const isPrev = type === 'prev'

  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={disabled}
      variant={disabled ? 'secondary' : variant}
      size="lg"
      className="group gap-1.5"
    >
      {isPrev && (
        <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-1" />
      )}
      {label}
      {!isPrev && (
        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
      )}
    </Button>
  )
}

export default FormNavButton
