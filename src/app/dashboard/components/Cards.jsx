import { Card, CardAction, CardHeader, CardTitle } from "@/components/ui/card";

const Cards = () => {
  return (
    <div className="mt-7 p-4 mx-auto max-w-7xl">
      {/* grid 1 */}
      <div className="grid  grid-cols-2  justify-items-center ">
        <Card className="border-l-6 border-amber-300 lg:h-25 lg:w-137">
          <CardHeader>
            <CardTitle>
              <h1 className="text-lg font-semibold">Completed Forms</h1>
            </CardTitle>

            <CardAction>
              <span className="text-blue-500 text-5xl">24</span>
            </CardAction>
          </CardHeader>
        </Card>
        <Card className="border-l-6 border-amber-300 lg:h-25 lg:w-137 ">
          <CardHeader>
            <CardTitle>
              <h1 className="text-lg font-semibold">In Progress</h1>
            </CardTitle>

            <CardAction>
              <span className="text-blue-500 text-5xl">24</span>
            </CardAction>
          </CardHeader>
        </Card>
      </div>
      {/* grid 2 */}
      <div className="grid lg:grid-cols-3 mt-9 justify-items-center">
        <Card className="border-l-6 border-emerald-500 lg:h-25 lg:w-85 ">
          <CardHeader>
            <CardTitle>
              <h1 className="text-lg font-semibold">Health</h1>
            </CardTitle>

            <CardAction>
              <span className="text-blue-500 text-5xl">24</span>
            </CardAction>
          </CardHeader>
        </Card>
        <Card className="border-l-6 border-emerald-500 lg:h-25 lg:w-85">
          <CardHeader>
            <CardTitle>
              <h1 className="text-lg font-semibold">Education</h1>
            </CardTitle>

            <CardAction>
              <span className="text-blue-500 text-5xl">24</span>
            </CardAction>
          </CardHeader>
        </Card>
        <Card className="border-l-6 border-emerald-500 lg:h-25 lg:w-85">
          <CardHeader>
            <CardTitle>
              <h1 className="text-lg font-semibold">Pension Fund</h1>
            </CardTitle>

            <CardAction>
              <span className="text-blue-500 text-5xl">24</span>
            </CardAction>
          </CardHeader>
        </Card>
      </div>
      {/* grid 3 */}
      <div className="grid lg:grid-cols-3  mt-9 justify-items-center">
        <Card className="border-l-6 border-emerald-500 lg:h-25 lg:w-85">
          <CardHeader>
            <CardTitle>
              <h1 className="text-lg font-semibold">
                Dependents Cost of Living
              </h1>
            </CardTitle>

            <CardAction>
              <span className="text-blue-500 text-5xl">24</span>
            </CardAction>
          </CardHeader>
        </Card>
        <Card className="border-l-6 border-emerald-500 lg:h-25 lg:w-85">
          <CardHeader>
            <CardTitle>
              <h1 className="text-lg font-semibold">Long Term Savings</h1>
            </CardTitle>

            <CardAction>
              <span className="text-blue-500 text-5xl">24</span>
            </CardAction>
          </CardHeader>
        </Card>
        <Card className="border-l-6 border-emerald-500 lg:h-25 lg:w-85">
          <CardHeader>
            <CardTitle>
              <h1 className="text-lg font-semibold">Short Term Savings</h1>
            </CardTitle>

            <CardAction>
              <span className="text-blue-500 text-5xl">24</span>
            </CardAction>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default Cards;
