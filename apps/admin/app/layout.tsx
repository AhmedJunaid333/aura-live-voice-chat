import React from 'react';

export const metadata = {
  title: 'Aura Live Enterprise Admin Dashboard',
  description: 'Management & Real-Time Moderation Panel for Aura Live Voice Chat',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="m-0 p-0 bg-[#07040f] font-sans antialiased text-slate-100 overflow-hidden">
        {children}
      </body>
    </html>
  );
}
