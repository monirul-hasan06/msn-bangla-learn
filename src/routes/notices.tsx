import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";

const notices = [
  { date: "২৫ এপ্রিল, ২০২৬", tag: "নতুন কোর্স", title: "HSC ২০২৭ ব্যাচের রেজিস্ট্রেশন শুরু", body: "আগামী ১ মে থেকে HSC ২০২৭ ব্যাচের ক্লাস শুরু হবে। আজই রেজিস্ট্রেশন করো।" },
  { date: "২০ এপ্রিল, ২০২৬", tag: "পরীক্ষা", title: "সাপ্তাহিক মডেল টেস্ট সিডিউল", body: "প্রতি শুক্রবার সকাল ১০টায় মডেল টেস্ট অনুষ্ঠিত হবে।" },
  { date: "১৫ এপ্রিল, ২০২৬", tag: "ফ্রি ক্লাস", title: "বিশেষ ফ্রি ওয়ার্কশপ", body: "গণিত অলিম্পিয়াড প্রস্তুতির জন্য বিশেষ ফ্রি ওয়ার্কশপ।" },
];

export const Route = createFileRoute("/notices")({
  head: () => ({ meta: [{ title: "নোটিশ — MSN একাডেমি" }, { name: "description", content: "MSN একাডেমির সর্বশেষ নোটিশ ও ঘোষণা।" }] }),
  component: NoticesPage,
});

function NoticesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <Badge variant="secondary" className="mb-3">নোটিশ বোর্ড</Badge>
            <h1 className="text-3xl md:text-4xl font-bold">সর্বশেষ <span className="text-gradient">নোটিশ ও ঘোষণা</span></h1>
          </div>
          <div className="space-y-4">
            {notices.map((n) => (
              <Card key={n.title} className="p-6 gradient-card border-border/50 shadow-card hover:shadow-glow transition-all">
                <div className="flex gap-4">
                  <div className="w-11 h-11 rounded-xl gradient-hero flex items-center justify-center shrink-0 shadow-soft">
                    <Bell className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs border-primary/30 text-primary">{n.tag}</Badge>
                      <span className="text-xs text-muted-foreground">{n.date}</span>
                    </div>
                    <h3 className="font-bold text-lg mb-1">{n.title}</h3>
                    <p className="text-sm text-muted-foreground">{n.body}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
