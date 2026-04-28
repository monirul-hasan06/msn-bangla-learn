import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "যোগাযোগ — MSN একাডেমি" }, { name: "description", content: "MSN একাডেমির সাথে যোগাযোগ করুন।" }] }),
  component: ContactPage,
});

function ContactPage() {
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
              {[
                { icon: MapPin, title: "ঠিকানা", text: "বাড়ি #১২, রোড #৫, ধানমন্ডি, ঢাকা-১২০৫, বাংলাদেশ" },
                { icon: Phone, title: "ফোন", text: "+৮৮০ ১XXX-XXXXXX" },
                { icon: Mail, title: "ইমেইল", text: "info@msn.edu.bd" },
                { icon: MessageCircle, title: "WhatsApp", text: "+৮৮০ ১XXX-XXXXXX" },
              ].map((c) => (
                <Card key={c.title} className="p-5 flex gap-4 gradient-card border-border/50 shadow-soft">
                  <div className="w-11 h-11 rounded-xl gradient-hero flex items-center justify-center shrink-0">
                    <c.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">{c.title}</h3>
                    <p className="text-sm text-muted-foreground">{c.text}</p>
                  </div>
                </Card>
              ))}
            </div>
            <Card className="p-6 gradient-card border-border/50 shadow-card">
              <h2 className="text-xl font-bold mb-4">মেসেজ পাঠান</h2>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="name">আপনার নাম</Label>
                  <Input id="name" placeholder="পূর্ণ নাম লিখুন" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="email">ইমেইল</Label>
                  <Input id="email" type="email" placeholder="email@example.com" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="msg">বার্তা</Label>
                  <Textarea id="msg" placeholder="আপনার বার্তা লিখুন..." rows={5} className="mt-1.5" />
                </div>
                <Button type="submit" className="w-full gradient-hero text-primary-foreground border-0 shadow-soft hover:shadow-glow transition-all">
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
