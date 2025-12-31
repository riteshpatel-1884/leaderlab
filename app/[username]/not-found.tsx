
// ============================================
// app/[username]/not-found.tsx - Custom 404 Page
export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-400 mb-8">User not found</p>
        <a
          href="/"
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors inline-block"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
