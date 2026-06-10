export default function ResponsesLoading() {
  return (
    <div className="max-w-6xl space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-7 w-48 bg-bg-tertiary rounded-lg" />
          <div className="h-4 w-32 bg-bg-tertiary rounded mt-2" />
        </div>
        <div className="h-9 w-36 bg-bg-tertiary rounded-lg" />
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-48 bg-bg-tertiary rounded-xl" />
      ))}
    </div>
  );
}
