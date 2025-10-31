import Cards from "./components/Cards";
import { DataTable } from "./components/Dashtable";
import Navbar from "./components/Navbar";
import { Button } from "@/components/ui/button";
import CreateLinkDialog from "./components/CreateLinkDialog";

const page = () => {
  return (
    <div className="bg-[var(--primary-50)]/4">
      <div className="min-h-screen max-w-7xl p-4 mx-auto  ">
        <Navbar />
        <Cards />
        <div className=" flex justify-end my-4">
          <CreateLinkDialog />
        </div>
        <DataTable />
      </div>
    </div>
  );
};

export default page;
