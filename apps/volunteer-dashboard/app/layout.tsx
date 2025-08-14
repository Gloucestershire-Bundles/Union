import { Public_Sans } from "next/font/google";
import { ThemeProvider } from "@/hooks/providers/ThemeProvider";
import { ClerkProvider, useAuth, useUser } from "@clerk/nextjs";

import "./globals.css";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import { AppSidebar } from "@/components/app-sidebar";

const publicSans = Public_Sans({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={publicSans.className} suppressHydrationWarning>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="[--header-height:calc(--spacing(14))]">
              <SidebarProvider className="flex flex-col">
                <SiteHeader />
                <div className="flex flex-1">
                  <AppSidebar />
                  <SidebarInset>
                    <div className="flex flex-1 flex-col gap-4 p-4">
                      {children}
                    </div>
                  </SidebarInset>
                </div>
              </SidebarProvider>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

