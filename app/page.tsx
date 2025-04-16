'use client';

import Image from 'next/image';
import Link from 'next/link';
import ScrollButton from './components/ScrollButton';
import ContactForm from './components/ContactForm';
import { useState, useEffect } from 'react';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] relative overflow-hidden">
      {/* Remove padding for full-width hero */}
      <div>
        {/* Hero section - adjust height and remove container constraints */}
        <div id="hero" className="relative h-[100vh] w-full">
          {/* Darker overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 z-10" />
          
          {/* Hero content - remove container constraints */}
          <div className="relative z-20 h-full flex flex-col items-center justify-center">
            {/* Hero image carousel - make it fill the viewport */}
            <div className="absolute inset-0">
              <HeroCarousel />
            </div>

            {/* Content overlay - adjust positioning and spacing */}
            <div className="relative z-30 text-center space-y-8 px-4 max-w-7xl mx-auto">
              {/* Brand name - adjust size and add text shadow */}
              <h1 className="text-7xl md:text-9xl font-bold text-white tracking-tight drop-shadow-2xl">
                THE BANDIT CAMP
              </h1>

              {/* Slogan - adjust size and add text shadow */}
              <p className="text-2xl md:text-3xl text-gray-200 font-light max-w-3xl mx-auto drop-shadow-lg">
                For Track Kings, Garage Queens, Street Bandits and Daily Drivers
              </p>
            </div>

            {/* UI elements - adjust positioning */}
            <div className="absolute bottom-12 left-0 right-0 flex justify-center space-x-8">
              <div className="w-2 h-2 rounded-full bg-blue-500/50" />
              <div className="w-2 h-2 rounded-full bg-blue-500/30" />
              <div className="w-2 h-2 rounded-full bg-blue-500/20" />
            </div>
          </div>
        </div>

        {/* How It's Made Section */}
        <section className="relative py-32 bg-[#0A0A0A] overflow-hidden">
          {/* Background grid pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(to right, #2563EB 1px, transparent 1px),
                              linear-gradient(to bottom, #2563EB 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }} />
          </div>

          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                How It's Made
              </h2>
              <p className="text-gray-400 text-lg">
                Watch Our Expert Craftsmanship in Action
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Left column - Images */}
              <div className="space-y-8">
                <div className="relative h-[300px] rounded-lg overflow-hidden group">
                  <Image
                    src="/uploads/howitsmade/bumperhowitsmade.jpg"
                    alt="Bumper Manufacturing Process"
                    fill
                    className="object-cover transform transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="relative h-[300px] rounded-lg overflow-hidden group">
                  <Image
                    src="/uploads/howitsmade/diffhowitsmade.jpg"
                    alt="Differential Manufacturing Process"
                    fill
                    className="object-cover transform transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>

              {/* Right column - Video */}
              <div className="relative h-[600px] rounded-lg overflow-hidden group">
                <video
                  src="/uploads/howitsmade/mattwelding.mp4"
                  controls
                  className="w-full h-full object-cover object-bottom"
                  poster="/uploads/howitsmade/diffhowitsmade.jpg"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>

            {/* Process Description */}
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-gray-300 text-lg leading-relaxed">
                Every part we create undergoes a meticulous manufacturing process. From precise measurements to expert welding, 
                we ensure each component meets our exacting standards. Our skilled craftsmen use state-of-the-art equipment 
                and time-tested techniques to deliver products that exceed expectations.
              </p>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
        </section>

        {/* Reviews Section */}
        <section className="relative py-32 bg-[#0A0A0A] overflow-hidden">
          {/* Background grid pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(to right, #2563EB 1px, transparent 1px),
                              linear-gradient(to bottom, #2563EB 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }} />
          </div>

          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Customer Reviews
              </h2>
              <p className="text-gray-400 text-lg">
                What Our Customers Say About Us
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Review 1 */}
              <div className="bg-[#111111] p-8 rounded-lg border border-blue-500/20">
                <div className="flex items-center mb-6">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-300 mb-6">
                  "Just bought a 1.8 welded and reinforced diff off Tom as well as driveshafts and prop off the back of this post. Extremely professional, super responsive and will get you what you want."
                </p>
                <p className="text-gray-300 mb-6">
                  "Sent pictures and updates through during manufacture and delivered it 3 hours away just 2 days after I paid."
                </p>
                <p className="text-gray-300">
                  "Not put it in the car yet but all looks good and he's said any issues he would drive down and sort, really would recommend."
                </p>
              </div>

              {/* Review 2 */}
              <div className="bg-[#111111] p-8 rounded-lg border border-blue-500/20">
                <div className="flex items-center mb-6">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-300 mb-6">
                  "I bought a Reinforced Torsen off the Bandit camp, the boys were super professional, quick and friendly! The diff has been through some abuse with no issues! definitely recommend! 5 Stars!!!🌟"
                </p>
              </div>

              {/* Review 3 */}
              <div className="bg-[#111111] p-8 rounded-lg border border-blue-500/20">
                <div className="flex items-center mb-6">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-300">
                  "Bought a reinforced differential for the race car, was delivered to me by the lads within a week. Very happy and I will definitely be buying again!"
                </p>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
        </section>

        {/* Product Showcase Section */}
        <section id="products" className="relative py-32 bg-[#0A0A0A]">
          {/* Background grid pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(to right, #2563EB 1px, transparent 1px),
                              linear-gradient(to bottom, #2563EB 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }} />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Reinforced Differentials
              </h2>
              <p className="text-gray-400 text-lg">
                Professional Grade Reinforced Diffs for MX-5 Mk1 & Mk2
              </p>
            </div>

            {/* Product Showcase */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              {/* Left side - Product Info */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-white">MX-5 Mk1/Mk2 (1.6 & 1.8)</h3>
                  <p className="text-gray-400 text-lg">
                    Professional-grade reinforced differential casings, custom-made for your Mazda MX-5. Perfect for high-performance builds and track enthusiasts.
                  </p>
                </div>

                {/* Key Features */}
                <div className="space-y-6">
                  <h4 className="text-xl font-semibold text-white">Key Features</h4>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-blue-500 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">5mm aluminum reinforcement plates, TIG welded on both sides</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-blue-500 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Professional TIG welding in specialist workshop</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-blue-500 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Compatible with both push-in and bolt-on driveshafts</span>
                    </li>
                  </ul>
                </div>

                {/* Perfect For */}
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold text-white">Perfect For</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#111111] p-4 rounded-lg border border-blue-500/20">
                      <p className="text-gray-300 text-center">Drifting</p>
                    </div>
                    <div className="bg-[#111111] p-4 rounded-lg border border-blue-500/20">
                      <p className="text-gray-300 text-center">Track Racing</p>
                    </div>
                    <div className="bg-[#111111] p-4 rounded-lg border border-blue-500/20">
                      <p className="text-gray-300 text-center">High-Power Builds</p>
                    </div>
                    <div className="bg-[#111111] p-4 rounded-lg border border-blue-500/20">
                      <p className="text-gray-300 text-center">Lowered Setups</p>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-4">
                  <Link 
                    href="/products/reinforced-differentials"
                    prefetch={false}
                    className="inline-flex items-center justify-center w-full px-8 py-4 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors duration-300"
                  >
                    View Full Details
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Right side - Images */}
              <div className="space-y-6">
                <div className="relative h-[400px] rounded-lg overflow-hidden group">
                  <Image
                    src="/uploads/products/diff1.jpg"
                    alt="Reinforced MX-5 Differential - Front View"
                    fill
                    className="object-cover transform transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
                <div className="relative h-[400px] rounded-lg overflow-hidden group">
                  <Image
                    src="/uploads/products/diff2.jpg"
                    alt="Reinforced MX-5 Differential - Side View"
                    fill
                    className="object-cover transform transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Additional Info Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              {/* Turnaround Time */}
              <div className="bg-[#111111] p-6 rounded-lg border border-blue-500/20">
                <div className="flex items-center mb-4">
                  <svg className="w-6 h-6 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4 className="text-lg font-semibold text-white">Quick Turnaround</h4>
                </div>
                <p className="text-gray-400">Up to 1 week from payment to completion</p>
              </div>

              {/* Shipping */}
              <div className="bg-[#111111] p-6 rounded-lg border border-blue-500/20">
                <div className="flex items-center mb-4">
                  <svg className="w-6 h-6 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  <h4 className="text-lg font-semibold text-white">Shipping Available</h4>
                </div>
                <p className="text-gray-400">Collection from Chester or nationwide delivery</p>
              </div>

              {/* Custom Options */}
              <div className="bg-[#111111] p-6 rounded-lg border border-blue-500/20">
                <div className="flex items-center mb-4">
                  <svg className="w-6 h-6 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  <h4 className="text-lg font-semibold text-white">Custom Options</h4>
                </div>
                <p className="text-gray-400">Polybushing upgrades and new seals available</p>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
        </section>

        {/* NAFL Bumper Section */}
        <section className="relative py-32 bg-[#0A0A0A] overflow-hidden">
          {/* Background grid pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(to right, #2563EB 1px, transparent 1px),
                              linear-gradient(to bottom, #2563EB 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }} />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Custom NAFL Bumper
              </h2>
              <p className="text-gray-400 text-lg">
                Inspired by Sinbin's Mk1, Crafted for Your Build
              </p>
            </div>

            {/* Product Showcase */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              {/* Left side - Images */}
              <div className="space-y-6">
                <div className="relative h-[400px] rounded-lg overflow-hidden group">
                  <Image
                    src="/uploads/products/bumper1.jpg"
                    alt="Custom NAFL Bumper - Black MX5"
                    fill
                    className="object-cover transform transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="relative h-[400px] rounded-lg overflow-hidden group">
                  <Image
                    src="/uploads/products/bumper2.jpg"
                    alt="Custom NAFL Bumper - Fitment Example"
                    fill
                    className="object-cover transform transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>

              {/* Right side - Product Info */}
              <div className="space-y-8 relative z-20">
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-white">Made-to-Order Excellence</h3>
                  <p className="text-gray-400 text-lg">
                    Choose between our fiberglass mould or fabricated version using original bumper plastic. Each piece is carefully crafted to ensure perfect fitment and finish.
                  </p>
                </div>

                {/* Key Features */}
                <div className="space-y-6">
                  <h4 className="text-xl font-semibold text-white">Easy Installation</h4>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-blue-500 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Uses stock Mk1 rail/trim plate - no extra brackets needed</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-blue-500 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Direct bolt-on fitment - no drilling required</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-blue-500 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Professional finish options available</span>
                    </li>
                  </ul>
                </div>

                {/* Perfect For */}
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold text-white">Perfect For</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#111111] p-4 rounded-lg border border-blue-500/20">
                      <p className="text-gray-300 text-center">Track Builds</p>
                    </div>
                    <div className="bg-[#111111] p-4 rounded-lg border border-blue-500/20">
                      <p className="text-gray-300 text-center">Show Cars</p>
                    </div>
                    <div className="bg-[#111111] p-4 rounded-lg border border-blue-500/20">
                      <p className="text-gray-300 text-center">Custom Builds</p>
                    </div>
                    <div className="bg-[#111111] p-4 rounded-lg border border-blue-500/20">
                      <p className="text-gray-300 text-center">Daily Drivers</p>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-4 relative z-30">
                  <Link 
                    href="/products/nafl-bumper"
                    prefetch={false}
                    className="inline-flex items-center justify-center w-full px-8 py-4 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors duration-300"
                  >
                    View Full Details
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Additional Info Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              {/* Production Time */}
              <div className="bg-[#111111] p-6 rounded-lg border border-blue-500/20">
                <div className="flex items-center mb-4">
                  <svg className="w-6 h-6 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4 className="text-lg font-semibold text-white">Production Time</h4>
                </div>
                <p className="text-gray-400">Up to one week per bumper</p>
              </div>

              {/* Shipping */}
              <div className="bg-[#111111] p-6 rounded-lg border border-blue-500/20">
                <div className="flex items-center mb-4">
                  <svg className="w-6 h-6 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  <h4 className="text-lg font-semibold text-white">Delivery Options</h4>
                </div>
                <p className="text-gray-400">UK collection or worldwide shipping available</p>
              </div>

              {/* Location */}
              <div className="bg-[#111111] p-6 rounded-lg border border-blue-500/20">
                <div className="flex items-center mb-4">
                  <svg className="w-6 h-6 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <h4 className="text-lg font-semibold text-white">Location</h4>
                </div>
                <p className="text-gray-400">Based in Chester/Flint, UK</p>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
        </section>

        {/* Contact Section */}
        <section id="contact" className="relative py-32 bg-[#0A0A0A] overflow-hidden">
          {/* Background grid pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(to right, #2563EB 1px, transparent 1px),
                              linear-gradient(to bottom, #2563EB 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }} />
          </div>

          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
              GET IN TOUCH
            </h2>

            <div className="max-w-2xl mx-auto relative">
              <ContactForm />

              {/* Decorative elements */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none" />
              <div className="absolute -bottom-4 left-4 right-4 h-4 bg-blue-500/5 blur-xl rounded-lg pointer-events-none" />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative bg-[#0A0A0A] border-t border-blue-500/10">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Blueprint lines */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `linear-gradient(to right, #2563EB 1px, transparent 1px),
                                linear-gradient(to bottom, #2563EB 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
              }} />
            </div>
            
            {/* Subtle tire tread pattern */}
            <div className="absolute bottom-0 left-0 right-0 h-32 opacity-[0.02]">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q 25 0, 50 10 T 100 10' stroke='%232563EB' fill='none' stroke-width='2'/%3E%3C/svg%3E")`,
                backgroundSize: '100px 20px',
                backgroundRepeat: 'repeat-x'
              }} />
            </div>
          </div>

          <div className="relative z-10 container mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
              {/* Brand section */}
              <div className="text-center md:text-left">
                <div className="inline-block mb-4">
                  <div className="relative w-12 h-12">
                    <Image
                      src="/uploads/whitetransparentlogo.png"
                      alt="The Bandit Camp Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <p className="text-gray-400 text-sm tracking-wider font-light max-w-xs mx-auto md:mx-0">
                  For Track Kings, Garage Queens, Street Bandits and Daily Drivers
                </p>
              </div>

              {/* Navigation */}
              <div className="text-center">
                <nav className="space-x-8">
                  <a href="#" className="text-gray-300 hover:text-blue-500 transition-colors duration-300 text-sm font-medium tracking-wide">
                    HOME
                  </a>
                  <a href="#" className="text-gray-300 hover:text-blue-500 transition-colors duration-300 text-sm font-medium tracking-wide">
                    SHOP
                  </a>
                  <a href="#" className="text-gray-300 hover:text-blue-500 transition-colors duration-300 text-sm font-medium tracking-wide">
                    CONTACT
                  </a>
                </nav>
              </div>

              {/* Social/Contact */}
              <div className="text-center md:text-right space-y-2">
                <div className="flex justify-center md:justify-end space-x-4">
                  <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                </div>
                <p className="text-gray-500 text-xs tracking-wider">
                  © 2024 THE BANDIT CAMP. ALL RIGHTS RESERVED.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}

// Update HeroCarousel component
function HeroCarousel() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    '/uploads/hero/hero1.png',
    '/uploads/hero/hero2.png',
    '/uploads/hero/hero3.png'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full">
      {images.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={src}
            alt={`Hero image ${index + 1}`}
            fill
            priority={index === 0}
            className="object-cover w-full h-full"
            sizes="100vw"
            quality={90}
          />
        </div>
      ))}
      
      {/* Carousel indicators - adjust positioning and style */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              index === currentImageIndex
                ? 'bg-blue-500 scale-110'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
