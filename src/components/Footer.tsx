import { Link } from "@tanstack/react-router";
import { Facebook, Youtube, Instagram, Users, MapPin, Phone, Mail, GraduationCap, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <>
      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/8801000000000"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp এ যোগাযোগ"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-glow hover:scale-110 transition-transform"
      >
        <MessageCircle className="h-7 w-7 text-white" />
      </a>

      <footer className="bg-foreground text-background pt-16 pb-6">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div>
              <Link to="/" className="flex items-center gap-2 font-bold text-2xl mb-4">
                <div className="w-9 h-9 rounded-xl gradient-hero flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-gradient">MSN</span>
              </Link>
              <p className="text-sm text-background/70 leading-relaxed mb-4">
                ক্লাস ৫ থেকে ১২ পর্যন্ত শিক্ষার্থীদের জন্য সবচেয়ে বিশ্বস্ত অনলাইন শিক্ষা প্ল্যাটফর্ম।
              </p>
              <div className="flex gap-2">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-lg bg-background/10 hover:gradient-hero hover:shadow-glow flex items-center justify-center transition-all">
                  <Facebook className="h-4 w-4" />
                </a>
                <a href="https://facebook.com/groups" target="_blank" rel="noopener noreferrer" aria-label="Facebook Group" className="w-9 h-9 rounded-lg bg-background/10 hover:gradient-hero hover:shadow-glow flex items-center justify-center transition-all">
                  <Users className="h-4 w-4" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-9 h-9 rounded-lg bg-background/10 hover:gradient-hero hover:shadow-glow flex items-center justify-center transition-all">
                  <Youtube className="h-4 w-4" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-lg bg-background/10 hover:gradient-hero hover:shadow-glow flex items-center justify-center transition-all">
                  <Instagram className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">দ্রুত লিংক</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li><Link to="/" className="hover:text-primary-glow">হোম</Link></li>
                <li><Link to="/courses" className="hover:text-primary-glow">কোর্স</Link></li>
                <li><Link to="/teachers" className="hover:text-primary-glow">শিক্ষকমণ্ডলী</Link></li>
                <li><Link to="/free-classes" className="hover:text-primary-glow">ফ্রি ক্লাস</Link></li>
                <li><Link to="/notices" className="hover:text-primary-glow">নোটিশ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">তথ্য</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li><Link to="/about" className="hover:text-primary-glow">আমাদের সম্পর্কে</Link></li>
                <li><Link to="/privacy" className="hover:text-primary-glow">প্রাইভেসি পলিসি</Link></li>
                <li><Link to="/contact" className="hover:text-primary-glow">যোগাযোগ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">যোগাযোগ</h4>
              <ul className="space-y-3 text-sm text-background/70">
                <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-primary-glow shrink-0" /> ঢাকা, বাংলাদেশ</li>
                <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary-glow" /> +৮৮০ ১XXX-XXXXXX</li>
                <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary-glow" /> info@msn.edu.bd</li>
                <li className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-[#25D366]" /> WhatsApp: +৮৮০ ১XXX-XXXXXX</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-background/60">
            <p>© {new Date().getFullYear()} All rights reserved MSN</p>
            <p>
              Made by —{" "}
              <a
                href="https://www.facebook.com/monirul.hasan06"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#22c55e" }}
                className="font-semibold hover:underline"
              >
                Monirul Hasan Mithu
              </a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
