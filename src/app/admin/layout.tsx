export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 selection:bg-blue-500/30 font-sans">
      <main className="flex flex-col min-h-screen">{children}</main>
    </div>
  );
}
