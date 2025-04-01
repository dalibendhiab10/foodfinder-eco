
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { clearCart } from '@/redux/slices/cartSlice';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { placeTableOrder } from '@/services/restaurantService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Minus, Plus, Trash2 } from 'lucide-react';

const TableCheckoutPage = () => {
  const { restaurantId, tableId, sessionId } = useParams();
  const navigate = useNavigate();
  const { items } = useAppSelector(state => state.cart);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState<Record<string, string>>({});
  
  const tableItems = items.filter(item => item.tableSessionId === sessionId);
  
  const handlePlaceOrder = async () => {
    if (!user || !restaurantId || !tableId || !sessionId) {
      toast({
        variant: 'destructive',
        title: 'Cannot place order',
        description: 'Missing required information.'
      });
      return;
    }
    
    if (tableItems.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Empty cart',
        description: 'Please add items to your order.'
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Prepare items with special instructions
      const itemsWithInstructions = tableItems.map(item => ({
        ...item,
        specialInstructions: specialInstructions[item.id] || ''
      }));
      
      const result = await placeTableOrder(
        sessionId,
        itemsWithInstructions,
        user.id,
        restaurantId,
        tableId
      );
      
      if (result.success) {
        toast({
          title: 'Order Placed!',
          description: 'Your order has been sent to the kitchen.'
        });
        
        dispatch(clearCart());
        
        // Navigate to the order tracking page
        navigate(`/orders/${result.orderId}`);
      } else {
        throw new Error('Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        variant: 'destructive',
        title: 'Order Failed',
        description: 'There was a problem placing your order. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleSpecialInstructionsChange = (itemId: string, value: string) => {
    setSpecialInstructions(prev => ({
      ...prev,
      [itemId]: value
    }));
  };
  
  const subtotal = tableItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;
  
  if (tableItems.length === 0) {
    return (
      <div className="min-h-screen p-4">
        <Card className="w-full max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>Your Cart is Empty</CardTitle>
          </CardHeader>
          <CardContent className="text-center p-8">
            <p className="mb-6 text-muted-foreground">Add some items to your order first</p>
            <Button onClick={() => navigate(`/restaurant/${restaurantId}/table/${tableId}/session/${sessionId}`)}>
              Back to Menu
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-4">Review Your Order</h1>
        
        <div className="space-y-4 mb-6">
          {tableItems.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-start">
                  {item.image && (
                    <div className="w-16 h-16 rounded overflow-hidden mr-3">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-7 w-7 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="mx-2 min-w-8 text-center">{item.quantity}</span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-7 w-7 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <Textarea
                      placeholder="Special instructions (optional)"
                      className="mt-3 text-sm"
                      value={specialInstructions[item.id] || ''}
                      onChange={(e) => handleSpecialInstructionsChange(item.id, e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </CardContent>
          <CardFooter className="flex-col space-y-3">
            <Button 
              className="w-full" 
              size="lg" 
              disabled={isProcessing}
              onClick={handlePlaceOrder}
            >
              {isProcessing ? "Processing..." : "Place Order"}
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate(`/restaurant/${restaurantId}/table/${tableId}/session/${sessionId}`)}
            >
              Back to Menu
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default TableCheckoutPage;
