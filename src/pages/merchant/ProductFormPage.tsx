
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import MerchantNav from '@/components/merchant/MerchantNav';
import { supabase } from '@/integrations/supabase/client';
import { fetchMerchantProfile } from '@/services/merchantService';
import { getFoodItemById } from '@/services/foodService';

const productFormSchema = z.object({
  title: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  original_price: z.coerce.number().positive({
    message: "Price must be a positive number.",
  }),
  discounted_price: z.coerce.number().nonnegative({
    message: "Discounted price must be zero or positive.",
  }),
  quantity: z.coerce.number().int().positive({
    message: "Quantity must be a positive number.",
  }),
  image_url: z.string().url().optional().or(z.literal('')),
  is_flash_deal: z.boolean().default(false),
  tags: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

const ProductFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: '',
      description: '',
      original_price: 0,
      discounted_price: 0,
      quantity: 1,
      image_url: '',
      is_flash_deal: false,
      tags: '',
    },
  });

  useEffect(() => {
    const initializeForm = async () => {
      try {
        setIsLoading(true);
        
        // Check if user has merchant profile
        const merchantProfile = await fetchMerchantProfile();
        if (!merchantProfile) {
          toast({
            variant: "destructive",
            title: "Merchant profile not found",
            description: "Please create a merchant profile to manage products.",
          });
          navigate('/merchant/profile');
          return;
        }
        
        // If in edit mode, load existing product
        if (isEditMode && id) {
          const product = await getFoodItemById(id);
          
          if (!product) {
            toast({
              variant: "destructive",
              title: "Product not found",
              description: "The product you are trying to edit does not exist.",
            });
            navigate('/merchant/dashboard');
            return;
          }
          
          // Check if user is owner of this product
          if (product.restaurant_id !== merchantProfile.id) {
            toast({
              variant: "destructive",
              title: "Unauthorized",
              description: "You do not have permission to edit this product.",
            });
            navigate('/merchant/dashboard');
            return;
          }
          
          form.reset({
            title: product.title,
            description: product.description,
            original_price: product.original_price,
            discounted_price: product.discounted_price,
            quantity: product.quantity,
            image_url: product.image_url || '',
            is_flash_deal: product.is_flash_deal || false,
            tags: product.tags ? product.tags.join(', ') : '',
          });
        }
      } catch (error) {
        console.error('Failed to initialize product form:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "There was a problem loading the product data.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeForm();
  }, [id, isEditMode, navigate, toast, form]);

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setIsSaving(true);
      
      const merchantProfile = await fetchMerchantProfile();
      if (!merchantProfile) {
        toast({
          variant: "destructive",
          title: "Merchant profile not found",
          description: "Please create a merchant profile to manage products.",
        });
        navigate('/merchant/profile');
        return;
      }
      
      // Parse tags
      const parsedTags = data.tags 
        ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];
      
      // Updated product data: use merchant_id for both restaurant_id and merchant_id fields
      // This fixes the foreign key constraint violation
      const productData = {
        title: data.title,
        description: data.description,
        original_price: data.original_price,
        discounted_price: data.discounted_price,
        quantity: data.quantity,
        image_url: data.image_url || null,
        is_flash_deal: data.is_flash_deal,
        tags: parsedTags,
        restaurant_id: merchantProfile.id,
        merchant_id: merchantProfile.id
      };
      
      console.log("Saving product with data:", productData);
      
      if (isEditMode && id) {
        // Update existing product
        const { error } = await supabase
          .from('food_items')
          .update(productData)
          .eq('id', id);
          
        if (error) throw error;
        
        toast({
          title: "Product updated",
          description: "Your product has been updated successfully.",
        });
      } else {
        // Create new product
        const { error } = await supabase
          .from('food_items')
          .insert(productData);
          
        if (error) throw error;
        
        toast({
          title: "Product created",
          description: "Your product has been created successfully.",
        });
      }
      
      navigate('/merchant/dashboard');
    } catch (error) {
      console.error('Failed to save product:', error);
      toast({
        variant: "destructive",
        title: "Failed to save",
        description: "There was a problem saving your product.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eco-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <MerchantNav />
      
      <Card className="max-w-2xl mx-auto my-8">
        <CardHeader>
          <CardTitle>{isEditMode ? 'Edit Product' : 'Add New Product'}</CardTitle>
          <CardDescription>
            {isEditMode 
              ? 'Update your product information.' 
              : 'Add a new product to your inventory.'}
          </CardDescription>
        </CardHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Product Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your product..." 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="original_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Original Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="discounted_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discounted Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (comma separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="organic, vegan, gluten-free" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="is_flash_deal"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Flash Deal</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Mark this product as a flash deal.
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/merchant/dashboard')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
                    Saving...
                  </>
                ) : (
                  isEditMode ? 'Update Product' : 'Create Product'
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default ProductFormPage;
