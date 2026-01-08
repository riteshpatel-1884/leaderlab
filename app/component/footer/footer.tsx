'use client';

import Link from "next/link";
import { Twitter, Github, Linkedin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border-subtle bg-surface overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-primary/5 to-transparent opacity-50" />

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div>
            <h2 className="font-bold text-2xl tracking-tight mb-4">
              Leader<span className="text-brand-primary">Lab.</span>
            </h2>

            <p className="text-text-secondary text-sm leading-relaxed mb-6">
              We judge what you explain, not what you recognize.
              Knowing the answer in your head means nothing if you can’t explain it out loud when it matters.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href="https://X.com/leaderlabdotin"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="w-9 h-9 rounded-full border border-border-subtle
                  flex items-center justify-center text-text-secondary
                  hover:text-brand-primary hover:border-brand-primary/40 transition"
              >
                <Twitter className="w-4 h-4" />
              </a>

              <a
                href="https://github.com/riteshpatel-1884"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 rounded-full border border-border-subtle
                  flex items-center justify-center text-text-secondary
                  hover:text-brand-primary hover:border-brand-primary/40 transition"
              >
                <Github className="w-4 h-4" />
              </a>

              <a
                href="https://linkedin.com/company/riteshpatel1884"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full border border-border-subtle
                  flex items-center justify-center text-text-secondary
                  hover:text-brand-primary hover:border-brand-primary/40 transition"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product */}
          <FooterColumn
            title="Product"
            links={[
              { label: "Features", href: "#features" },
              { label: "Pricing", href: "/pricing" },
              
            ]}
          />

          {/* Resources */}
          <FooterColumn
            title="Resources"
            links={[
              { label: "SQL", href: "/subjects/sql" },
              { label: "OOOPs", href: "#" },
              { label: "OS", href: "#" },
              { label: "DSA", href: "#" },

            ]}
          />

          {/* Company */}
          <FooterColumn
            title="Company"
            links={[
              { label: "About", href: "/about" },
              { label: "Careers", href: "/careers" },
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
            ]}
          />
        </div>

        {/* Newsletter */}
        {/* <div className="border-t border-border-subtle pt-8 mb-8">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="font-bold text-lg mb-2">Stay Updated</h3>
            <p className="text-text-secondary text-sm mb-4">
              Get notified when we add new subjects and features.
            </p>

            <div className="flex gap-2">
              <input
                type="email"
                placeholder="you@example.com"
                className="flex-1 px-4 py-3 bg-bg-secondary border border-border-subtle rounded-xl text-sm
                  focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
              />
              <button className="px-6 py-3 bg-brand-primary text-white rounded-xl font-semibold text-sm">
                Subscribe
              </button>
            </div>
          </div>
        </div> */}

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-border-subtle">
          <p className="text-text-secondary text-sm">
            © {currentYear} LeaderLab. Built to expose weakness before interviews do.
          </p>
          <p className="text-text-secondary text-sm">
            Made with ❤️ in India
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="font-bold text-text-primary mb-4">{title}</h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-text-secondary hover:text-brand-primary text-sm transition"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
