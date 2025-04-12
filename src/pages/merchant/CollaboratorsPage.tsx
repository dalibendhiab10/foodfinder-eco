
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import MerchantNav from '@/components/merchant/MerchantNav';
import { fetchMerchantProfile, getMerchantCollaborators, addCollaborator, Collaborator } from '@/services/merchantService';
import { supabase } from '@/integrations/supabase/client';

const inviteFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  view_orders: z.boolean().default(true),
  manage_products: z.boolean().default(false),
});

type InviteFormValues = z.infer<typeof inviteFormSchema>;

const CollaboratorsPage = () => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: '',
      view_orders: true,
      manage_products: false,
    },
  });

  useEffect(() => {
    const loadCollaborators = async () => {
      try {
        setIsLoading(true);
        
        // Get merchant profile
        const merchantProfile = await fetchMerchantProfile();
        if (!merchantProfile) {
          toast({
            variant: "destructive",
            title: "Merchant profile not found",
            description: "Please create a merchant profile to manage collaborators.",
          });
          return;
        }
        
        // Get collaborators
        const collaboratorsList = await getMerchantCollaborators(merchantProfile.id);
        setCollaborators(collaboratorsList);
        
      } catch (error) {
        console.error('Failed to load collaborators:', error);
        toast({
          variant: "destructive",
          title: "Failed to load collaborators",
          description: "There was a problem loading your collaborators.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCollaborators();
  }, [toast]);

  const onSubmit = async (data: InviteFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Get merchant profile
      const merchantProfile = await fetchMerchantProfile();
      if (!merchantProfile) {
        toast({
          variant: "destructive",
          title: "Merchant profile not found",
          description: "Please create a merchant profile to manage collaborators.",
        });
        return;
      }
      
      // Add collaborator
      await addCollaborator(
        merchantProfile.id, 
        data.email,
        {
          view_orders: data.view_orders,
          manage_products: data.manage_products,
        }
      );
      
      // Refresh collaborators list
      const updatedCollaborators = await getMerchantCollaborators(merchantProfile.id);
      setCollaborators(updatedCollaborators);
      
      // Reset form
      form.reset({
        email: '',
        view_orders: true,
        manage_products: false,
      });
      
      toast({
        title: "Collaborator added",
        description: `${data.email} has been added as a collaborator.`,
      });
    } catch (error) {
      console.error('Failed to add collaborator:', error);
      toast({
        variant: "destructive",
        title: "Failed to add collaborator",
        description: "There was a problem adding this collaborator.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeCollaborator = async (id: string) => {
    try {
      // Delete collaborator
      const { error } = await supabase
        .from('merchant_collaborators')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update state
      setCollaborators(collaborators.filter(c => c.id !== id));
      
      toast({
        title: "Collaborator removed",
        description: "The collaborator has been removed successfully.",
      });
    } catch (error) {
      console.error('Failed to remove collaborator:', error);
      toast({
        variant: "destructive",
        title: "Failed to remove collaborator",
        description: "There was a problem removing this collaborator.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4">
      <MerchantNav />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 my-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Manage Collaborators</CardTitle>
            <CardDescription>
              Current users who have access to your merchant account.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {isLoading ? (
              <div className="py-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eco-500"></div>
              </div>
            ) : collaborators.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  You haven't added any collaborators yet.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {collaborators.map((collaborator) => (
                    <TableRow key={collaborator.id}>
                      <TableCell>{collaborator.user_id}</TableCell>
                      <TableCell>
                        {Object.entries(collaborator.permissions)
                          .filter(([_, value]) => value)
                          .map(([key]) => (
                            <Badge key={key} className="mr-2">
                              {key.replace('_', ' ')}
                            </Badge>
                          ))
                        }
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => removeCollaborator(collaborator.id)}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Invite Collaborator</CardTitle>
            <CardDescription>
              Add a new collaborator to help manage your merchant account.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="collaborator@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="border rounded-md p-4 space-y-2">
                  <h4 className="font-medium">Permissions</h4>
                  <FormField
                    control={form.control}
                    name="view_orders"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          View orders
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="manage_products"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Manage products
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button className="w-full" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
                      Inviting...
                    </>
                  ) : (
                    'Invite Collaborator'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CollaboratorsPage;
