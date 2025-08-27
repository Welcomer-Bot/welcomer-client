import { Divider } from "@heroui/divider";
import { Skeleton } from "@heroui/skeleton";

export function SidebarSkeleton() {
  return (
    <>
      {/* Header Skeleton */}
      <div className="p-4 pb-2 justify-between items-center align-center sm:flex hidden">
        <div className="items-center h-10 justify-start flex flex-row">
          <Skeleton className="w-10 h-10 rounded">
            <div className="w-10 h-10 bg-default-200"></div>
          </Skeleton>
          <div className="ml-3 space-y-1">
            <Skeleton className="w-20 h-4 rounded-lg">
              <div className="h-4 w-20 bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-16 h-3 rounded-lg">
              <div className="h-3 w-16 bg-default-300"></div>
            </Skeleton>
          </div>
        </div>
        <Skeleton className="w-8 h-8 rounded">
          <div className="w-8 h-8 bg-default-200"></div>
        </Skeleton>
      </div>

      <Divider className="mb-2 sm:block hidden" />

      {/* Guild Selector Skeleton */}
      <div className="m-2">
        <Skeleton className="w-full h-16 rounded-lg">
          <div className="h-16 w-full bg-default-200"></div>
        </Skeleton>
      </div>

      <Divider className="mb-2 sm:block hidden" />

      {/* Navigation Skeleton */}
      <div className="sm:flex-1 sm:block flex flex-row justify-evenly w-full px-3 space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center space-x-3">
            <Skeleton className="w-6 h-6 rounded">
              <div className="w-6 h-6 bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-20 h-4 rounded-lg sm:block hidden">
              <div className="h-4 w-20 bg-default-200"></div>
            </Skeleton>
          </div>
        ))}
      </div>

      <Divider className="sm:block hidden" />

      {/* User Skeleton */}
      <div className="p-3 justify-center sm:flex hidden">
        <div className="flex items-center space-x-3">
          <Skeleton className="w-10 h-10 rounded-full">
            <div className="w-10 h-10 bg-default-200"></div>
          </Skeleton>
          <div className="space-y-1">
            <Skeleton className="w-20 h-4 rounded-lg">
              <div className="h-4 w-20 bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-16 h-3 rounded-lg">
              <div className="h-3 w-16 bg-default-300"></div>
            </Skeleton>
          </div>
        </div>
        <Skeleton className="w-8 h-8 rounded ml-3">
          <div className="w-8 h-8 bg-default-200"></div>
        </Skeleton>
      </div>
    </>
  );
}

export function SidebarNavigationSkeleton() {
  return (
    <div className="sm:flex-1 sm:block flex flex-row justify-evenly w-full px-3 space-y-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center space-x-3 py-2">
          <Skeleton className="w-6 h-6 rounded">
            <div className="w-6 h-6 bg-default-200"></div>
          </Skeleton>
          <Skeleton className="w-20 h-4 rounded-lg sm:block hidden">
            <div className="h-4 w-20 bg-default-200"></div>
          </Skeleton>
        </div>
      ))}
    </div>
  );
}

export function SidebarUserSkeleton() {
  return (
    <div className="p-3 justify-center sm:flex hidden">
      <div className="flex items-center space-x-3">
        <Skeleton className="w-10 h-10 rounded-full">
          <div className="w-10 h-10 bg-default-200"></div>
        </Skeleton>
        <div className="space-y-1">
          <Skeleton className="w-20 h-4 rounded-lg">
            <div className="h-4 w-20 bg-default-200"></div>
          </Skeleton>
          <Skeleton className="w-16 h-3 rounded-lg">
            <div className="h-3 w-16 bg-default-300"></div>
          </Skeleton>
        </div>
      </div>
      <Skeleton className="w-8 h-8 rounded ml-3">
        <div className="w-8 h-8 bg-default-200"></div>
      </Skeleton>
    </div>
  );
}
