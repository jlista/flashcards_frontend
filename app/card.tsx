'use client';


export default function Card({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


    return (
    <div className="flex max-w-sm p-6 h-full bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
        {children}
    </div>
    )
}