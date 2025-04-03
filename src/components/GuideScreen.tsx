import React from 'react';

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, MapPin, ShoppingBag, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import PlaceholderSvg1 from "./svgs/PlaceholderSvg1";
import PlaceholderSvg2 from "./svgs/PlaceholderSvg2";
import PlaceholderSvg3 from "./svgs/PlaceholderSvg3";

interface GuideStep {
  title: string;
  description: string;
  icon: React.ReactNode; // Keep the small icon if desired
  svgComponent: React.FC<React.SVGProps<SVGSVGElement>>;
}

const GuideScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const steps: GuideStep[] = [
    {
      title: "Find Sustainable Restaurants",
      description: "Discover eco-friendly restaurants that share your values for sustainable dining.",
      icon: <MapPin className="h-10 w-10 text-eco-500" />,
      svgComponent: PlaceholderSvg1
    },
    {
      title: "Order with Ease",
      description: "Browse menus, add items to your cart, and checkout seamlessly.",
      icon: <ShoppingBag className="h-10 w-10 text-eco-500" />,
      svgComponent: PlaceholderSvg2
    },
    {
      title: "Reduce Your Carbon Footprint",
      description: "Every order helps support eco-conscious businesses and sustainable practices.",
      icon: <Leaf className="h-10 w-10 text-eco-500" />,
      svgComponent: PlaceholderSvg3
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
        {/* Animated SVG Container */}
        <div className="relative w-full h-[50vh] flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }} // Start off-screen right and invisible
              animate={{ opacity: 1, x: 0 }} // Animate to center and visible
              exit={{ opacity: 0, x: -50 }} // Animate off-screen left and invisible
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center p-4" // Use absolute positioning for overlap during transition
            >
              {/* Render the current step's SVG component */}
              {React.createElement(steps[currentStep].svgComponent, {
                className: "w-full h-full max-w-md max-h-[40vh] object-contain", // Adjust size as needed
              })}
            </motion.div>
          </AnimatePresence>
          {/* Optional: Keep gradient overlay if desired */}
          {/* <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" /> */}
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
