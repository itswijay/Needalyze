import Image from 'next/image';

export default function NeedAnalysisFormHeader() {
  return (
    <div className="w-full h-20 bg-gradient-to-r from-[#10294A] to-[#5d8aba] flex items-center justify-between px-8 relative">
     
      <div className="flex items-center">
        <Image
          src="/images/logos/white-t.png"
          alt="Needalyze Logo"
          width={120}
          height={30}
          className="object-contain"
        />
      </div>

      <div className="absolute left-1/3 transform -translate-x-1/3">
        <h1 className="text-white text-3xl font-poppins">Need Analyze Form</h1>
      </div>

      <div className="w-[120px]"></div>
    </div>
  );
}