'use client';

import { Bell, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Navbar() {
  return (
    <header className="flex items-center justify-between bg-white dark:bg-gray-800 shadow p-4">
      {/* Search Bar */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-3 text-gray-500 dark:text-gray-400" />
        <Input
          type="text"
          placeholder="Search..."
          className="pl-10 border-gray-300 dark:border-gray-700 dark:bg-gray-900"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </Button>
        <Button variant="ghost" size="icon">
          <User className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </Button>
      </div>
    </header>
  );
}
