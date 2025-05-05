"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  Twitter, Github, Linkedin, MessageCircle, Heart, Users, ExternalLink,
  Sparkles, PenSquare, Frame, FileText, HelpCircle, GraduationCap, Wallet,
  FileCheck, Shield, Cookie, Mail, BookOpen
} from "lucide-react";
import { AdminLoginModal } from "./admin-login-modal";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [showAdminModal, setShowAdminModal] = useState(false);

  const socialLinks = [
    {
      icon: <Github className="h-5 w-5" />,
      url: "https://github.com/Drago-03/GroqTales.git",
      label: "GitHub",
    },
    {
      icon: <Linkedin className="h-5 w-5" />,
      url: "https://www.linkedin.com/company/indie-hub-exe/?viewAsMember=true",
      label: "LinkedIn",
    },
  ];

  return (
    <footer className="bg-gradient-to-t from-background to-background border-t">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full theme-gradient-bg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold gradient-heading">GroqTales</span>
            </div>
            <p className="text-sm text-muted-foreground">
              A Web3-enabled AI storytelling platform where creativity meets blockchain technology.
            </p>
            <p className="text-sm text-muted-foreground flex items-center">
              <span>In partnership with</span>
              <Link href="https://indie-hub-landing-page-git-main-dragos-projects-f5e4e2da.vercel.app" className="ml-1 font-medium gradient-heading flex items-center">
                Indie Hub <ExternalLink className="h-3 w-3 ml-1" />
              </Link>
            </p>
            <div className="flex space-x-4 pt-2">
              {socialLinks.map((link) => (
                <Link key={link.url} href={link.url} className="text-muted-foreground hover:text-foreground transition-colors">
                  {link.icon}
                  <span className="sr-only">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 gradient-heading">Explore</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/genres" className="text-sm hover:text-foreground transition-colors flex items-center">
                  <Sparkles className="h-4 w-4 mr-2 opacity-60" />
                  Genres
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-sm hover:text-foreground transition-colors flex items-center">
                  <Users className="h-4 w-4 mr-2 opacity-60" />
                  Community
                </Link>
              </li>
              <li>
                <Link href="/create" className="text-sm hover:text-foreground transition-colors flex items-center">
                  <PenSquare className="h-4 w-4 mr-2 opacity-60" />
                  Create Story
                </Link>
              </li>
              <li>
                <Link href="/nft-gallery" className="text-sm hover:text-foreground transition-colors flex items-center">
                  <Frame className="h-4 w-4 mr-2 opacity-60" />
                  NFT Gallery
                </Link>
              </li>
              <li>
                <Link href="/nft-marketplace" className="text-sm hover:text-foreground transition-colors flex items-center">
                  <Wallet className="h-4 w-4 mr-2 opacity-60" />
                  NFT Marketplace
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 gradient-heading">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/docs" className="text-sm hover:text-foreground transition-colors flex items-center">
                  <FileText className="h-4 w-4 mr-2 opacity-60" />
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm hover:text-foreground transition-colors flex items-center">
                  <HelpCircle className="h-4 w-4 mr-2 opacity-60" />
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 gradient-heading">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/terms" className="text-sm hover:text-foreground transition-colors flex items-center">
                  <FileCheck className="h-4 w-4 mr-2 opacity-60" />
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm hover:text-foreground transition-colors flex items-center">
                  <Shield className="h-4 w-4 mr-2 opacity-60" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-sm hover:text-foreground transition-colors flex items-center">
                  <Cookie className="h-4 w-4 mr-2 opacity-60" />
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-foreground transition-colors flex items-center">
                  <Mail className="h-4 w-4 mr-2 opacity-60" />
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} GroqTales × Monad × Indie Hub. All rights reserved.
          </p>
          <div className="flex items-center space-x-1 mt-4 md:mt-0 text-sm text-muted-foreground">
            <span>Made by Indie Hub using Groq AI and Monad blockchain technology</span>
          </div>
        </div>
      </div>
      
      <AdminLoginModal open={showAdminModal} onOpenChange={setShowAdminModal} />
    </footer>
  );
}