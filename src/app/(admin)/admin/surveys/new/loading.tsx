export default function NewSurveyLoading() {
  return (
    <div className="max-w-3xl space-y-6 animate-pulse">
      <div>
        <div className="h-7 w-36 bg-bg-tertiary rounded-lg" />
        <div className="h-4 w-64 bg-bg-tertiary rounded mt-2" />
      </div>
      <div className="h-10 w-full bg-bg-tertiary rounded-lg" />
      <div className="h-24 w-full bg-bg-tertiary rounded-lg" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-10 bg-bg-tertiary rounded-lg" />
        <div className="h-10 bg-bg-tertiary rounded-lg" />
      </div>
    </div>
  );
}
