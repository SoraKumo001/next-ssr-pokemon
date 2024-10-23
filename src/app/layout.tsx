import { SSRHeadRoot, SSRProvider } from "next-ssr";
import { headers } from "next/headers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  headers();
  return (
    <html lang="en">
      <SSRProvider>
        <head>
          <SSRHeadRoot />
        </head>
        <body>{children}</body>
      </SSRProvider>
    </html>
  );
}
