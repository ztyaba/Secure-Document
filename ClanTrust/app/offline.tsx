export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-brand-soft px-4 text-center">
      <h1 className="text-3xl font-bold">You are offline</h1>
      <p className="mt-2 max-w-md text-sm text-slate-600">
        Your actions will be queued and retried once you reconnect. Please ensure a stable internet connection for legal
        documents.
      </p>
    </main>
  );
}
