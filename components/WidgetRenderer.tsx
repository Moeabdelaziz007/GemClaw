'use client';

export function WidgetRenderer({ data }: { data: any }) {
  // Placeholder for the actual widget renderer
  return (
    <div className="w-full h-full p-6 bg-zinc-900 rounded-2xl border border-zinc-800">
      <h2 className="text-xl font-semibold text-white mb-4">Widget Output</h2>
      <pre className="text-zinc-400 font-mono text-sm">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
