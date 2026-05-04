import { Link } from "@tanstack/react-router";
import { Facebook, Youtube, Instagram, Users, MapPin, Mail, GraduationCap, MessageCircle, ShieldCheck } from "lucide-react";
import { useSiteSettings, useSocialLinks, buildWhatsAppLink } from "@/hooks/use-site";

const ICONS: Record<string, any> = {
  facebook_page: Facebook,
  facebook_group: Users,
  youtube: Youtube,
  instagram: Instagram,
};
const LABELS: Record<string, string> = {
  facebook_page: "Facebook Page",
  facebook_group: "Facebook Group",
  youtube: "YouTube",
  instagram: "Instagram",
};

export function Footer() {
  const { settings } = useSiteSettings();
  const socials = useSocialLinks().filter((s) => s.is_visible && s.url);
  const wa = settings.whatsapp_number?.is_visible ? settings.whatsapp_number.value : null;
  const gmail = settings.platform_gmail?.is_visible ? settings.platform_gmail.value : null;
  const address = settings.address?.is_visible ? settings.address.value : null;

  return (
    <>
      {wa && (
        <a
          href={buildWhatsAppLink(wa)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp এ যোগাযোগ"
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-glow hover:scale-110 transition-transform"
        >
          <MessageCircle className="h-7 w-7 text-white" />
        </a>
      )}

      <footer className="bg-foreground text-background pt-16 pb-6">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div>
              <Link to="/" className="flex items-center gap-2 font-bold text-2xl mb-4">
                <div className="w-9 h-9 rounded-xl gradient-hero flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-gradient">MNS Academy</span>
              </Link>
              <p className="text-sm text-background/70 leading-relaxed mb-4">
                ক্লাস ১ থেকে ১২ পর্যন্ত শিক্ষার্থীদের জন্য বিশ্বস্ত অনলাইন শিক্ষা প্ল্যাটফর্ম।
              </p>
              <div className="flex gap-2">
                {socials.map((s) => {
                  const Icon = ICONS[s.platform] || Facebook;
                  return (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={LABELS[s.platform] || s.platform}
                      className="w-9 h-9 rounded-lg bg-background/10 hover:gradient-hero hover:shadow-glow flex items-center justify-center transition-all"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">দ্রুত লিংক</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li><Link to="/" className="hover:text-primary-glow">হোম</Link></li>
                <li><Link to="/courses" className="hover:text-primary-glow">কোর্স</Link></li>
                <li><Link to="/teachers" className="hover:text-primary-glow">শিক্ষকমণ্ডলী</Link></li>
                <li><Link to="/free-classes" className="hover:text-primary-glow">ফ্রি ক্লাস</Link></li>
                <li><Link to="/exam" className="hover:text-primary-glow">পরীক্ষা</Link></li>
                <li><Link to="/notices" className="hover:text-primary-glow">নোটিশ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">তথ্য</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li><Link to="/about" className="hover:text-primary-glow">আমাদের সম্পর্কে</Link></li>
                <li><Link to="/privacy" className="hover:text-primary-glow">প্রাইভেসি পলিসি</Link></li>
                <li><Link to="/contact" className="hover:text-primary-glow">যোগাযোগ</Link></li>
                <li><Link to="/admin/login" className="hover:text-primary-glow inline-flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5" /> অ্যাডমিন লগইন</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">যোগাযোগ</h4>
              <ul className="space-y-3 text-sm text-background/70">
                {address && <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-primary-glow shrink-0" /> {address}</li>}
                {gmail && <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary-glow shrink-0" /> {gmail}</li>}
                {wa && (
                  <li className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-[#25D366] shrink-0" />
                    <a href={buildWhatsAppLink(wa)} target="_blank" rel="noopener noreferrer" className="hover:text-primary-glow">WhatsApp: {wa}</a>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-background/60">
            <p>© {new Date().getFullYear()} All rights reserved MNS Academy</p>
            <p>
              Built & developed by {" "}
              <a
                href="https://www.facebook.com/share/17ji36osLq/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#22c55e" }}
                className="font-semibold hover:underline"
              >
                TechCanvix
              </a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
