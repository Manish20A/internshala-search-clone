import "./globals.css";

export const metadata = {
  title: "Internships Search | Internshala Clone",
  description: "Search and apply to thousands of internships across India and remotely with various domains, stipends, and durations.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
