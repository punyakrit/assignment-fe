import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { QueryProvider } from '@/lib/providers/query-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Chat - Claude & Perplexity Inspired',
  description: 'A modern AI chat interface with streaming responses, artifacts, and intelligent search',
  keywords: ['AI', 'Chat', 'Next.js', 'TypeScript', 'Streaming', 'Artifacts'],
  authors: [{ name: 'AI Chat Developer' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
          >
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}