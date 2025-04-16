import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL('https://banditcamp.co.uk'),
  title: {
    default: "THE BANDIT CAMP | MX-5 Performance Parts",
    template: "%s | THE BANDIT CAMP"
  },
  description: "Professional grade MX-5 performance parts. Specializing in reinforced differentials and custom NAFL bumpers for Mazda MX-5 Mk1 & Mk2. For Track Kings, Garage Queens, Street Bandits and Daily Drivers.",
  keywords: ["MX-5 parts", "reinforced differential", "NAFL bumper", "Mazda MX-5", "MX5 performance", "differential reinforcement", "Miata parts"],
  authors: [{ name: "The Bandit Camp" }],
  creator: "The Bandit Camp",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://banditcamp.co.uk",
    siteName: "THE BANDIT CAMP",
    title: "THE BANDIT CAMP | MX-5 Performance Parts",
    description: "Professional grade MX-5 performance parts. Specializing in reinforced differentials and custom NAFL bumpers. For Track Kings, Garage Queens, Street Bandits and Daily Drivers.",
    images: [
      {
        url: "/uploads/hero/hero1.png",
        width: 1200,
        height: 630,
        alt: "The Bandit Camp - MX-5 Performance Parts"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "THE BANDIT CAMP | MX-5 Performance Parts",
    description: "Professional grade MX-5 performance parts. For Track Kings, Garage Queens, Street Bandits and Daily Drivers.",
    images: ["/uploads/hero/hero1.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // TODO: Add your Google Search Console verification code here
    // 1. Go to Google Search Console (https://search.google.com/search-console)
    // 2. Add your property and choose "HTML tag" verification
    // 3. Copy the content value from the meta tag provided (looks like: <meta name="google-site-verification" content="YOUR_CODE">)
    // 4. Replace the placeholder below with your actual verification code
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "YOUR_GOOGLE_VERIFICATION_CODE",
  },
}; 