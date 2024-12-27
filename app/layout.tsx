export const metadata = {
  title: 'Our FET Project',
  description: 'To be continued by the Front End team',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
