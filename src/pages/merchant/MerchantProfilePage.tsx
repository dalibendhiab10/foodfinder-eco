
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, Phone, MapPin, Image } from 'lucide-react';
import { MerchantProfile, createMerchantProfile, fetchMerchantProfile, updateMerchantProfile } from '@/services/merchantService';
import { useAuth } from '@/contexts/AuthContext';
import MerchantNav from '@/components/merchant/MerchantNav';

const profileFormSchema = z.object({
  business_name: z.string().min(2, {
    message: "Business name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  logo_url: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const MerchantProfilePage = () => {
  const [profile, setProfile] = useState<MerchantProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      business_name: '',
      description: '',
      address: '',
      phone: '',
      logo_url: '',
    },
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const merchantProfile = await fetchMerchantProfile();
        
        if (merchantProfile) {
          setProfile(merchantProfile);
          form.reset({
            business_name: merchantProfile.business_name || '',
            description: merchantProfile.description || '',
            address: merchantProfile.address || '',
            phone: merchantProfile.phone || '',
            logo_url: merchantProfile.logo_url || '',
          });
        }
      } catch (error) {
        console.error('Failed to load merchant profile:', error);
        toast({
          variant: "destructive",
          title: "Failed to load profile",
          description: "There was a problem loading your merchant profile.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user, form, toast]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      
      if (profile) {
        // Update existing profile
        const updatedProfile = await updateMerchantProfile(profile.id, data);
        setProfile(updatedProfile);
        toast({
          title: "Profile updated",
          description: "Your merchant profile has been updated successfully.",
        });
      } else {
        // Create new profile
        const newProfile = await createMerchantProfile(data);
        setProfile(newProfile);
        toast({
          title: "Profile created",
          description: "Your merchant profile has been created successfully.",
        });
        // Redirect to merchant dashboard
        navigate('/merchant/dashboard');
      }
    } catch (error) {
      console.error('Failed to save merchant profile:', error);
      toast({
        variant: "destructive",
        title: "Failed to save",
        description: "There was a problem saving your merchant profile.",
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
      {profile && <MerchantNav />}
      
      <Card className="max-w-2xl mx-auto my-8">
        <CardHeader>
          <CardTitle>{profile ? 'Edit Merchant Profile' : 'Create Merchant Profile'}</CardTitle>
          <CardDescription>
            {profile 
              ? 'Update your business information to display to customers.' 
              : 'Get started as a merchant by creating your business profile.'}
          </CardDescription>
        </CardHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="business_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Store className="h-4 w-4 mr-2" />
                      Business Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Your Business Name" {...field} />
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
                    <FormLabel>Business Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your business..." 
                        className="min-h-[100px]" 
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        Address
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Business Address" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Phone Number" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="logo_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Image className="h-4 w-4 mr-2" />
                      Logo URL
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/your-logo.png" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(profile ? '/merchant/dashboard' : '/home')}
              >
                {profile ? 'Cancel' : 'Back'}
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
                    Saving...
                  </>
                ) : (
                  profile ? 'Update Profile' : 'Create Profile'
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default MerchantProfilePage;
