/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Building, MapPin, Phone } from 'lucide-react';
import { completeSellerProfile } from '@/services/seller/sellerService';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { location } from '@/app/data';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Validation schema
const sellerSchema = z.object({
  businessName: z
    .string()
    .min(3, 'Business Name must be at least 3 characters'),
  businessAddress: z
    .string()
    .min(5, 'Business Address must be at least 5 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  state: z.string().min(1, 'State is required'),
  lga: z.string().min(1, 'LGA is required'),
});

type SellerFormValues = z.infer<typeof sellerSchema>;

const SellerOnboarding = () => {
  const router = useRouter();
  const token = useSelector((state: any) => state.auth.token);

  useEffect(() => {
    console.log('Redux Token:', token);
    if (!token) {
      console.error('No authentication token found');
    }
  }, [token]); // Runs when `token` changes

  const form = useForm<SellerFormValues>({
    resolver: zodResolver(sellerSchema),
    defaultValues: {
      businessName: '',
      businessAddress: '',
      phone: '',
      state: '',
      lga: '',
    },
  });

  const selectedState = form.watch('state');

  const onSubmit = async (data: SellerFormValues) => {
    try {
      await completeSellerProfile(token, data);
      toast.success('Profile completed successfully!');
      router.push('/');
    } catch (error) {
      toast.error('Failed to complete profile. Please try again.');
      console.error('Submission error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Complete Your Seller Profile
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Business Name */}
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        placeholder="Enter business name"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Business Address */}
            <FormField
              control={form.control}
              name="businessAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        placeholder="Enter business address"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone Number */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        type="tel"
                        placeholder="Enter phone number"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* State Selection */}
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys(location).map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* LGA Selection */}
            {selectedState && (
              <FormField
                control={form.control}
                name="lga"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LGA</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!selectedState}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select LGA" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {location[selectedState]?.map((lga) => (
                          <SelectItem key={lga} value={lga}>
                            {lga}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
            >
              Complete Setup
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SellerOnboarding;
