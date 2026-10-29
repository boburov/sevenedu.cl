"use client";

import AppShell from "../components/shell/AppShell";
import { MeProvider } from "../components/shell/MeContext";

// Ichki sahifalar qobig'i: chap menyu + yuqori panel (desktop),
// yuqori panel + pastki menyu (telefon). Foydalanuvchi bir marta olinadi.
const Layout = ({ children }: { children: React.ReactNode }) => (
  <MeProvider>
    <AppShell>{children}</AppShell>
  </MeProvider>
);

export default Layout;
