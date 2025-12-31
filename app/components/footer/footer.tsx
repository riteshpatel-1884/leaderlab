"use client";

import { Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


export default function Footer() {
  return (
    <footer className="border-t border-gray-800 py-12 px-6 bg-black">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
           <Link href="/" className="block">
          <div className="mb-4 cursor-pointer">
           <div className="flex items-center gap-1">
  <Image
    src="/logo/logo.png"
    alt="Project X logo"
    width={132}
    height={132}
    className="-mr-1"
  />
  {/* <span className="text-xs px-2 py-0.5 rounded bg-purple-600 text-white">
    AI
  </span> */}
</div>

   
  </div>
</Link>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a href="/analyse-my-resume" className="hover:text-white transition-colors">
                  Analyse My Resume
                </a>
              </li>
              <li>
                <a href="/leaderboard" className="hover:text-white transition-colors">
                  Leaderboard
                </a>
              </li>
              <li>
                <a href="/dashboard" className="hover:text-white transition-colors">
                  Dashboard
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Get in Touch</h4>
            <p className="text-sm text-gray-400 mb-3">
              Have questions or suggestions?
            </p>
            <a 
              href="mailto:ritesh20047@gmail.com" 
              className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-400 transition-colors"
            >
              <Mail className="w-4 h-4" />
              ritesh20047@gmail.com
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2025 LeaderLab. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}