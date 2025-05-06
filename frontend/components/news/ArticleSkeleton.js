export default function ArticleSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="h-48 bg-gray-200 rounded-md mb-4"></div>
      
      <div className="flex gap-2 mb-2">
        <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
        <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
      </div>
      
      <div className="h-7 bg-gray-200 rounded mb-2"></div>
      <div className="h-7 bg-gray-200 rounded mb-4 w-3/4"></div>
      
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
      
      <div className="flex justify-between">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  );
}

