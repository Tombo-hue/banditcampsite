import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Truck, Clock, MapPin } from "lucide-react"
import { useState, useEffect, useCallback } from "react"

export type ShippingMethod = 'standard' | 'pickup' | 'express';

interface ShippingOption {
  id: ShippingMethod;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ShippingOptionsProps {
  selected: ShippingMethod;
  onSelect: (method: ShippingMethod) => void;
  postalCode?: string;
}

// Function to calculate distance between two postcodes using our API route
export const calculateDistance = async (postcode: string): Promise<number> => {
  try {
    const response = await fetch(`/api/calculate-distance?postcode=${encodeURIComponent(postcode)}`);
    if (!response.ok) {
      throw new Error('Failed to calculate distance');
    }
    
    const data = await response.json();
    return data.distance;
  } catch (error) {
    console.error('Error calculating distance:', error);
    return 10; // Minimum distance fallback
  }
};

// Debounce function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function ShippingOptions({ selected, onSelect, postalCode }: ShippingOptionsProps) {
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([
    {
      id: 'standard',
      name: 'Standard Delivery',
      description: 'Delivery to your address (95p per mile)',
      price: 0,
      estimatedDays: '3-5 business days',
      icon: Truck
    },
    {
      id: 'pickup',
      name: 'Local Pickup',
      description: 'Pickup from our Chester/Flint location',
      price: 0,
      estimatedDays: 'Available immediately',
      icon: MapPin
    }
  ]);

  const [currentDistance, setCurrentDistance] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [lastCalculatedPostcode, setLastCalculatedPostcode] = useState<string>('');

  // Memoize the calculation function
  const debouncedCalculateShipping = useCallback(
    debounce(async (postcode: string) => {
      if (postcode && postcode.length >= 4 && postcode !== lastCalculatedPostcode) {
        setIsCalculating(true);
        try {
          const distance = await calculateDistance(postcode);
          setCurrentDistance(distance);
          const deliveryPrice = Math.round(distance * 0.60); // 60p per mile
          
          setShippingOptions(prev => prev.map(option => {
            if (option.id === 'standard') {
              return {
                ...option,
                price: deliveryPrice,
                description: `Delivery to your address (${distance} miles at 60p per mile)`
              };
            }
            return option;
          }));
          setLastCalculatedPostcode(postcode);
        } catch (error) {
          console.error('Error calculating shipping:', error);
        } finally {
          setIsCalculating(false);
        }
      } else if (!postcode || postcode.length < 4) {
        setCurrentDistance(null);
      }
    }, 1000), // 1 second debounce
    [lastCalculatedPostcode]
  );

  useEffect(() => {
    if (postalCode) {
      debouncedCalculateShipping(postalCode);
    }
  }, [postalCode, debouncedCalculateShipping]);

  return (
    <div className="space-y-4">
      {/* Temporary mileage display */}
      {(currentDistance !== null || isCalculating) && (
        <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Distance:</span>
            <span className="text-white font-medium">
              {isCalculating ? (
                <span className="text-blue-400">Calculating...</span>
              ) : (
                `${currentDistance} miles`
              )}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-gray-400">Postcode entered:</span>
            <span className="text-white font-medium">{postalCode?.toUpperCase()}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {isCalculating ? 'Calculating road distance...' : 'Distance calculated by road route'}
          </div>
        </div>
      )}

      <RadioGroup value={selected} onValueChange={(value) => onSelect(value as ShippingMethod)}>
        <div className="grid gap-4">
          {shippingOptions.map((option) => (
            <div key={option.id}>
              <RadioGroupItem
                value={option.id}
                id={option.id}
                className="peer sr-only"
              />
              <Label
                htmlFor={option.id}
                className="block cursor-pointer"
              >
                <Card className={`border-2 p-4 ${
                  selected === option.id 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-blue-500/20 hover:border-blue-500/40 bg-[#111111]'
                }`}>
                  <div className="flex items-start gap-4">
                    <div className={`rounded-full p-2 ${
                      selected === option.id 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'bg-[#111111] text-gray-400'
                    }`}>
                      <option.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div className="font-medium text-white">{option.name}</div>
                        <div className="font-medium text-white">
                          {option.price === 0 ? 'FREE' : `£${option.price.toFixed(2)}`}
                        </div>
                      </div>
                      <div className="text-sm text-gray-400 mt-1">{option.description}</div>
                      <div className="text-sm text-gray-400 mt-1">
                        Estimated delivery: {option.estimatedDays}
                      </div>
                    </div>
                  </div>
                </Card>
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
} 