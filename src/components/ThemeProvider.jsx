'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'

/**
 * Applies the `dark` class to <html>, which is what the `@custom-variant dark`
 * rule in globals.css keys off. The dark token block has existed since the
 * theme was written but nothing ever set the class, so it was dead until now.
 *
 * next-themes writes that class from a blocking inline script before paint, so
 * there is no flash of the wrong theme. It also means the server-rendered
 * markup and the first client render disagree by design — hence the
 * `suppressHydrationWarning` on <html> in app/layout.js.
 */
export function ThemeProvider({ children }) {
  return (
    <NextThemesProvider
      attribute="class"
      // "system" rather than "light": with an explicit default, next-themes
      // never consults prefers-color-scheme, so enableSystem below would do
      // nothing until the user touched the toggle. This way the app follows
      // the OS on a first visit and the toggle overrides it from then on.
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}
