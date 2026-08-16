import SiteHeader from "../components/SiteHeader";

export const metadata = {
  title: "LedgerFlow AI",
  description: "LEDGERFLOW AI cash flow forecasting and invoice matching platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
