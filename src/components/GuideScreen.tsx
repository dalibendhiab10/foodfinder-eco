
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, MapPin, ShoppingBag, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GuideStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
}

const GuideScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const steps: GuideStep[] = [
    {
      title: "Find Sustainable Restaurants",
      description: "Discover eco-friendly restaurants that share your values for sustainable dining.",
      icon: <MapPin className="h-10 w-10 text-eco-500" />,
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&h=500"
    },
    {
      title: "Order with Ease",
      description: "Browse menus, add items to your cart, and checkout seamlessly.",
      icon: <ShoppingBag className="h-10 w-10 text-eco-500" />,
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&h=500"
    },
    {
      title: "Reduce Your Carbon Footprint",
      description: "Every order helps support eco-conscious businesses and sustainable practices.",
      icon: <Leaf className="h-10 w-10 text-eco-500" />,
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&h=500"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/auth");
    }
  };

  const handleSkip = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex flex-col">
        <div className="relative w-full h-[50vh]">
          <img 
            src={steps[currentStep].image} 
            alt={steps[currentStep].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
        
        <div className="p-6 -mt-16 relative z-10 flex-1 flex flex-col">
          <div className="mb-6 flex justify-center">
            {steps.map((_, index) => (
              <div 
                key={index}
                className={`mx-1 h-2 rounded-full transition-all ${
                  index === currentStep 
                    ? "w-6 bg-eco-500" 
                    : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>
          
          <div className="text-center mb-4">
            {steps[currentStep].icon}
          </div>
          
          <h1 className="text-2xl font-bold text-center mb-3">
            {steps[currentStep].title}
          </h1>
          
          <p className="text-center text-muted-foreground mb-8">
            {steps[currentStep].description}
          </p>
          
          <div className="mt-auto space-y-3">
            <Button 
              className="w-full"
              size="lg" 
              onClick={handleNext}
            >
              {currentStep < steps.length - 1 ? "Next" : "Get Started"}
              <ChevronRight className="ml-1" />
            </Button>
            
            {currentStep < steps.length - 1 && (
              <Button 
                variant="ghost" 
                className="w-full text-muted-foreground"
                onClick={handleSkip}
              >
                Skip
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideScreen;
