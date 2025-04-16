'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ConfigOptions {
  material: 'fabricated' | null;
  finish: 'sanded' | 'primed' | 'painted';
}

export default function NAFLBumperPage() {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [config, setConfig] = useState<ConfigOptions>({
    material: null,
    finish: 'sanded',
  });
  const router = useRouter();

  // Array of 16 images
  const images = Array.from({ length: 16 }, (_, i) => ({
    src: `/products/nafl-bumper/bumper${i + 1}.jpg`,
    alt: `Custom NAFL Bumper Image ${i + 1}`,
  }));

  const prices = {
    'fabricated': 250,
    'primed': 20,
    'painted': 50,
  };

  const calculateTotal = () => {
    let total = 0;
    
    // Add base price based on material type
    if (config.material) {
      total += prices[config.material];
    }
    
    // Add finish cost (sanded is default with no extra cost)
    if (config.finish === 'primed') {
      total += prices.primed;
    } else if (config.finish === 'painted') {
      total += prices.painted;
    }

    return total;
  };

  const handleCheckout = () => {
    if (!config.material) return;

    const configString = encodeURIComponent(JSON.stringify(config));
    router.push(`/checkout?product=nafl-bumper&config=${configString}&total=${calculateTotal()}`);
  };

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <div className="pt-20">
        {/* Product Header */}
        <section id="products" className="relative py-16">
          <div className="container mx-auto px-4">
            {/* Back to Home Button */}
            <div className="mb-8">
              <Link 
                href="/" 
                prefetch={false}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded-lg transition-colors duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Home</span>
              </Link>
            </div>
            
            <div className="flex flex-col md:flex-row gap-12">
              {/* Left Column - Image Gallery and Details */}
              <div className="w-full md:w-2/3 space-y-8">
                {/* Main Image */}
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={images[activeImageIndex].src}
                    alt={images[activeImageIndex].alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 66vw"
                    priority={activeImageIndex === 0}
                  />
                </div>

                {/* Thumbnails */}
                <div className="grid grid-cols-8 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                        activeImageIndex === index
                          ? 'border-blue-500'
                          : 'border-transparent'
                      }`}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 12.5vw, 8.33vw"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>

                {/* Product Description */}
                <div className="space-y-6 bg-[#111111] p-6 rounded-lg border border-blue-500/20">
                  <h2 className="text-2xl font-bold text-white">About the NAFL Bumper</h2>
                  <p className="text-gray-400">
                    After seeing Sinbin's Mk1 (the black one shown above) and the huge support for his custom NAFL bumper, 
                    I wanted to create my own. I've made both a fiberglass mould and a fabricated version using original 
                    bumper plastic, so you can choose the style that works best for you.
                  </p>
                </div>

                {/* Mounting & Fitment */}
                <div className="space-y-6 bg-[#111111] p-6 rounded-lg border border-blue-500/20">
                  <h2 className="text-2xl font-bold text-white">Mounting & Fitment</h2>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-blue-500 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Uses the stock Mk1 rail/trim plate for an easy swap—no extra brackets or drilling needed</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-blue-500 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Direct bolt-on fitment - no modifications required</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-blue-500 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Professional finish options available</span>
                    </li>
                  </ul>
                </div>

                {/* FAQ Section */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-[#111111] border border-blue-500/20 hover:border-blue-500/40 transition-colors duration-300">
                      <h3 className="text-lg font-semibold text-white mb-2">How long does it take to make?</h3>
                      <p className="text-gray-400">Production time is typically up to one week per bumper, depending on the finish option selected.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-[#111111] border border-blue-500/20 hover:border-blue-500/40 transition-colors duration-300">
                      <h3 className="text-lg font-semibold text-white mb-2">Do you ship internationally?</h3>
                      <p className="text-gray-400">Yes, we offer worldwide shipping where feasible. UK customers can collect from Chester/Flint or arrange for personal delivery.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Configuration Options */}
              <div className="w-full md:w-1/3 space-y-8">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-4">Custom NAFL Bumper</h1>
                  <p className="text-gray-400">
                    Choose your perfect combination of material and finish for a custom-made NAFL bumper that matches your vision.
                  </p>
                </div>

                {/* Material Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Select Material</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: 'fabricated', label: 'Fabricated Version', description: 'Uses original bumper plastic for OEM-like feel', price: '£250' },
                    ].map((material) => (
                      <button
                        key={material.id}
                        onClick={() => setConfig({ ...config, material: material.id as any })}
                        className={`p-4 rounded-lg border ${
                          config.material === material.id
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-blue-500/20 hover:border-blue-500/40'
                        } text-left`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <span className="text-white block">{material.label}</span>
                            <span className="text-gray-400 text-sm">{material.description}</span>
                          </div>
                          <span className="text-blue-500 font-semibold">{material.price}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Finish Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Select Finish</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: 'sanded', label: 'Sanded (Default)', price: null },
                      { id: 'primed', label: 'Primed', price: '+£20' },
                      { id: 'painted', label: 'Fully Painted', price: '+£50' },
                    ].map((finish) => (
                      <button
                        key={finish.id}
                        onClick={() => setConfig({ ...config, finish: finish.id as any })}
                        className={`p-4 rounded-lg border ${
                          config.finish === finish.id
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-blue-500/20 hover:border-blue-500/40'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-white">{finish.label}</span>
                          {finish.price && <span className="text-blue-500 font-semibold">{finish.price}</span>}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Total Price & Checkout */}
                <div className="space-y-4 pt-6 border-t border-blue-500/10">
                  <div className="flex justify-between items-center">
                    <span className="text-lg text-white">Total Price:</span>
                    <span className="text-2xl font-bold text-blue-500">£{calculateTotal()}</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    disabled={!config.material}
                    className="w-full py-4 bg-blue-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors duration-300"
                  >
                    Checkout
                  </button>
                </div>

                {/* Additional Info */}
                <div className="space-y-4 pt-6 border-t border-blue-500/10">
                  <div className="flex items-center text-gray-400">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Production Time: Up to 1 week</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Collection from Chester/Flint available</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>International shipping available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
} 