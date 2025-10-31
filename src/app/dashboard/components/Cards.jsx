import { Card, CardAction, CardHeader, CardTitle } from "@/components/ui/card";

const Cards = () => {
  return (
    <div className="mt-3 pt-4">
      {/* grid 1 */}
      <div className="grid  grid-cols-2  justify-items-center gap-x-5">
        <Card className="sm:border-l-6 border-l-5 border-l-[var(--primary-200)] sm:h-25 sm:w-137 h-22 w-43 ">
          <CardHeader>
            <CardTitle>
              <h1 className="sm:text-lg text-sm font-medium">
                Completed Forms
              </h1>
            </CardTitle>

            <CardAction>
              <span className="text-[var(--primary-200)] sm:text-5xl text-4xl font-semibold">
                46
              </span>
            </CardAction>
          </CardHeader>
        </Card>
        <Card className="sm:border-l-6 border-l-5 border-l-[var(--primary-200)] sm:h-25 sm:w-137 h-22 w-43">
          <CardHeader>
            <CardTitle>
              <h1 className="sm:text-lg text-sm font-medium">In Progress</h1>
            </CardTitle>

            <CardAction>
              <span className="text-[var(--primary-200)] sm:text-5xl text-4xl font-semibold">
                10
              </span>
            </CardAction>
          </CardHeader>
        </Card>
      </div>
      {/* grid 2 */}
      <div className="grid sm:grid-cols-3 grid-cols-2 mt-7 justify-items-center space-y-6 gap-x-5">
        <Card className="sm:border-l-6 border-l-5 border-l-emerald-400 sm:h-25 sm:w-85 h-22 w-43">
          <CardHeader>
            <CardTitle>
              <h1 className="sm:text-lg text-xs font-medium">Health</h1>
            </CardTitle>

            <CardAction>
              <span className="text-[var(--primary-200)] sm:text-5xl text-3xl font-semibold">
                8
              </span>
            </CardAction>
          </CardHeader>
        </Card>
        <Card className="sm:border-l-6 border-l-5 border-l-emerald-400 sm:h-25 sm:w-85 h-22 w-43">
          <CardHeader>
            <CardTitle>
              <h1 className="sm:text-lg text-xs font-medium">Education</h1>
            </CardTitle>

            <CardAction>
              <span className="text-[var(--primary-200)] sm:text-5xl text-3xl font-semibold">
                12
              </span>
            </CardAction>
          </CardHeader>
        </Card>
        <Card className="sm:border-l-6 border-l-5 border-l-emerald-400 sm:h-25 sm:w-85 h-22 w-43">
          <CardHeader>
            <CardTitle>
              <h1 className="sm:text-lg text-xs font-medium">Pension Fund</h1>
            </CardTitle>

            <CardAction>
              <span className="text-[var(--primary-200)] sm:text-5xl text-3xl font-semibold">
                5
              </span>
            </CardAction>
          </CardHeader>
        </Card>

        {/* grid 3 */}

        <Card className="sm:border-l-6 border-l-5  border-l-emerald-400 sm:h-25 sm:w-85 h-22 w-43">
          <CardHeader>
            <CardTitle className="">
              <h1 className="sm:text-lg text-xs font-medium">
                Dependents Cost of Living
              </h1>
            </CardTitle>

            <CardAction>
              <span className="text-[var(--primary-200)] sm:text-5xl text-3xl font-semibold">
                8
              </span>
            </CardAction>
          </CardHeader>
        </Card>
        <Card className="sm:border-l-6 border-l-5 border-l-emerald-400 sm:h-25 sm:w-85 h-22 w-43">
          <CardHeader>
            <CardTitle>
              <h1 className="sm:text-lg text-xs font-medium">
                Long Term Savings
              </h1>
            </CardTitle>

            <CardAction>
              <span className="text-[var(--primary-200)] sm:text-5xl text-3xl font-semibold">
                7
              </span>
            </CardAction>
          </CardHeader>
        </Card>
        <Card className="sm:border-l-6 border-l-5 border-l-emerald-400 sm:h-25 sm:w-85 h-22 w-43">
          <CardHeader>
            <CardTitle>
              <h1 className="sm:text-lg text-xs font-medium">
                Short Term Savings
              </h1>
            </CardTitle>

            <CardAction>
              <span className="text-[var(--primary-200)] sm:text-5xl text-3xl font-semibold">
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
