// Minimal wrapper for the (dashboard) route group.
// Auth pages (login, register) get this clean shell — no sidebar.
// The sidebar lives in app/(dashboard)/dashboard/layout.tsx
export default function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
