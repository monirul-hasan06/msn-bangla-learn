import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Mail, MessageCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSiteSettings, buildWhatsAppLink } from "@/hooks/use-site";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [
    { title: "যোগাযোগ — MNS Academy" },
    { name: "description", content: "MNS Academy এর সাথে যোগাযোগ করুন।" },
  ]}),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "নাম দিন").max(100),
  email: z.string().trim().email("সঠিক ইমেইল দিন").max(255),
  message: z.string().trim().min(1, "মেসেজ লিখুন").max(2000),
});

function ContactPage() {
  const { settings } = useSiteSettings();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const wa = settings.whatsapp_number?.is_visible ? settings.whatsapp_number.value : null;
  const gmail = settings.platform_gmail?.is_visible ? settings.platform_gmail.value : null;
  const address = settings.address?.is_visible ? settings.address.value : null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) return toast.error(r.error.errors[0].message);
    setLoading(true);
    const { error } = await supabase.from("messages").insert(r.data);
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("আপনার মেসেজ পাঠানো হয়েছে। ধন্যবাদ!");
    setForm({ name: "", email: "", message: "" });
  };

  const cards = [
    address && { icon: MapPin, title: "ঠিকানা", text: address },
    gmail && { icon: Mail, title: "ইমেইল", text: gmail },
    wa && { icon: MessageCircle, title: "WhatsApp", text: wa, href: buildWhatsAppLink(wa) },
  ].filter(Boolean) as any[];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">আমাদের সাথে <span className="text-gradient">যোগাযোগ করুন</span></h1>
            <p className="text-muted-foreground">যেকোনো প্রশ্ন বা পরামর্শ আমাদের জানান</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {cards.map((c) => (
                <Card key={c.title} className="p-5 flex gap-4 gradient-card border-border/50 shadow-soft">
                  <div className="w-11 h-11 rounded-xl gradient-hero flex items-center justify-center shrink-0">
                    <c.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold mb-1">{c.title}</h3>
                    {c.href ? <a href={c.href} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary break-all">{c.text}</a>
                      : <p className="text-sm text-muted-foreground break-words">{c.text}</p>}
                  </div>
                </Card>
              ))}
            </div>
            <Card className="p-6 gradient-card border-border/50 shadow-card">
              <h2 className="text-xl font-bold mb-4">বাংলা বার্তা পাঠান</h2>
              <form className="space-y-4" onSubmit={submit}>
                <div>
                  <Label htmlFor="name">আপনার নাম</Label>
                  <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="পূর্ণ নাম" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="email">ইমেইল</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="msg">বার্তা</Label>
                  <Textarea id="msg" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="আপনার বার্তা লিখুন..." rows={5} className="mt-1.5" />
                </div>
                <Button type="submit" disabled={loading} className="w-full gradient-hero text-primary-foreground border-0 shadow-soft hover:shadow-glow transition-all">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  পাঠিয়ে দিন
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
