"use client";

import { Bell, Search } from "lucide-react";

interface TopBarProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export default function TopBar({ user }: TopBarProps) {
  return (
    <header className="bg-base-100 border-b border-base-300 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
            <input
              type="search"
              placeholder="Rechercher..."
              className="input input-bordered w-full pl-10"
            />
          </div>
        </div>

        {/* Notifications */}
        <div className="flex items-center gap-4">
          <button className="btn btn-ghost btn-circle relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
