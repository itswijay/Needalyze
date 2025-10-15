import NeedAnalysisFormHeader from '@/components/NeedAnalysisFormHeader';
import ProgressBar from '@/components/ProgressBar';

export default function NeedAnalysisFormPage2() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NeedAnalysisFormHeader />
      <ProgressBar currentStep={2} />
      
    
    </div>
  );
}