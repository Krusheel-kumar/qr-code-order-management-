import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#FFFDF8] pt-10 pb-24 lg:pb-10 px-6 text-center mt-6 border-t border-[#FAEDCD]">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Brand Logo */}
        <div className="mb-6">
          <img 
            src="/Brand%20Emblem.png" 
            alt="POP O'BOB Logo" 
            className="w-20 h-20 object-contain mx-auto" 
          />
        </div>

        <h2 className="font-heading font-black text-2xl lg:text-3xl tracking-tight text-[#1A0B05] mb-8">
          Connect With Us
        </h2>
        
        {/* Social Icons */}
        <div className="flex justify-center gap-5 mb-12">
          {/* Instagram */}
          <a href="#" className="w-12 h-12 rounded-full bg-white border border-[#FAEDCD] flex items-center justify-center text-[#8D6E63] hover:text-[#D4AF37] hover:border-[#D4AF37]/50 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
          {/* WhatsApp */}
          <a href="#" className="w-12 h-12 rounded-full bg-white border border-[#FAEDCD] flex items-center justify-center text-[#8D6E63] hover:text-[#D4AF37] hover:border-[#D4AF37]/50 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
          </a>
          {/* Facebook */}
          <a href="#" className="w-12 h-12 rounded-full bg-white border border-[#FAEDCD] flex items-center justify-center text-[#8D6E63] hover:text-[#D4AF37] hover:border-[#D4AF37]/50 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          </a>
          {/* LinkedIn */}
          <a href="#" className="w-12 h-12 rounded-full bg-white border border-[#FAEDCD] flex items-center justify-center text-[#8D6E63] hover:text-[#D4AF37] hover:border-[#D4AF37]/50 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          </a>
        </div>
        
        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm font-bold text-[#8D6E63] mb-8">
          <a href="#" className="hover:text-[#1A0B05] transition-colors">Our Story</a>
          <a href="#" className="hover:text-[#1A0B05] transition-colors">Locations</a>
          <a href="#" className="hover:text-[#1A0B05] transition-colors">Franchise</a>
          <a href="#" className="hover:text-[#1A0B05] transition-colors">FAQ</a>
          <a href="#" className="hover:text-[#1A0B05] transition-colors">Contact</a>
        </div>
        
        {/* Copyright */}
        <div className="flex flex-col items-center gap-2 text-xs font-medium text-[#8D6E63]/70">
          <div className="flex gap-4">
            <Link to="/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-[#1A0B05] transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms" target="_blank" rel="noopener noreferrer" className="hover:text-[#1A0B05] transition-colors">Terms of Conditions</Link>
          </div>
          <p className="mt-3 text-[10px]">© {new Date().getFullYear()} POP O'BOB. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
