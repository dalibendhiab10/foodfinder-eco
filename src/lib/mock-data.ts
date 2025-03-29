
// Mock data for food items
export const foodMockData = [
  {
    id: "1",
    title: "Bakery Surprise Box",
    description: "A delicious assortment of freshly baked pastries, bread, and desserts that would otherwise go to waste.",
    price: {
      original: 35.99,
      discounted: 12.99,
    },
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80",
    restaurant: "Fresh Morning Bakery",
    distance: "0.8 km",
    timeRemaining: "3 hours left",
    tags: ["Pastries", "Bread", "Desserts"],
    isFlashDeal: true,
    category: "bakery",
    quantity: 2,
  },
  {
    id: "2",
    title: "Sushi Platter",
    description: "Premium sushi platter with a variety of fresh rolls, sashimi, and nigiri made from today's fresh ingredients.",
    price: {
      original: 45.00,
      discounted: 18.00,
    },
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    restaurant: "Osaka Sushi Bar",
    distance: "1.2 km",
    timeRemaining: "2 hours left",
    tags: ["Sushi", "Japanese", "Seafood"],
    isFlashDeal: false,
    category: "restaurant",
    quantity: 1,
  },
  {
    id: "3",
    title: "Mediterranean Feast",
    description: "A delicious spread of hummus, falafel, pita bread, and assorted dips and salads for 2-3 people.",
    price: {
      original: 39.99,
      discounted: 15.99,
    },
    image: "https://images.unsplash.com/photo-1544378730-8b5104b18790?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1426&q=80",
    restaurant: "Olive Garden Cafe",
    distance: "2.5 km",
    timeRemaining: "4 hours left",
    tags: ["Mediterranean", "Vegetarian", "Healthy"],
    isFlashDeal: false,
    category: "restaurant",
    quantity: 3,
  },
  {
    id: "4",
    title: "Organic Produce Box",
    description: "Assorted organic fruits and vegetables that are still fresh but didn't meet the display standards.",
    price: {
      original: 28.50,
      discounted: 9.99,
    },
    image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    restaurant: "Green Market",
    distance: "3.2 km",
    timeRemaining: "5 hours left",
    tags: ["Organic", "Vegetables", "Fruits"],
    isFlashDeal: false,
    category: "grocery",
    quantity: 5,
  },
  {
    id: "5",
    title: "Artisan Pizza Duo",
    description: "Two medium-sized artisan pizzas with gourmet toppings, made fresh today.",
    price: {
      original: 32.00,
      discounted: 13.50,
    },
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    restaurant: "Napoli Pizza",
    distance: "1.8 km",
    timeRemaining: "1 hour left",
    tags: ["Pizza", "Italian", "Dinner"],
    isFlashDeal: true,
    category: "restaurant",
    quantity: 2,
  },
  {
    id: "6",
    title: "Gourmet Sandwich Pack",
    description: "Assortment of premium sandwiches with various fillings, perfect for lunch or a quick dinner.",
    price: {
      original: 25.99,
      discounted: 10.99,
    },
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1473&q=80",
    restaurant: "Urban Deli",
    distance: "0.5 km",
    timeRemaining: "2 hours left",
    tags: ["Sandwiches", "Lunch", "Quick Meal"],
    isFlashDeal: false,
    category: "deli",
    quantity: 4,
  },
  {
    id: "7",
    title: "Dessert Collection",
    description: "A delightful mix of cakes, pastries and desserts from our premium range, all fresh from today.",
    price: {
      original: 42.50,
      discounted: 16.99,
    },
    image: "https://images.unsplash.com/photo-1488477304112-4944851de03d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80",
    restaurant: "Sweet Delights Patisserie",
    distance: "2.1 km",
    timeRemaining: "3 hours left",
    tags: ["Desserts", "Cakes", "Sweet"],
    isFlashDeal: true,
    category: "bakery",
    quantity: 1,
  },
  {
    id: "8",
    title: "Dairy and Cheese Pack",
    description: "Selection of quality cheeses, yogurt, and dairy products approaching their best-before date but still perfect to enjoy.",
    price: {
      original: 37.00,
      discounted: 14.80,
    },
    image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1473&q=80",
    restaurant: "Farmers Market",
    distance: "3.7 km",
    timeRemaining: "6 hours left",
    tags: ["Dairy", "Cheese", "Yogurt"],
    isFlashDeal: false,
    category: "grocery",
    quantity: 2,
  },
  {
    id: "9",
    title: "Vegan Lunch Box",
    description: "Nutritious plant-based lunch with salad, sandwich, and a dessert prepared fresh this morning.",
    price: {
      original: 22.99,
      discounted: 8.99,
    },
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    restaurant: "Green Leaf Cafe",
    distance: "1.5 km",
    timeRemaining: "2 hours left",
    tags: ["Vegan", "Healthy", "Lunch"],
    isFlashDeal: false,
    category: "restaurant",
    quantity: 3,
  },
  {
    id: "10",
    title: "Asian Street Food Box",
    description: "Delicious assortment of Asian street food favorites including dumplings, spring rolls, and noodles.",
    price: {
      original: 33.50,
      discounted: 13.40,
    },
    image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    restaurant: "Spice Market",
    distance: "2.3 km",
    timeRemaining: "1 hour left",
    tags: ["Asian", "Street Food", "Spicy"],
    isFlashDeal: true,
    category: "restaurant",
    quantity: 2,
  }
];

// Mock data for user profile
export const userMockData = {
  id: "user1",
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  phone: "+1 (555) 123-4567",
  address: "123 Green Street, Eco City, EC 12345",
  savedPaymentMethods: [
    { id: "pm1", type: "creditCard", last4: "4242", brand: "Visa", expiry: "05/25" },
    { id: "pm2", type: "paypal", email: "alex@example.com" }
  ],
  ecoPoints: 1250,
  ecoLevel: "Earth Protector",
  foodSaved: 45, // in kg
  co2Reduced: 68, // in kg
  badges: [
    { id: "b1", name: "First Rescue", icon: "🌱", description: "Saved your first food item" },
    { id: "b2", name: "Eco Warrior", icon: "🛡️", description: "Saved 10 food items" },
    { id: "b3", name: "Waste Crusher", icon: "💪", description: "Prevented 50kg of food waste" }
  ],
  orderHistory: [
    { 
      id: "o1", 
      date: "2023-08-15", 
      restaurant: "Fresh Morning Bakery",
      items: ["Bakery Surprise Box"],
      total: 12.99,
      status: "completed"
    },
    { 
      id: "o2", 
      date: "2023-08-10", 
      restaurant: "Napoli Pizza",
      items: ["Artisan Pizza Duo"],
      total: 13.50,
      status: "completed"
    },
    { 
      id: "o3", 
      date: "2023-08-05", 
      restaurant: "Green Market",
      items: ["Organic Produce Box"],
      total: 9.99,
      status: "completed"
    }
  ]
};

// Mock data for active orders
export const ordersMockData = [
  {
    id: "o4",
    date: "2023-08-20",
    restaurant: "Osaka Sushi Bar",
    restaurantAddress: "456 Ocean Ave, Eco City",
    items: [{ name: "Sushi Platter", quantity: 1, price: 18.00 }],
    total: 18.00,
    status: "preparing",
    estimatedPickupTime: "Today, 6:30 PM",
    trackingSteps: [
      { id: 1, name: "Order Confirmed", completed: true, time: "3:15 PM" },
      { id: 2, name: "Preparing", completed: true, time: "3:30 PM" },
      { id: 3, name: "Ready for Pickup", completed: false, time: null },
      { id: 4, name: "Completed", completed: false, time: null }
    ]
  },
  {
    id: "o5",
    date: "2023-08-19",
    restaurant: "Sweet Delights Patisserie",
    restaurantAddress: "789 Sugar St, Eco City",
    items: [{ name: "Dessert Collection", quantity: 1, price: 16.99 }],
    total: 16.99,
    status: "ready",
    estimatedPickupTime: "Today, 5:00 PM",
    trackingSteps: [
      { id: 1, name: "Order Confirmed", completed: true, time: "1:45 PM" },
      { id: 2, name: "Preparing", completed: true, time: "2:15 PM" },
      { id: 3, name: "Ready for Pickup", completed: true, time: "2:45 PM" },
      { id: 4, name: "Completed", completed: false, time: null }
    ]
  }
];
