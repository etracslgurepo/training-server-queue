// app/not-found.tsx
export default function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white text-black">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="mt-4 text-lg">The page you're looking for does not exist.</p>
    </div>
  );
}
