import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const incomingHeaders = await headers();
  const host =
    incomingHeaders.get("x-forwarded-host") ??
    incomingHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    incomingHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const baseUrl = new URL(`${protocol}://${host}`);
  const title = "Orbitder Lab (ออบิดเด้อ แลป) — ห้องทดลองระบบสุริยะ";
  const description =
    "เว็บจำลองระบบสุริยะ 3 มิติสำหรับนักสำรวจอวกาศรุ่นเยาว์";

  return {
    metadataBase: baseUrl,
    title,
    description,
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: new URL("/og-spacetime.png", baseUrl).toString(),
          width: 1792,
          height: 909,
          alt: "Orbitder Lab — แบบจำลองระบบสุริยะ 3 มิติ",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [new URL("/og-spacetime.png", baseUrl).toString()],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
