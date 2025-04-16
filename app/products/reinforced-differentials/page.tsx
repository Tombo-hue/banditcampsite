'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ConfigOptions {
  diffType: 'open' | 'welded' | 'torsen' | 'reinforcement-with-diff' | 'reinforcement-only' | null;
  diffSize: '1.6' | '1.8' | null;
  extras: {
    polybushing: boolean;
    newSeals: boolean;
    rustTreatment: boolean;
    propShaft: boolean;
  };
}

export default function ReinforcedDifferentialsPage() {
  const router = useRouter();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [config, setConfig] = useState<ConfigOptions>({
    diffType: null,
    diffSize: null,
    extras: {
      polybushing: false,
      newSeals: false,
      rustTreatment: false,
      propShaft: false,
    },
  });

  // This will be populated with the actual images from the directory
  const images = Array.from({ length: 12 }, (_, i) => ({
    src: `/products/reinforced-differentials/images/diff${i + 1}.jpg`,
    alt: `Reinforced Differential Image ${i + 1}`,
  }));

  const prices = {
    'open': 300,
    'welded': 350,
    'torsen': 700,
    'reinforcement-with-diff': 225,
    'reinforcement-only': 200,
    'polybushing': 100,
    'newSeals': 40,
    'rustTreatment': 100,
    'propShaft': 15,
  };

  const calculateTotal = () => {
    let total = 0;
    
    // Add base price based on differential type
    if (config.diffType) {
      total += prices[config.diffType];
    }
    
    // Add extras
    if (config.extras.polybushing) total += prices.polybushing;
    if (config.extras.newSeals) total += prices.newSeals;
    if (config.extras.rustTreatment) total += prices.rustTreatment;
    if (config.extras.propShaft) total += prices.propShaft;

    return total;
  };

  const handleCheckout = () => {
    if (!config.diffType || !config.diffSize) return;

    const configString = encodeURIComponent(JSON.stringify(config));
    router.push(`/checkout?product=reinforced-differentials&config=${configString}&total=${calculateTotal()}`);
  };

  return (
    <main className="min-h-screen bg-[#0A0A0A]">

      <div className="pt-20">
        {/* Product Header */}
        <section className="relative py-16">
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
                  />
                </div>

                {/* Thumbnails */}
                <div className="grid grid-cols-6 gap-2">
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
                      />
                    </button>
                  ))}
                </div>

                {/* Why Reinforce Your Diff? */}
                <div className="space-y-6 bg-[#111111] p-6 rounded-lg border border-blue-500/20">
                  <h2 className="text-2xl font-bold text-white">Why Reinforce Your Diff?</h2>
                  <p className="text-gray-400">
                    Stock MX-5 differential casings are prone to breaking, especially on lowered cars or high-power builds, 
                    due to a factory-designed weak point in the casing arms. Our reinforced diffs significantly improve durability.
                  </p>
                  <ul className="space-y-4">
                    {[
                      'Perfect for drifting and track racing',
                      'Essential for lowered/stanced builds',
                      'Ideal for high-power applications',
                      'Professional TIG welding in specialist workshop',
                    ].map((point, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-6 h-6 text-blue-500 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* FAQ Section */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-[#111111] border border-blue-500/20 hover:border-blue-500/40 transition-colors duration-300">
                      <h3 className="text-lg font-semibold text-white mb-2">What's included in the reinforcement?</h3>
                      <p className="text-gray-400">Our reinforcement includes 5mm aluminum plates that are TIG welded on both sides of the casing arms, significantly strengthening the factory weak points.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-[#111111] border border-blue-500/20 hover:border-blue-500/40 transition-colors duration-300">
                      <h3 className="text-lg font-semibold text-white mb-2">Which MX-5 models are compatible?</h3>
                      <p className="text-gray-400">Our reinforced diffs are compatible with both MX-5 Mk1 & Mk2 models, in both 1.6L and 1.8L variants. We can accommodate both push-in and bolt-on driveshaft types.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-[#111111] border border-blue-500/20 hover:border-blue-500/40 transition-colors duration-300">
                      <h3 className="text-lg font-semibold text-white mb-2">Can I send my own differential?</h3>
                      <p className="text-gray-400">Yes! We offer both complete differential builds and reinforcement services for your existing diff. You can send us just the casing or the complete differential unit.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-[#111111] border border-blue-500/20 hover:border-blue-500/40 transition-colors duration-300">
                      <h3 className="text-lg font-semibold text-white mb-2">What's the benefit of polybushing?</h3>
                      <p className="text-gray-400">Polybushing provides better stability and reduced movement compared to standard rubber bushings, making it ideal for performance applications while still maintaining reasonable comfort.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-[#111111] border border-blue-500/20 hover:border-blue-500/40 transition-colors duration-300">
                      <h3 className="text-lg font-semibold text-white mb-2">How long does the process take?</h3>
                      <p className="text-gray-400">Standard turnaround time is up to 1 week from payment to completion. This includes thorough inspection, reinforcement, and quality testing to ensure everything meets our standards.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Configuration Options */}
              <div className="w-full md:w-1/3 space-y-8">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-4">Reinforced Differentials</h1>
                  <p className="text-gray-400">
                    Professional-grade reinforced differential casings for MX-5 Mk1 & Mk2. Perfect for high-performance builds and track use.
                  </p>
                </div>

                {/* Configuration Options */}
                <div className="space-y-6">
                  {/* Differential Type */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Select Differential Type</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { 
                          id: 'open', 
                          label: 'Reinforced Open Diff (1.6 / 1.8)', 
                          price: '£300',
                          description: 'Standard open differential with reinforced casing'
                        },
                        { 
                          id: 'welded', 
                          label: 'Reinforced Welded Diff (1.6 / 1.8)', 
                          price: '£350',
                          description: 'Welded differential for maximum lock'
                        },
                        { 
                          id: 'torsen', 
                          label: 'Reinforced Torsen LSD (4:1)', 
                          price: '£700',
                          description: '1.8 but fits 1.6 with prop + driveshaft',
                          disabled: config.diffSize === '1.6'
                        },
                        { 
                          id: 'reinforcement-with-diff', 
                          label: 'Send Your Diff (with casing) for Reinforcement', 
                          price: '£225',
                          description: 'We\'ll reinforce your complete differential unit'
                        },
                        { 
                          id: 'reinforcement-only', 
                          label: 'Send Your Casing Only for Reinforcement', 
                          price: '£200',
                          description: 'We\'ll reinforce just your differential casing'
                        },
                      ].map((type) => (
                        <button
                          key={type.id}
                          onClick={() => {
                            // If selecting torsen and 1.6 is selected, clear the size
                            if (type.id === 'torsen' && config.diffSize === '1.6') {
                              return;
                            }
                            setConfig({ ...config, diffType: type.id as any })
                          }}
                          disabled={type.disabled}
                          className={`p-4 rounded-lg border ${
                            config.diffType === type.id
                              ? 'border-blue-500 bg-blue-500/10'
                              : type.disabled
                              ? 'border-gray-500/20 bg-gray-500/5 cursor-not-allowed opacity-50'
                              : 'border-blue-500/20 hover:border-blue-500/40'
                          } text-left`}
                        >
                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className={`text-white ${type.disabled ? 'opacity-50' : ''}`}>{type.label}</span>
                              <span className={`text-blue-500 ${type.disabled ? 'opacity-50' : ''}`}>{type.price}</span>
                            </div>
                            <p className={`text-gray-400 text-sm ${type.disabled ? 'opacity-50' : ''}`}>{type.description}</p>
                            {type.disabled && (
                              <p className="text-red-400 text-xs">Not available with 1.6L</p>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Differential Size */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Select Size</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: '1.8', label: '1.8L' },
                        { id: '1.6', label: '1.6L', disabled: config.diffType === 'torsen' },
                      ].map((size) => (
                        <button
                          key={size.id}
                          onClick={() => {
                            // If selecting 1.6 and torsen is selected, clear the diff type
                            if (size.id === '1.6' && config.diffType === 'torsen') {
                              return;
                            }
                            setConfig({ ...config, diffSize: size.id as any })
                          }}
                          disabled={size.disabled}
                          className={`p-4 rounded-lg border ${
                            config.diffSize === size.id
                              ? 'border-blue-500 bg-blue-500/10'
                              : size.disabled
                              ? 'border-gray-500/20 bg-gray-500/5 cursor-not-allowed opacity-50'
                              : 'border-blue-500/20 hover:border-blue-500/40'
                          }`}
                        >
                          <span className={`text-white ${size.disabled ? 'opacity-50' : ''}`}>{size.label}</span>
                          {size.disabled && (
                            <p className="text-red-400 text-xs mt-1">Not available with Torsen</p>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Extra Options */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Extra Options</h3>
                    <div className="space-y-2">
                      <label className="flex items-center p-4 rounded-lg border border-blue-500/20 hover:border-blue-500/40 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config.extras.polybushing}
                          onChange={(e) => setConfig({
                            ...config,
                            extras: { ...config.extras, polybushing: e.target.checked }
                          })}
                          className="form-checkbox h-5 w-5 text-blue-500 rounded border-blue-500/20"
                        />
                        <div className="ml-3 flex justify-between items-center flex-1">
                          <span className="text-white">Polybushing upgrade</span>
                          <span className="text-blue-500">+£100</span>
                        </div>
                      </label>
                      <label className="flex items-center p-4 rounded-lg border border-blue-500/20 hover:border-blue-500/40 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config.extras.newSeals}
                          onChange={(e) => setConfig({
                            ...config,
                            extras: { ...config.extras, newSeals: e.target.checked }
                          })}
                          className="form-checkbox h-5 w-5 text-blue-500 rounded border-blue-500/20"
                        />
                        <div className="ml-3 flex justify-between items-center flex-1">
                          <span className="text-white">New seals fitted</span>
                          <span className="text-blue-500">+£40</span>
                        </div>
                      </label>
                      <label className="flex items-center p-4 rounded-lg border border-blue-500/20 hover:border-blue-500/40 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config.extras.rustTreatment}
                          onChange={(e) => setConfig({
                            ...config,
                            extras: { ...config.extras, rustTreatment: e.target.checked }
                          })}
                          className="form-checkbox h-5 w-5 text-blue-500 rounded border-blue-500/20"
                        />
                        <div className="ml-3 flex justify-between items-center flex-1">
                          <span className="text-white">Rust treatment, prevention & coating</span>
                          <span className="text-blue-500">+£100</span>
                        </div>
                      </label>
                      <label className="flex items-center p-4 rounded-lg border border-blue-500/20 hover:border-blue-500/40 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config.extras.propShaft}
                          onChange={(e) => setConfig({
                            ...config,
                            extras: { ...config.extras, propShaft: e.target.checked }
                          })}
                          className="form-checkbox h-5 w-5 text-blue-500 rounded border-blue-500/20"
                        />
                        <div className="ml-3 flex justify-between items-center flex-1">
                          <span className="text-white">Prop Shaft</span>
                          <span className="text-blue-500">+£15</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Total Price & Configure Purchase */}
                <div className="space-y-4 pt-6 border-t border-blue-500/10">
                  <div className="flex justify-between items-center">
                    <span className="text-lg text-white">Total Price:</span>
                    <span className="text-2xl font-bold text-blue-500">£{calculateTotal()}</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    disabled={!config.diffType || !config.diffSize}
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
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
} 