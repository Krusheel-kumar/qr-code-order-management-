import { Skeleton } from "./Skeleton"

export function CartSkeleton() {
  return (
    <div className="flex-1 px-6 pt-6 pb-32 space-y-6">
      <div className="bg-white rounded-[24px] border border-gray-100 p-2 divide-y divide-gray-100/80">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-4 p-4">
            <Skeleton className="h-[84px] w-[84px] rounded-[18px] shrink-0" />
            <div className="flex-1 flex flex-col justify-center gap-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
              <div className="mt-auto flex justify-between items-end pt-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-8 w-24 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Bill Details Skeleton */}
      <div className="bg-white rounded-[24px] p-5 border border-gray-100 space-y-4">
        <Skeleton className="h-5 w-32 mb-2" />
        <div className="flex justify-between"><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-12" /></div>
        <div className="flex justify-between"><Skeleton className="h-4 w-32" /><Skeleton className="h-4 w-12" /></div>
        <div className="flex justify-between pt-4"><Skeleton className="h-6 w-20" /><Skeleton className="h-6 w-16" /></div>
      </div>
    </div>
  )
}
