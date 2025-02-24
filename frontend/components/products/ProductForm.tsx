/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '@/store/slices/categorySlice';
import { createProduct, updateProduct } from '@/store/slices/productSlice';
import { AppDispatch, RootState } from '@/store/store';
import { location } from '@/app/data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { fetchSellerProfile } from '@/store/slices/sellerSlice';
import Image from 'next/image';

interface BulkPricing {
  minQuantity: number;
  price: string;
}

interface ProductFormValues {
  name: string;
  description: string;
  price: string;
  quantity: string;
  category: string;
  state: string;
  lga: string;
  bulkPricing: BulkPricing[];
  images: File[];
}

interface ProductFormProps {
  existingProduct?: any;
  token: string;
  onSuccess?: () => void;
}

const BULK_PRICING_OPTIONS = [5, 10, 15, 20, 30, 40, 50];

const ProductForm: React.FC<ProductFormProps> = ({
  existingProduct,
  token,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ProductFormValues>({
    defaultValues: existingProduct || {
      name: '',
      description: '',
      price: '',
      quantity: '',
      category: '',
      state: '',
      lga: '',
      bulkPricing: [{ minQuantity: 5, price: '' }],
      images: [],
    },
    mode: 'onTouched',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'bulkPricing',
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  // Track images that should remain
  const [existingImagePreviews, setExistingImagePreviews] = useState<string[]>(
    existingProduct?.images || []
  );
  // Track images that should be deleted
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const { categories } = useSelector((state: RootState) => state.category);
  const { seller, loading, error } = useSelector(
    (state: RootState) => state.seller
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (existingProduct?.category?._id) {
      setValue('category', existingProduct.category._id);
    }
  }, [existingProduct, setValue]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) dispatch(fetchSellerProfile(token));
  }, [dispatch]);

  useEffect(() => {
    if (seller) {
      setValue('state', seller.state);
      setValue('lga', seller.lga);
    }
  }, [seller, setValue]);

  useEffect(() => {
    if (existingProduct?.images?.length) {
      setImagePreviews(existingProduct.images); // Assuming existing images are URLs
    }
  }, [existingProduct]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files);

      // Generate preview URLs only for newly uploaded images
      const previews = newImages.map((file) => URL.createObjectURL(file));

      setSelectedImages((prev) => [...prev, ...newImages]);
      setImagePreviews((prev) => [...prev, ...previews]);
    }
  };

  // Remove an existing image (from the database)
  const removeExistingImage = (index: number) => {
    setExistingImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove a newly uploaded image
  const removeNewImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const priceValue = watch('price');

  const onSubmit = async (data: ProductFormValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'bulkPricing') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value as string);
      }
    });

    // Append selected images (new uploads)
    selectedImages.forEach((image) => formData.append('images', image));

    // Append only the remaining existing images (excluding removed ones)
    const remainingExistingImages = existingImagePreviews.filter(
      (img) => !removedImages.includes(img)
    );
    formData.append('existingImages', JSON.stringify(remainingExistingImages));

    try {
      if (existingProduct) {
        await dispatch(
          updateProduct({
            productId: existingProduct._id,
            updatedData: formData,
            token,
          })
        );
      } else {
        await dispatch(createProduct({ productData: formData, token }));
      }

      toast.success(
        existingProduct
          ? 'Product updated successfully!'
          : 'Product created successfully!'
      );

      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      console.error(error);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {existingProduct ? 'Edit Product' : 'Create New Product'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Product Name
            </label>
            <Input
              {...register('name', { required: 'Product name is required' })}
              placeholder="Product Name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">
                {String(errors.name.message)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <Textarea
              {...register('description', {
                required: 'Description is required',
              })}
              placeholder="Description"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {String(errors.description.message)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <Select
              defaultValue={existingProduct?.category?._id || ''}
              onValueChange={(value) => setValue('category', value)} // Update form state
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <Input
              type="number"
              {...register('price', { required: 'Price is required' })}
              placeholder="Price"
            />
            {errors.price && (
              <p className="text-red-500 text-sm">
                {String(errors.price.message)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Product Quantity
            </label>
            <Input
              type="number"
              {...register('quantity', { required: 'Quantity is required' })}
              placeholder="Quantity"
            />
            {errors.quantity && (
              <p className="text-red-500 text-sm">
                {String(errors.quantity.message)}
              </p>
            )}
          </div>

          {/* Bulk Pricing Section */}
          <div>
            <label className="block text-sm font-medium mb-1">Bulk Price</label>

            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-center">
                {/* Min Quantity Input */}
                <label className="font-medium">
                  Min Qty:{' '}
                  <Input
                    type="number"
                    {...register(`bulkPricing.${index}.minQuantity`)}
                    defaultValue={
                      existingProduct?.bulkPricing?.[index]?.minQuantity || ''
                    }
                    className="w-20"
                  />
                </label>

                {/* Price Input */}
                <label className="font-medium">
                  Price:{' '}
                  <Input
                    type="number"
                    {...register(`bulkPricing.${index}.price`)}
                    defaultValue={
                      existingProduct?.bulkPricing?.[index]?.price || ''
                    }
                    className="w-24"
                  />
                </label>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}

            <Button
              type="button"
              onClick={() => append({ minQuantity: 5, price: '' })}
              className="mt-2"
            >
              + Add Bulk Pricing
            </Button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <Input
              {...register('state')}
              value={watch('state')}
              disabled
              className="bg-gray-200 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">LGA</label>
            <Input
              {...register('lga')}
              value={watch('lga')}
              disabled
              className="bg-gray-200 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Images</label>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />

            {/* Display Existing Images */}
            {existingImagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {existingImagePreviews.map((src, index) => (
                  <div
                    key={`existing-${index}`}
                    className="relative w-24 h-24 border rounded overflow-hidden"
                  >
                    <Image
                      width={100}
                      height={100}
                      src={src}
                      alt={`Existing ${index}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Display Only New Image Previews */}
            {/* {imagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {imagePreviews.map((src, index) => (
                  <div
                    key={`new-${index}`}
                    className="relative w-24 h-24 border rounded overflow-hidden"
                  >
                    <Image
                      width={100}
                      height={100}
                      src={src}
                      alt={`Preview ${index}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )} */}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting
              ? 'Processing...'
              : existingProduct
              ? 'Update Product'
              : 'Create Product'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;
