import Cards from "./components/Cards";
import Navbar from "./components/Navbar";

const page = () => {
  return (
    <div className="min-h-screen max-w-[95rem] mx-auto  ">
      <Navbar />
      <Cards />
    </div>
  );
};

export default page;
