import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'


import { Footer, Header } from '@/components/Layout'
import { StoreProvider } from '@/lib/store'
import '../styles.css'

const siteName = '360 Eatery Kano — Order online for pickup or delivery'
const siteDescription =
  'Order jollof rice, tuwo, sakwara, pepper soup, masar Bauchi, kunu and more from 360 Eatery Kano in Dorayi. Browse the menu, pay online and track your order live.'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: siteName,
      },
      {
        name: 'description',
        content: siteDescription,
      },
      {
        property: 'og:title',
        content: siteName,
      },
      {
        property: 'og:description',
        content: siteDescription,
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <StoreProvider>
          <Header />
          <main className="min-h-[70vh]">{children}</main>
          <Footer />
        </StoreProvider>
        <Scripts />
      </body>
    </html>
  )
}
