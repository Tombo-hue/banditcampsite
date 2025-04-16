import { Check } from "lucide-react"

interface Step {
  id: 'shipping' | 'billing' | 'payment';
  name: string;
  status: 'complete' | 'current' | 'upcoming';
}

interface CheckoutProgressProps {
  currentStep: 'shipping' | 'billing' | 'payment';
}

export function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
  const steps: Step[] = [
    { 
      id: 'shipping', 
      name: 'Shipping',
      status: currentStep === 'shipping' ? 'current' : currentStep === 'billing' || currentStep === 'payment' ? 'complete' : 'upcoming'
    },
    { 
      id: 'billing', 
      name: 'Billing Details',
      status: currentStep === 'billing' ? 'current' : currentStep === 'payment' ? 'complete' : 'upcoming'
    },
    { 
      id: 'payment', 
      name: 'Payment',
      status: currentStep === 'payment' ? 'current' : 'upcoming'
    },
  ]

  return (
    <div className="w-full py-12 mt-12">
      <div className="max-w-2xl mx-auto px-4">
        <nav aria-label="Progress">
          <ol role="list" className="flex items-center justify-between">
            {steps.map((step, stepIdx) => (
              <li key={step.name} className={`relative flex items-center ${stepIdx !== steps.length - 1 ? 'w-full' : ''}`}>
                <div className="flex items-center">
                  <span className="relative flex items-center justify-center">
                    {step.status === 'complete' ? (
                      <span className="w-10 h-10 flex items-center justify-center bg-blue-500 rounded-full transition-colors duration-200 ease-in-out group-hover:bg-blue-600">
                        <Check className="w-6 h-6 text-[#0A0A0A]" />
                      </span>
                    ) : step.status === 'current' ? (
                      <span className="w-10 h-10 flex items-center justify-center border-2 border-blue-500 bg-[#111111] rounded-full">
                        <span className="h-3 w-3 bg-blue-500 rounded-full" />
                      </span>
                    ) : (
                      <span className="w-10 h-10 flex items-center justify-center border-2 border-gray-700 bg-[#111111] rounded-full">
                        <span className="h-3 w-3 bg-transparent rounded-full" />
                      </span>
                    )}
                  </span>
                  <span className="ml-4 min-w-0">
                    <span
                      className={`text-sm font-medium ${
                        step.status === 'complete' ? 'text-blue-400' :
                        step.status === 'current' ? 'text-blue-500' :
                        'text-gray-500'
                      }`}
                    >
                      {step.name}
                    </span>
                  </span>
                </div>
                {stepIdx !== steps.length - 1 && (
                  <div className="flex-1 mx-4">
                    <div className={`h-0.5 ${step.status === 'complete' ? 'bg-blue-500/50' : 'bg-gray-800'}`} />
                  </div>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  )
} 