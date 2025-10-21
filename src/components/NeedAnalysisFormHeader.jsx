import Image from 'next/image';

export default function NeedAnalysisFormHeader() {
  return (
    <div className="w-full h-22 bg-gradient-to-r from-[var(--primary-600)] via-[var(--primary-300)] to-[var(--primary-600)] flex items-center justify-between px-4 sm:px-6 md:px-8 relative">
      {/* Logo on the left */}
      <div className="flex items-center">
        <Image
          src="/images/logos/secondary-white-t.png"
          alt="Needalyze Logo"
          width={70}
          height={70}
          className="object-contain"
        />
      </div>

      {/* Title perfectly centered */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 px-2">
        <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-semibold text-center">
          <span className="hidden sm:inline">Need Analyze Form</span>
          <span className="sm:hidden">Need Analyze</span>
        </h1>
      </div>

      {/* Empty div to maintain flexbox balance */}
      <div className="w-[70px] sm:w-[100px] md:w-[140px]"></div>
    </div>
  );
}