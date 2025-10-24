import Cards from "./components/Cards";
import { DataTable } from "./components/Dashtable";
import Navbar from "./components/Navbar";
import { Button } from "@/components/ui/button";

const page = () => {
  return (
    <div className="bg-gray-25/5">
      <div className="min-h-screen max-w-[95rem] mx-auto  ">
        <Navbar />
        <Cards />
        <div className="mt-7 p-4 mx-auto max-w-7xl flex  justify-end">
          <Button className="bg-gradient-to-r from-[#3EAA66] to-[#189370] px-4 py-5">
            Create New Link
          </Button>
        </div>
        <DataTable />
      </div>
    </div>
  );
};

export default page;
