import { Card, CardAction, CardHeader, CardTitle } from '@/components/ui/card'

const Cards = ({ cardData }) => {
  return (
    <div className="mt-2 pt-4">
      {/* grid 1 */}
      <div className="grid grid-cols-2 gap-x-4 md:gap-x-5">
        <Card className="sm:border-l-6 border-l-4 border-l-[var(--primary-200)] h-18 sm:h-20 w-full py-4 sm:py-6">
          <CardHeader>
            <CardTitle>
              <h1 className="text-xs sm:text-base font-medium line-clamp-2">
                Completed Forms
              </h1>
            </CardTitle>

            <CardAction>
              <span className="text-[var(--primary-200)] text-2xl sm:text-4xl font-semibold">
                {cardData.completedForms}
              </span>
            </CardAction>
          </CardHeader>
        </Card>
        <Card className="sm:border-l-6 border-l-4 border-l-[var(--primary-200)] h-18 sm:h-20 w-full py-4 sm:py-6">
          <CardHeader>
            <CardTitle>
              <h1 className="text-xs sm:text-base font-medium line-clamp-2">In Progress</h1>
            </CardTitle>

            <CardAction>
              <span className="text-[var(--primary-200)] text-2xl sm:text-4xl font-semibold">
                {cardData.inProgress}
              </span>
            </CardAction>
          </CardHeader>
        </Card>
      </div>
      {/* grid 2 */}
      <div className="grid sm:grid-cols-3 grid-cols-2 mt-4 sm:mt-6 gap-x-4 gap-y-3 md:gap-x-5 md:gap-y-5">
        <Card className="sm:border-l-6 border-l-4 border-l-emerald-400 h-18 sm:h-20 w-full py-4 sm:py-6">
          <CardHeader>
            <CardTitle>
              <h1 className="text-xs sm:text-base font-medium line-clamp-2">Health</h1>
            </CardTitle>

            <CardAction>
              <span className="text-[var(--primary-200)] text-2xl sm:text-4xl font-semibold">
                {cardData.categories.health}
              </span>
            </CardAction>
          </CardHeader>
        </Card>
        <Card className="sm:border-l-6 border-l-4 border-l-emerald-400 h-18 sm:h-20 w-full py-4 sm:py-6">
          <CardHeader>
            <CardTitle>
              <h1 className="text-xs sm:text-base font-medium line-clamp-2">Education</h1>
            </CardTitle>

            <CardAction>
              <span className="text-[var(--primary-200)] text-2xl sm:text-4xl font-semibold">
                {cardData.categories.education}
              </span>
            </CardAction>
          </CardHeader>
        </Card>
        <Card className="sm:border-l-6 border-l-4 border-l-emerald-400 h-18 sm:h-20 w-full py-4 sm:py-6">
          <CardHeader>
            <CardTitle>
              <h1 className="text-xs sm:text-base font-medium line-clamp-2">Pension Fund</h1>
            </CardTitle>

            <CardAction>
              <span className="text-[var(--primary-200)] text-2xl sm:text-4xl font-semibold">
                {cardData.categories.pensionfund}
              </span>
            </CardAction>
          </CardHeader>
        </Card>

        {/* grid 3 */}

        <Card className="sm:border-l-6 border-l-4  border-l-emerald-400 h-18 sm:h-20 w-full py-4 sm:py-6">
          <CardHeader>
            <CardTitle className="">
              <h1 className="text-xs sm:text-base font-medium line-clamp-2 leading-tight">
                Dependents Cost of Living
              </h1>
            </CardTitle>

            <CardAction>
              <span className="text-[var(--primary-200)] text-2xl sm:text-4xl font-semibold">
                {cardData.categories.DependentsCostofLiving}
              </span>
            </CardAction>
          </CardHeader>
        </Card>
        <Card className="sm:border-l-6 border-l-4 border-l-emerald-400 h-18 sm:h-20 w-full py-4 sm:py-6">
          <CardHeader>
            <CardTitle>
              <h1 className="text-xs sm:text-base font-medium line-clamp-2 leading-tight">
                Long Term Savings
              </h1>
            </CardTitle>

            <CardAction>
              <span className="text-[var(--primary-200)] text-2xl sm:text-4xl font-semibold">
                {cardData.categories.longTermSavings}
              </span>
            </CardAction>
          </CardHeader>
        </Card>
        <Card className="sm:border-l-6 border-l-4 border-l-emerald-400 h-18 sm:h-20 w-full py-4 sm:py-6">
          <CardHeader>
            <CardTitle>
              <h1 className="text-xs sm:text-base font-medium line-clamp-2 leading-tight">
                Short Term Savings
              </h1>
            </CardTitle>

            <CardAction>
              <span className="text-[var(--primary-200)] text-2xl sm:text-4xl font-semibold">
                {cardData.categories.shortTermSavings}
              </span>
            </CardAction>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}

export default Cards
