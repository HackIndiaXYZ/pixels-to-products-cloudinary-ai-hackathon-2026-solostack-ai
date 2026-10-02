import { auth } from "@clerk/nextjs/server";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated } = await auth();

  if (!isAuthenticated) {
    const { redirectToSignIn } = await auth();
    return redirectToSignIn({
      returnBackUrl: "/dashboard",
    });
  }

  return <DashboardShell>{children}</DashboardShell>;
}