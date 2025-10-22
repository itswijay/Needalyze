import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const page = () => {
  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-[linear-gradient(to_bottom,_#24456e_0%,_#04182f_80%)]">
      <div className="flex flex-col justify-center items-center">
        <Image
          src="/images/logos/white-t.png"
          width="180"
          height="180"
          alt="Needalyze-Logo"
          priority
        />
        <p className="text-white md:text-lg md:max-w-3xl md:mx-auto md:leading-relaxed hidden sm:block text-center">
          Needalyze makes insurance planning easier for both advisors and
          customers. By digitalizing the need analysis process, it enables
          smart, data-driven recommendations and seamless collaboration —
          anytime, anywhere.
        </p>
        <Link href="/login">
          <Button className="md:mt-15 mt-[-20px] rounded-full px-10 py-[20px] text-black text-lg bg-[#F2F6FA] hover:bg-[#dcdee0] cursor-pointer">
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default page;
