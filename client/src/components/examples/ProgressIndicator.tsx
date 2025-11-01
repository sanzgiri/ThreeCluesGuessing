import ProgressIndicator from '../ProgressIndicator';

export default function ProgressIndicatorExample() {
  return (
    <div className="space-y-6">
      <ProgressIndicator currentStep={0} totalSteps={3} />
      <ProgressIndicator currentStep={1} totalSteps={3} />
      <ProgressIndicator currentStep={2} totalSteps={3} />
    </div>
  );
}
