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
    <html lang="en">
      {/* suppressHydrationWarning covers this element's own attributes only, so
          it silences browser extensions that decorate <body> before React
          hydrates (ColorZilla's cz-shortcut-listen, password managers, and so
          on) without hiding real mismatches anywhere in the tree below. */}
      <body
        className={`${poppins.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
