
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Tag } from "lucide-react";
import { Link } from "react-router-dom";

interface FoodCardProps {
  id: string;
  title: string;
  description: string;
  price: {
    original: number;
    discounted: number;
  };
  image: string;
  restaurant: string;
  distance: string;
  timeRemaining: string;
  tags: string[];
  isFlashDeal?: boolean;
}

const FoodCard: React.FC<FoodCardProps> = ({
  id,
  title,
  description,
  price,
  image,
  restaurant,
  distance,
  timeRemaining,
  tags,
  isFlashDeal = false,
}) => {
  const discount = Math.round(100 - (price.discounted / price.original) * 100);
  
  return (
    <Link to={`/food/${id}`} className="block h-full">
      <Card className={`food-card h-full flex flex-col ${isFlashDeal ? 'flash-deal' : ''}`}>
        <div className="relative">
          <img src={image} alt={title} className="food-card-image w-full h-40 sm:h-36 object-cover" />
          {isFlashDeal && (
            <div className="flash-deal-badge">Flash Deal!</div>
          )}
          <Badge className="absolute bottom-2 left-2 bg-eco-600">
            {discount}% OFF
          </Badge>
        </div>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-lg line-clamp-1">{title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground line-clamp-1">
            {restaurant}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 pb-2 flex-grow">
          <p className="text-sm line-clamp-2 mb-2">{description}</p>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center text-sm">
              <MapPin size={14} className="mr-1 text-muted-foreground" />
              <span className="text-muted-foreground">{distance}</span>
            </div>
            <div className="flex items-center text-sm">
              <Clock size={14} className="mr-1 text-muted-foreground" />
              <span className="text-muted-foreground">{timeRemaining}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="eco-badge">
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-2 flex justify-between items-center mt-auto">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground line-through text-sm">
              ${price.original.toFixed(2)}
            </span>
            <span className="text-lg font-bold text-eco-600">
              ${price.discounted.toFixed(2)}
            </span>
          </div>
          <Button size="sm" className="bg-eco-500 hover:bg-eco-600">
            View Deal
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default FoodCard;
