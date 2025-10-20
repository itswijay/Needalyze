export default function ProgressBar({ currentStep = 2, totalSteps = 4 }) {
  return (
    <div className="w-full max-w-2xl mx-auto px-8 py-8">
      <div className="flex items-center justify-center">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const isCurrentOrCompleted = stepNumber <= currentStep;
          
          return (
            <div key={stepNumber} className="flex items-center">
              {/* Step Circle */}
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                ${isActive 
                  ? 'bg-[var(--primary-200)] border border-[var(--primary-400)] text-white'
                  : isCompleted
                    ? 'bg-[var(--primary-300)] border border-[var(--primary-400)] text-white'
                    : 'bg-neutral-300 border border-[var(--gray-200)] text-neutral-600'
                }
              `}>
                {stepNumber}
              </div>
              
              {/* Progress Line (don't show after last step) */}
              {stepNumber < totalSteps && (
                <div className="relative h-1 w-24 mx-4 bg-neutral-300 border border-[var(--gray-200)] rounded-full">
                  {/* Half-filled line for current step */}
                  {stepNumber === currentStep && (
                    <div className="absolute top-0 left-0 h-1 w-1/2 bg-[var(--primary-200)] border border-[var(--primary-400)] rounded-full" />
                  )}
                  {/* Fully filled line for completed steps */}
                  {stepNumber < currentStep && (
                    <div className="absolute top-0 left-0 h-1 w-full bg-[var(--primary-300)] border border-[var(--primary-400)] rounded-full" />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
