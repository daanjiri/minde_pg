export default function EventLoading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded mb-6 animate-pulse" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="h-10 w-3/4 bg-gray-200 dark:bg-gray-800 rounded mb-4 animate-pulse" />

          <div className="flex items-center mb-6">
            <div className="h-6 w-28 bg-gray-200 dark:bg-gray-800 rounded mr-4 animate-pulse" />
            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          </div>

          <div className="mb-8">
            <div className="h-8 w-40 bg-gray-200 dark:bg-gray-800 rounded mb-2 animate-pulse" />
            <div className="h-24 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          </div>

          <div className="mb-8">
            <div className="h-8 w-40 bg-gray-200 dark:bg-gray-800 rounded mb-4 animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="flex items-center p-4 border rounded-lg dark:border-gray-700"
                >
                  <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800 mr-4 animate-pulse" />
                  <div>
                    <div className="h-5 w-32 bg-gray-200 dark:bg-gray-800 rounded mb-2 animate-pulse" />
                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="sticky top-4">
            <div className="aspect-square w-full bg-gray-200 dark:bg-gray-800 rounded-lg mb-4 animate-pulse" />

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-1 animate-pulse" />
                    <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
