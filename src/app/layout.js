import { Poppins } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import { Toaster } from "react-hot-toast"

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

export const metadata = {
  title: {
    default: 'Needalyze',
    template: '%s | Needalyze',
  },
  description:
    'Digital insurance need analysis for advisors and their customers.',
  // No `icons` entry: src/app/favicon.ico is already the Needalyze icon and
  // Next's file convention serves it automatically.
}

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning here is for next-themes: it sets the `dark`
    // class on <html> from a blocking script before React hydrates, so the
    // server and client markup differ on this element by design. As with
    // <body> below, it covers this element's own attributes only.
    <html lang="en" suppressHydrationWarning>
      {/* suppressHydrationWarning covers this element's own attributes only, so
          it silences browser extensions that decorate <body> before React
          hydrates (ColorZilla's cz-shortcut-listen, password managers, and so
          on) without hiding real mismatches anywhere in the tree below. */}
      <body
        className={`${poppins.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
        {/* Toasts read the theme tokens rather than react-hot-toast's stock
            white, which was unreadable once dark mode existed. */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--surface-raised)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--elevation-lg)',
              borderRadius: 'calc(var(--radius) + 4px)',
              fontSize: '0.875rem',
            },
            success: { iconTheme: { primary: 'var(--success-300)', secondary: '#ffffff' } },
            error: { iconTheme: { primary: 'var(--error-400)', secondary: '#ffffff' } },
          }}
        />
      </body>
    </html>
  )
}
