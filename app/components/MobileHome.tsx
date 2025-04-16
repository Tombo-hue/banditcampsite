'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";

export default function MobileHome() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();

  const heroImages = [
    '/uploads/hero/hero1.png',
    '/uploads/hero/hero2.png',
    '/uploads/hero/hero3.png'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleNavigation = (sectionId: string) => {
    setIsMenuOpen(false); // Close menu when navigating
    
    // If we're not on the home page, navigate to home with hash
    if (window.location.pathname !== '/') {
      router.push('/' + sectionId);
      return;
    }

    // If we're already on home page, just scroll to the section
    const element = document.getElementById(sectionId.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-sm z-50">
        <div className="flex items-center justify-between px-4 h-16">
          {/* Logo */}
          <button onClick={() => handleNavigation('')} className="relative w-10 h-10">
            <Image
              src="/uploads/whitetransparentlogo.png"
              alt="The Bandit Camp Logo"
              fill
              className="object-contain"
            />
          </button>

          {/* Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="absolute top-16 left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-white/10">
            <div className="px-4 py-4">
              <ul className="space-y-4">
                <li>
                  <button
                    onClick={() => handleNavigation('')}
                    className="block w-full text-left py-3 text-white hover:text-blue-500 transition-colors text-lg font-medium"
                  >
                    HOME
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation('#products')}
                    className="block w-full text-left py-3 text-white hover:text-blue-500 transition-colors text-lg font-medium"
                  >
                    PRODUCTS
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation('#contact')}
                    className="block w-full text-left py-3 text-white hover:text-blue-500 transition-colors text-lg font-medium"
                  >
                    CONTACT
                  </button>
                </li>
              </ul>
            </div>
          </nav>
        )}
      </header>

      {/* Mobile Hero Section */}
      <section className="relative h-[100vh] w-full">
        {/* Hero Carousel */}
        <div className="absolute inset-0">
          {heroImages.map((src, index) => (
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
                className="object-cover"
                sizes="100vw"
                quality={90}
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center px-6 text-center">
          <h1 className="text-5xl font-bold text-white tracking-tight drop-shadow-2xl mb-6">
            THE BANDIT CAMP
          </h1>
          <p className="text-xl text-gray-200 font-light drop-shadow-lg max-w-xs leading-relaxed">
            For Track Kings, Garage Queens, Street Bandits and Daily Drivers
          </p>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentImageIndex
                  ? 'bg-white scale-110'
                  : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce">
            <svg
              className="w-6 h-6 text-white/70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Products Showcase Section */}
      <section id="products" className="py-16 px-4 bg-[#0A0A0A]">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Our Products
        </h2>

        {/* Reinforced Differential */}
        <div className="mb-16">
          <div className="relative h-64 mb-6 rounded-lg overflow-hidden">
            <Image
              src="/uploads/products/diff1.jpg"
              alt="Reinforced MX-5 Differential"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white">
              Reinforced Differentials
            </h3>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-300 text-sm leading-relaxed">
              Professional-grade reinforced differential casings, custom-made for your Mazda MX-5. Perfect for high-performance builds and track enthusiasts.
            </p>
            
            <ul className="space-y-2">
              <li className="flex items-start text-sm">
                <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300">5mm aluminum reinforcement plates</span>
              </li>
              <li className="flex items-start text-sm">
                <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300">Professional TIG welding</span>
              </li>
              <li className="flex items-start text-sm">
                <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300">Compatible with all driveshaft types</span>
              </li>
            </ul>

            <Link 
              href="/products/reinforced-differentials"
              className="mt-6 inline-flex w-full items-center justify-center px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors duration-300"
            >
              View Details
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* NAFL Bumper */}
        <div className="mb-16">
          <div className="relative h-64 mb-6 rounded-lg overflow-hidden">
            <Image
              src="/uploads/products/bumper1.jpg"
              alt="NAFL Bumper"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white">
              NAFL Bumper
            </h3>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-300 text-sm leading-relaxed">
              Choose between our fiberglass mould or fabricated version using original bumper plastic. Each piece is carefully crafted to ensure perfect fitment and finish.
            </p>
            
            <ul className="space-y-2">
              <li className="flex items-start text-sm">
                <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300">Direct bolt-on fitment</span>
              </li>
              <li className="flex items-start text-sm">
                <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300">Uses stock Mk1 rail/trim plate</span>
              </li>
              <li className="flex items-start text-sm">
                <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300">Professional finish options</span>
              </li>
            </ul>

            <Link 
              href="/products/nafl-bumper"
              className="mt-6 inline-flex w-full items-center justify-center px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors duration-300"
            >
              View Details
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 px-4 bg-[#0A0A0A]">
        <div className="max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Customer Reviews
          </h2>
          
          {/* Reviews Slider */}
          <div className="space-y-6">
            {/* Review 1 */}
            <div className="bg-[#111111] p-6 rounded-lg border border-blue-500/20">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                "Just bought a 1.8 welded and reinforced diff off Tom as well as driveshafts and prop. Extremely professional, super responsive and will get you what you want."
              </p>
            </div>

            {/* Review 2 */}
            <div className="bg-[#111111] p-6 rounded-lg border border-blue-500/20">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                "I bought a Reinforced Torsen off the Bandit camp, the boys were super professional, quick and friendly! The diff has been through some abuse with no issues! definitely recommend! 5 Stars!!!🌟"
              </p>
            </div>

            {/* Review 3 */}
            <div className="bg-[#111111] p-6 rounded-lg border border-blue-500/20">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                "Bought a reinforced differential for the race car, was delivered to me by the lads within a week. Very happy and I will definitely be buying again!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-16 px-4 bg-[#111111]">
        <div className="max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Get In Touch
          </h2>
          <p className="text-gray-300 text-sm text-center mb-8">
            Have questions? We're here to help.
          </p>
          
          <form onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            
            try {
              const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  name: formData.get('name'),
                  email: formData.get('email'),
                  subject: formData.get('subject'),
                  message: formData.get('message'),
                }),
              });

              if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to send message');
              }

              // Clear form
              form.reset();
              toast.success("Message sent successfully!", {
                duration: 5000,
              });
            } catch (error) {
              toast.error(error instanceof Error ? error.message : "Failed to send message", {
                duration: 5000,
              });
            }
          }} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your name"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="What's your inquiry about?"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Tell us what you need..."
              />
            </div>
            
            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center"
            >
              Send Message
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 px-4">
        <div className="max-w-md mx-auto">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <button onClick={() => handleNavigation('')} className="relative w-16 h-16">
              <Image
                src="/uploads/whitetransparentlogo.png"
                alt="The Bandit Camp Logo"
                fill
                className="object-contain"
              />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mb-8">
            <ul className="flex flex-col items-center space-y-4">
              <li>
                <button
                  onClick={() => handleNavigation('')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('#products')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('#contact')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </nav>

          {/* Social Links */}
          <div className="flex justify-center space-x-6 mb-8">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <span className="sr-only">Facebook</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <span className="sr-only">Instagram</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
              </svg>
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} The Bandit Camp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
} 