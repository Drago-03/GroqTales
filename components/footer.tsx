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

  return (
    <footer className="border-t py-6 px-4 md:px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="font-bold text-xl">GroqTales</div>
          <p className="text-muted-foreground text-sm text-center md:text-left max-w-md">
            AI-powered story generation and NFT minting platform built for creators.
          </p>
        </div>

        <div className="flex gap-6 flex-wrap justify-center md:justify-end">
          <Link
            href="https://github.com/Drago-03/GroqTales.git"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="GitHub"
          >
            <Github className="h-5 w-5" />
          </Link>
          <Link
            href="https://www.linkedin.com/company/indie-hub-exe/?viewAsMember=true"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-5 w-5" />
          </Link>
          <Link
            href="mailto:contact@groqtales.com"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Email"
          >
            <Mail className="h-5 w-5" />
          </Link>
        </div>
      </div>
      
      <AdminLoginModal open={showAdminModal} onOpenChange={setShowAdminModal} />
    </footer>
  );
}