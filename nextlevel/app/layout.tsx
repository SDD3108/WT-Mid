
import type { Metadata } from "next";
import "@/vendor/bootstrap/bootstrap.min.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "NextLevel",
  description: "Discover, explore and save your favorite games.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
      </head>
      <body className="home-page">{children}</body>
    </html>
  );
}
