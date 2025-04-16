import { Inter } from 'next/font/google'
import localFont from 'next/font/local'

export const microgramma = localFont({
  src: '../public/fonts/microgrammanormal.ttf',
  variable: '--font-microgramma',
})

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
}) 