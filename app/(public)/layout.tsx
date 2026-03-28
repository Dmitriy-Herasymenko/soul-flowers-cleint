import { AppFooter } from '@/components/AppFooter';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <AppFooter />
    </>
  );
}
