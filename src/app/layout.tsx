import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { APP_NAME, CASE_TITLE } from "@/config/navigation";

// Temporary workaround for Turbopack font loading issue
// Using system fonts instead of Google Fonts
const geistSans = {
  variable: "--font-geist-sans",
};

const geistMono = {
  variable: "--font-geist-mono",
};

export const metadata: Metadata = {
  title: `${APP_NAME} | ${CASE_TITLE}`,
  description: `Legal intelligence platform for case management, document preparation, and evidence organization for ${CASE_TITLE}`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Sidebar />
        <main className="lg:ml-64 min-h-screen">
          {children}
        </main>
        {/* ChecklistFab and UniversalDropzone temporarily disabled for performance */}
      </body>
    </html>
  );
}
