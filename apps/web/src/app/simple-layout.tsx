import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function SimpleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          <div className="p-8 text-center">
            <h1 className="text-2xl font-bold text-primary mb-4">SapaSafe - Simple Layout</h1>
            <p className="text-muted-foreground mb-4">App loaded successfully!</p>
            <p className="text-sm text-muted-foreground">No complex providers or components.</p>
          </div>
          {children}
        </div>
      </body>
    </html>
  )
}
