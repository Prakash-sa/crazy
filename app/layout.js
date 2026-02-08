import "./globals.css";

export const metadata = {
  title: "Will You Be My Valentine?",
  description: "Harry Potter inspired Valentine proposal page"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
