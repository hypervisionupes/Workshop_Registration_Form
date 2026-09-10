import "./globals.css";

export const metadata = {
  title: "Hypervision Launchpad 2026 - Workshop Registration",
  description:
    "Register for Hypervision Launchpad 2026 workshop. Join the next generation of tech innovators.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
