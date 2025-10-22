import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const page = () => {
  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-[linear-gradient(to_bottom,_#24456e_0%,_#04182f_80%)]">
      <div className="relative flex flex-col justify-center items-center">
        <Image
          src="/images/logos/white-t.png"
          width={275}
          height={275}
          alt="Needalyze-Logo"
          className="absolute md:top-0 top-1 w-[250px]  md:w-[230px] h-auto"
        />

        <p className=" text-white/70 md:text-base md:max-w-4xl md:mx-auto  md:mt-52 md:mb-1 md:leading-relaxed hidden sm:block text-center">
          Needalyze makes insurance planning easier for both advisors and
          customers. By digitalizing the need analysis process, it enables
          smart, data-driven recommendations and seamless collaboration -
          anytime, anywhere.
        </p>

        <Link href="/login">
          <Button className="md:mt-8  rounded-full px-6 py-2 mt-35 md:px-10 md:py-2 text-black text-lg bg-[#F2F6FA] hover:bg-[#dcdee0] cursor-pointer">
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default page;
