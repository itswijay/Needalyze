export default function ProgressBar({
  currentStep = 2,
  totalSteps = 4,
  onStepClick,
}) {
  const handleStepClick = (stepNumber) => {
    // Only allow navigation to completed steps (not current step)
    if (stepNumber < currentStep && onStepClick) {
      onStepClick(stepNumber)
    }
  }

  return (
    <div className="w-full max-w-xs sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
      <div className="flex items-center justify-center">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isCompleted = stepNumber < currentStep
          const isClickable = isCompleted && onStepClick

          return (
            <div key={stepNumber} className="flex items-center">
              {/* Step Circle */}
              <div
                onClick={() => handleStepClick(stepNumber)}
                className={`
                  w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold
                  transition-all duration-200
                  ${
                    isActive
                      ? 'bg-[var(--primary-200)] border border-[var(--primary-400)] text-white'
                      : isCompleted
                      ? 'bg-[var(--primary-300)] border border-[var(--primary-400)] text-white'
                      : 'bg-neutral-300 border border-[var(--gray-200)] text-neutral-600'
                  }
                  ${
                    isClickable
                      ? 'cursor-pointer hover:scale-110 hover:shadow-lg'
                      : 'cursor-default'
                  }
                `}
                title={
                  isClickable
                    ? `Go to Step ${stepNumber}`
                    : isActive
                    ? `Current Step`
                    : `Step ${stepNumber}`
                }
              >
                {stepNumber}
              </div>

              {/* Progress Line (don't show after last step) */}
              {stepNumber < totalSteps && (
                <div className="relative h-0.5 sm:h-1 w-12 sm:w-16 md:w-20 lg:w-24 mx-2 sm:mx-3 md:mx-4 bg-neutral-300 border border-[var(--gray-200)] rounded-full">
                  {/* Half-filled line for current step */}
                  {stepNumber === currentStep && (
                    <div className="absolute top-0 left-0 h-0.5 sm:h-1 w-1/2 bg-[var(--primary-200)] border border-[var(--primary-400)] rounded-full" />
                  )}
                  {/* Fully filled line for completed steps */}
                  {stepNumber < currentStep && (
                    <div className="absolute top-0 left-0 h-0.5 sm:h-1 w-full bg-[var(--primary-300)] border border-[var(--primary-400)] rounded-full" />
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
