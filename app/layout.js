import "./globals.css";

export const metadata = {
  title: "Sorry?",
  description: "Harry Potter inspired Sorry page"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
