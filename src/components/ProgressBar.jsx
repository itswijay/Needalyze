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
                  ? 'bg-[#89acd0] text-white'
                  : isCompleted
                    ? 'bg-[#1b477f] text-white'
                    : 'bg-neutral-300 text-neutral-600'
                }
              `}>
                {stepNumber}
              </div>
              
              {/* Progress Line (don't show after last step) */}
              {stepNumber < totalSteps && (
                <div className="relative h-1 w-24 mx-4 bg-neutral-300">
                  {/* Half-filled line for current step */}
                  {stepNumber === currentStep && (
                    <div className="absolute top-0 left-0 h-1 w-1/2 bg-[#89acd0]" />
                  )}
                  {/* Fully filled line for completed steps */}
                  {stepNumber < currentStep && (
                    <div className="absolute top-0 left-0 h-1 w-full bg-[#1b477f]" />
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
