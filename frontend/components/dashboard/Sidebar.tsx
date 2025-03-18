/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import {
  Home,
  ShoppingCart,
  Users,
  Settings,
  Menu,
  LogOut,
  ChevronLeft,
  ChartColumnStacked,
  MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { cn } from '@/lib/utils';
import { logout } from '@/store/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import Image from 'next/image';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  // Get user role from Redux
  const { user } = useSelector((state: RootState) => state.auth);
  const role = (user?.role as 'admin' | 'seller' | 'user') || 'user'; // Explicitly type role

  // Define Sidebar Items Based on Role
  const navItems = {
    admin: [
      { href: '/dashboard/admin', icon: Home, label: 'Dashboard' },
      { href: '/dashboard/admin/users', icon: Users, label: 'Users' },
      {
        href: '/dashboard/admin/category',
        icon: ChartColumnStacked,
        label: 'Categories',
      },
      {
        href: '/dashboard/admin/product',
        icon: ShoppingCart,
        label: 'Products',
      },
      { href: '/dashboard/admin/settings', icon: Settings, label: 'Settings' },
    ],
    seller: [
      { href: '/dashboard/seller', icon: Home, label: 'Dashboard' },
      { href: '/dashboard/seller/orders', icon: ShoppingCart, label: 'Orders' },
      {
        href: '/dashboard/seller/product',
        icon: ShoppingCart,
        label: 'Products',
      },
      { href: '/dashboard/seller/customers', icon: Users, label: 'Customers' },
      {
        href: '/dashboard/seller/messages',
        icon: MessageCircle,
        label: 'Messages',
      },
      { href: '/dashboard/seller/settings', icon: Settings, label: 'Settings' },
    ],
    user: [
      { href: '/dashboard/user', icon: Home, label: 'Dashboard' },
      { href: '/dashboard/user/orders', icon: ShoppingCart, label: 'Orders' },
      { href: '/dashboard/user/settings', icon: Settings, label: 'Settings' },
    ],
  };

  const currentNavItems = navItems[role]; // Default to user if role is missing

  // Logout Handler
  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  return (
    <TooltipProvider>
      <aside
        className={cn(
          'sticky top-0 h-screen bg-background border-r flex flex-col transition-all duration-300',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Header Section */}
        <div className="flex items-center justify-between p-4 border-b">
          {!collapsed && (
            <Link href="/">
              <Image src={'/logo.png'} width={150} height={150} alt="logo" />
            </Link>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-lg"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <Menu className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 flex flex-col gap-1 p-2">
          {currentNavItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href;
            return (
              <Tooltip key={href} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link href={href}>
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      className={cn(
                        'w-full justify-start gap-3 rounded-lg h-10',
                        !collapsed ? 'px-4' : 'px-2',
                        isActive && 'bg-lime-300 text-gray-600'
                      )}
                    >
                      <Icon className="h-4 w-4 -mt-1" />
                      {!collapsed && label}
                    </Button>
                  </Link>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">{label}</TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </nav>

        {/* Logout Button (Pinned to Bottom) */}
        <div className="p-2 border-t">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                onClick={handleLogout}
                className={cn(
                  'w-full justify-start gap-3 rounded-lg h-10 bg-red-600 hover:bg-red-500',
                  !collapsed ? 'px-4' : 'px-2'
                )}
              >
                <LogOut className="h-4 w-4" />
                {!collapsed && 'Logout'}
              </Button>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right">Logout</TooltipContent>}
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
}
