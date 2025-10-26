import { Card, CardAction, CardHeader, CardTitle } from "@/components/ui/card";

const Cards = () => {
  return (
    <div className="mt-3 p-4 mx-auto max-w-7xl">
      {/* grid 1 */}
      <div className="grid  grid-cols-2  justify-items-center gap-x-3">
        <Card className="lg:border-l-6 border-l-5 border-l-[var(--primary-200)] lg:h-25 lg:w-137 h-22 w-48 ">
          <CardHeader>
            <CardTitle>
              <h1 className="lg:text-lg text-sm font-medium">
                Completed Forms
              </h1>
            </CardTitle>

            <CardAction>
              <span className="text-[var(--primary-200)] lg:text-5xl text-4xl font-semibold">
                46
              </span>
            </CardAction>
          </CardHeader>
        </Card>
        <Card className="lg:border-l-6 border-l-5 border-l-[var(--primary-200)] lg:h-25 lg:w-137 h-22 w-48">
          <CardHeader>
            <CardTitle>
              <h1 className="lg:text-lg text-sm font-medium">In Progress</h1>
            </CardTitle>

            <CardAction>
              <span className="text-[var(--primary-200)] lg:text-5xl text-4xl font-semibold">
                10
              </span>
            </CardAction>
          </CardHeader>
        </Card>
      </div>
      {/* grid 2 */}
      <div className="grid lg:grid-cols-3 grid-cols-2 mt-7 justify-items-center space-y-6 gap-x-3">
        <Card className="lg:border-l-6 border-l-5 border-l-emerald-500 lg:h-25 lg:w-85 h-22 w-48">
          <CardHeader>
            <CardTitle>
              <h1 className="lg:text-lg text-xs font-medium">Health</h1>
            </CardTitle>

            <CardAction>
              <span className="text-[var(--primary-200)] lg:text-5xl text-3xl font-semibold">
                8
              </span>
            </CardAction>
          </CardHeader>
        </Card>
        <Card className="lg:border-l-6 border-l-5 border-l-emerald-500 lg:h-25 lg:w-85 h-22 w-48">
          <CardHeader>
            <CardTitle>
              <h1 className="lg:text-lg text-xs font-medium">Education</h1>
            </CardTitle>

            <CardAction>
              <span className="text-[var(--primary-200)] lg:text-5xl text-3xl font-semibold">
                12
              </span>
            </CardAction>
          </CardHeader>
        </Card>
        <Card className="lg:border-l-6 border-l-5 border-l-emerald-500 lg:h-25 lg:w-85 h-22 w-48">
          <CardHeader>
            <CardTitle>
              <h1 className="lg:text-lg text-xs font-medium">Pension Fund</h1>
            </CardTitle>

            <CardAction>
              <span className="text-[var(--primary-200)] lg:text-5xl text-3xl font-semibold">
                5
              </span>
            </CardAction>
          </CardHeader>
        </Card>

        {/* grid 3 */}

        <Card className="lg:border-l-6 border-l-5  border-l-emerald-500 lg:h-25 lg:w-85 h-22 w-48">
          <CardHeader>
            <CardTitle className="">
              <h1 className="lg:text-lg text-xs font-medium">
                Dependents Cost of Living
              </h1>
            </CardTitle>

            <CardAction>
              <span className="text-[var(--primary-200)] lg:text-5xl text-3xl font-semibold">
                8
              </span>
            </CardAction>
          </CardHeader>
        </Card>
        <Card className="lg:border-l-6 border-l-5 border-l-emerald-500 lg:h-25 lg:w-85 h-22 w-48">
          <CardHeader>
            <CardTitle>
              <h1 className="lg:text-lg text-xs font-medium">
                Long Term Savings
              </h1>
            </CardTitle>

            <CardAction>
              <span className="text-[var(--primary-200)] lg:text-5xl text-3xl font-semibold">
                7
              </span>
            </CardAction>
          </CardHeader>
        </Card>
        <Card className="lg:border-l-6 border-l-5 border-l-emerald-500 lg:h-25 lg:w-85 h-22 w-48">
          <CardHeader>
            <CardTitle>
              <h1 className="lg:text-lg text-xs font-medium">
                Short Term Savings
              </h1>
            </CardTitle>

            <CardAction>
              <span className="text-[var(--primary-200)] lg:text-5xl text-3xl font-semibold">
                6
              </span>
            </CardAction>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default Cards;
