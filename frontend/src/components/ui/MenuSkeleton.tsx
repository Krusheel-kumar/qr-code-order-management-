import { Skeleton } from "./Skeleton"

export function MenuSkeleton() {
  return (
    <div className="space-y-6 px-4 py-4">
      {/* Category header skeleton */}
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-6 w-32" />
      </div>

      {/* Grid of menu items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-4 p-4 bg-white rounded-[24px] border border-gray-100 shadow-sm">
            <Skeleton className="h-[96px] w-[96px] rounded-[18px] shrink-0" />
            <div className="flex flex-col flex-1 py-1">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <div className="mt-auto flex justify-between items-center">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
