import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin } from 'lucide-react';
import Select, { components } from 'react-select';
import Image from 'next/image';

export default function Hero() {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState({
    label: 'All Nigeria',
    value: 'all',
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search:', search, 'Location:', location);
  };

  // Custom SingleValue to display MapPin on the left inside the select
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SingleValue = (props: any) => (
    <components.SingleValue {...props}>
      <div className="flex items-center gap-2">
        <MapPin className="w-5 h-5 text-gray-500" />
        {props.data.label}
      </div>
    </components.SingleValue>
  );

  return (
    <section className="relative w-full h-[400px] md:h-[500px] flex flex-col items-center justify-center text-center p-6 overflow-hidden">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/50 z-0" />

      {/* Background Image */}
      <Image
        width={450}
        height={450}
        src="/hero.jpg"
        alt="Marketplace background"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl w-full px-4">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
          Discover Fresh Produce &<br />
          <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-white">
            Local Goods Near You
          </span>
        </h1>

        {/* Search Container */}
        <form
          onSubmit={handleSearch}
          className="group w-full bg-white/20 backdrop-blur-lg rounded-xl p-1 shadow-2xl transition-all duration-300 hover:bg-white/30"
        >
          <div className="flex flex-col md:flex-row gap-2 w-full">
            {/* Location Dropdown */}
            <div className="w-full md:w-[240px] relative">
              <Select
                options={[
                  { label: 'All Nigeria', value: 'all' },
                  { label: 'Lagos', value: 'lagos' },
                  { label: 'Abuja', value: 'abuja' },
                  { label: 'Port Harcourt', value: 'ph' },
                ]}
                value={location}
                onChange={(val) => setLocation(val!)}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Select location"
                components={{ SingleValue }} // Use custom component
                styles={{
                  control: (base) => ({
                    ...base,
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    boxShadow: 'none',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
                  }),
                  menu: (base) => ({
                    ...base,
                    borderRadius: '8px',
                    marginTop: '4px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }),
                }}
              />
            </div>

            {/* Search Input */}
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Search for fresh produce, meats, dairy..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/70 border-none h-[50px] rounded-lg pl-12 pr-4 text-gray-800 placeholder-gray-500 focus:bg-white/90 focus:ring-2 focus:ring-green-400"
              />
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
            </div>

            {/* Search Button */}
            <Button
              type="submit"
              className="h-[50px] bg-gradient-to-r from-green-500 to-lime-400 text-white hover:from-green-600 hover:to-lime-600 transition-all rounded-lg px-8 font-semibold shadow-lg hover:shadow-xl"
            >
              <Search className="w-5 h-5 mr-2" />
              <span className="hidden md:inline">Search</span>
            </Button>
          </div>
        </form>

        {/* Popular Searches */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <span className="text-sm text-white/80">Popular:</span>
          {[
            'Organic Vegetables',
            'Fresh Fish',
            'Local Fruits',
            'Farm Eggs',
          ].map((tag) => (
            <Button
              key={tag}
              variant="ghost"
              className="text-white/90 hover:text-white hover:bg-white/20 px-3 py-1 rounded-full text-sm"
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
