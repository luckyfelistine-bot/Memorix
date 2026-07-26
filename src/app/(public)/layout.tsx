import { ThemeProvider } from "@/components/ThemeProvider";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
