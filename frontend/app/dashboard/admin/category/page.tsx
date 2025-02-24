'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/store/slices/categorySlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash, Pencil, Plus } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import axios from 'axios';
import Image from 'next/image';

export default function CategoriesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading, error } = useSelector(
    (state: RootState) => state.category
  );
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<{
    id: string;
    name: string;
    image: string;
  } | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCategoryImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'cvclmwy8');

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dxgmvrk99/image/upload',
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error('Image upload failed:', error);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!categoryName.trim() || !token) return;

    try {
      let imageUrl = editingCategory?.image || '';
      if (categoryImage) {
        const uploadedImageUrl = await uploadImage(categoryImage);
        if (!uploadedImageUrl) return;
        imageUrl = uploadedImageUrl;
      }

      const categoryData = new FormData();
      categoryData.append('name', categoryName);
      categoryData.append('image', imageUrl);

      if (editingCategory) {
        await dispatch(
          updateCategory({ id: editingCategory.id, categoryData, token })
        );
      } else {
        await dispatch(createCategory({ categoryData, token }));
      }

      resetForm();
      setOpenDialog(false);
    } catch (err) {
      console.error('Operation failed:', err);
    }
  };

  const resetForm = () => {
    setCategoryName('');
    setCategoryImage(null);
    setPreviewImage(null);
    setEditingCategory(null);
  };

  const handleEdit = (category: {
    _id: string;
    name: string;
    image?: string;
  }) => {
    setEditingCategory({
      id: category._id,
      name: category.name,
      image: category.image || '',
    });
    setCategoryName(category.name);
    setPreviewImage(category.image || '');
    setOpenDialog(true);
  };

  const handleDelete = async () => {
    if (token && deletingCategory) {
      try {
        await dispatch(deleteCategory({ id: deletingCategory, token }));
        setDeletingCategory(null);
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Create Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
              <div className="space-y-2">
                <label className="text-sm font-medium">Category Image</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {previewImage && (
                  <Image
                    width={200}
                    height={200}
                    src={previewImage}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-md mt-2"
                  />
                )}
              </div>
              <Button
                onClick={handleSubmit}
                disabled={!categoryName.trim()}
                className="w-full"
              >
                {editingCategory ? 'Update' : 'Create'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-[150px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-12 w-12 rounded-md" />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <TableRow key={category._id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>
                    {category.image && (
                      <Image
                        width={48}
                        height={48}
                        src={category.image}
                        alt={category.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(category)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeletingCategory(category._id)}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the {category.name} category.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No categories found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
