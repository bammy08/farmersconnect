/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { location } from '@/app/data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Building, MapPin, Phone, Edit, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  fetchSellerProfile,
  updateSellerData,
} from '@/store/slices/sellerSlice';

interface SellerFormData {
  businessName: string;
  businessAddress: string;
  phone: string;
  state: string;
  lga: string;
}

const Settings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { seller, loading, error } = useSelector(
    (state: RootState) => state.seller
  );
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, control, setValue, watch } =
    useForm<SellerFormData>();
  const selectedState = watch('state');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) dispatch(fetchSellerProfile(token));
  }, [dispatch]);

  useEffect(() => {
    if (seller) {
      Object.entries(seller).forEach(([key, value]) => {
        setValue(key as keyof SellerFormData, value);
      });

      // Explicitly setting state and lga using setValue
      if (seller.state) setValue('state', seller.state);
      if (seller.lga) setValue('lga', seller.lga);
    }
  }, [seller, setValue]);

  const onSubmit = async (data: SellerFormData) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await dispatch(updateSellerData({ token, data })).unwrap();
        toast.success('Profile updated successfully');
        setIsEditing(false);
      }
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-200">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Edit className="w-6 h-6 text-green-600" />
            Account Settings
          </h1>
          <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
            className="gap-2"
          >
            {isEditing ? (
              <X className="w-4 h-4" />
            ) : (
              <Edit className="w-4 h-4" />
            )}
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </div>

        {loading && <div className="text-center py-8">Loading...</div>}
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {seller && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Business Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Business Name
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <Input
                  {...register('businessName')}
                  className="pl-10"
                  readOnly={!isEditing}
                />
              </div>
            </div>

            {/* Business Address */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Business Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <Input
                  {...register('businessAddress')}
                  className="pl-10"
                  readOnly={!isEditing}
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <Input
                  {...register('phone')}
                  className="pl-10"
                  readOnly={!isEditing}
                />
              </div>
            </div>

            {/* Location Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* State Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  State
                </label>
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value || ''}
                      onValueChange={(val) => {
                        field.onChange(val);
                        setValue('state', val); // Ensure state is properly updated
                        setValue('lga', ''); // Reset LGA when state changes
                      }}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(location).map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* LGA Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">LGA</label>
                <Controller
                  name="lga"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select
                      value={field.value || ''}
                      onValueChange={(val) => field.onChange(val)}
                      disabled={!isEditing || !selectedState}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select LGA" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedState &&
                          location[selectedState]?.map((lga) => (
                            <SelectItem key={lga} value={lga}>
                              {lga}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            {isEditing && (
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default Settings;
