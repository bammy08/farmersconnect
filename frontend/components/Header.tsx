'use client';

import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Menu,
  User,
  Plus,
  LogOut,
  Settings,
  MessageSquare,
  LayoutDashboard,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { RootState } from '@/store/store';
import { logout } from '@/store/slices/authSlice';
import Notifications from './Notification';

export default function Header() {
  const router = useRouter();
  const dispatch = useDispatch();

  // 🔍 Get authentication state from Redux
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const role = user?.role || '';
  // 🏞️ Example Profile Image (Replace with real user image from backend)
  const userProfileImg = '/profile.png';

  const firstName = user?.name?.split(' ')[0] || '';

  // 📌 State for dropdown menu
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 🔐 Handle Logout
  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  return (
    <header className="w-full bg-gradient-to-r from-green-700 to-green-900 shadow-lg z-[60] sticky top-0">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Left: Logo & Mobile Menu */}
        <div className="flex items-center justify-between w-full">
          {/* Logo on the Left */}
          <Link href="/">
            <Image src={'/logo.png'} width={150} height={150} alt="logo" />
          </Link>

          {/* Mobile Menu Icon on the Right */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-white hover:bg-green-800"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-green-800 text-white">
              <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
              <nav className="flex flex-col gap-2 mt-20">
                {isAuthenticated ? (
                  <>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white hover:bg-green-700"
                      onClick={() =>
                        router.push(
                          role === 'seller'
                            ? '/dashboard/seller'
                            : '/dashboard/user'
                        )
                      }
                    >
                      <LayoutDashboard className="w-5 h-5 mr-2" />
                      Dashboard
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white hover:bg-green-700"
                      onClick={() => router.push('/messages')}
                    >
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Messages
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white hover:bg-green-700"
                      onClick={() => router.push('/settings')}
                    >
                      <Settings className="w-5 h-5 mr-2" />
                      Settings
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white hover:bg-red-600"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-5 h-5 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-white hover:bg-green-700"
                    onClick={() => router.push('/login')}
                  >
                    <User className="w-5 h-5 mr-2" />
                    Login / Register
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Right: User & Cart (Desktop) */}
        <div className="hidden md:flex items-center gap-6">
          {isAuthenticated && <Notifications />}

          {isAuthenticated ? (
            // 🔹 User Profile Dropdown
            <div className="relative">
              <button
                className="flex items-center gap-2 text-white hover:bg-green-800 p-2 rounded-lg"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <Image
                  src={userProfileImg}
                  width={60}
                  height={60}
                  alt="Profile"
                  className="rounded-full border border-white"
                />
                {/* <span className="text-lg font-semibold">
                  {role === 'seller' ? 'Seller' : 'User'}
                </span> */}
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg">
                  {/* 👋 Greeting Message */}
                  <div className="px-4 py-2 text-gray-700 font-semibold">
                    Hello, {firstName}!
                  </div>

                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-800 hover:bg-gray-100"
                    onClick={() =>
                      router.push(
                        role === 'seller'
                          ? '/dashboard/seller'
                          : '/dashboard/user'
                      )
                    }
                  >
                    <LayoutDashboard className="w-5 h-5 mr-2" />
                    Dashboard
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-800 hover:bg-gray-100"
                    onClick={() => router.push('/messages')}
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Messages
                  </Button>
                  {role === 'seller' && (
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-800 hover:bg-gray-100"
                      onClick={() => router.push('/seller/my-adverts')}
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      My Adverts
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-800 hover:bg-gray-100"
                    onClick={() => router.push('/settings')}
                  >
                    <Settings className="w-5 h-5 mr-2" />
                    Settings
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:bg-red-100"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          ) : (
            // 🔹 Sign In Button for Guests
            <Button
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white text-lg font-semibold px-5 py-3"
              onClick={() => router.push('/login')}
            >
              <User className="w-8 h-8 mr-1 font-bold" />
              Sign In
            </Button>
          )}

          {/* Sell Button */}
          <Button
            className="bg-orange-400 hover:bg-orange-500 text-white text-lg font-bold px-6 py-3"
            onClick={() =>
              router.push(
                isAuthenticated && role === 'seller'
                  ? '/sell/create'
                  : '/register/seller'
              )
            }
          >
            <Plus className="w-8 h-8 mr-1 font-bold" />
            Sell
          </Button>
        </div>
      </div>
    </header>
  );
}
