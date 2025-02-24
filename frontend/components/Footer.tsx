import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Facebook, Twitter, Instagram, Github } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { name: 'Facebook', icon: <Facebook size={20} />, href: '#' },
    { name: 'Twitter', icon: <Twitter size={20} />, href: '#' },
    { name: 'Instagram', icon: <Instagram size={20} />, href: '#' },
    { name: 'Github', icon: <Github size={20} />, href: '#' },
  ];

  return (
    <footer className="bg-gradient-to-r from-green-700 to-green-900 shadow-lg text-white py-12 w-full">
      <div className="container px-6 mx-auto  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Logo & About */}
        <div>
          <Link href="/">
            <Image src="/logo.png" width={150} height={150} alt="logo" />
          </Link>
          <p className="mt-4 text-sm">
            Empowering farmers and buyers with a seamless marketplace for
            agricultural goods.
          </p>
          <div className="flex space-x-4 mt-4">
            {socialLinks.map(({ name, icon, href }) => (
              <Link
                key={name}
                href={href}
                title={name}
                className="p-2 bg-gray-700 rounded-full hover:bg-green-600 transition"
              >
                {icon}
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white">Quick Links</h3>
          <ul className="mt-4 space-y-3">
            {['Home', 'About Us', 'Products', 'Blog', 'Contact'].map((link) => (
              <li key={link}>
                <Link
                  href="#"
                  className="hover:text-green-500 transition duration-200"
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold text-white">Support</h3>
          <ul className="mt-4 space-y-3">
            {[
              'Help Center',
              'Shipping Info',
              'Returns Policy',
              'Terms & Conditions',
            ].map((link) => (
              <li key={link}>
                <Link
                  href="#"
                  className="hover:text-green-500 transition duration-200"
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Subscribe */}
        <div>
          <h3 className="text-lg font-semibold text-white">Subscribe</h3>
          <p className="text-sm mt-2">
            Stay updated with our latest products and offers.
          </p>
          <form className="mt-4 flex">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-2 rounded-l-md border-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-r-md hover:bg-green-700 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm">
        <p>© {new Date().getFullYear()} FarmConnect. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
