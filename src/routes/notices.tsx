import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/notices")({
  head: () => ({ meta: [{ title: "নোটিশ — MNS Academy" }, { name: "description", content: "MNS Academy এর সর্বশেষ নোটিশ ও ঘোষণা।" }] }),
  component: NoticesPage,
});

interface Notice {
  id: string;
  title: string;
  content: string;
  is_pinned: boolean;
  image_url: string | null;
  created_at: string;
}

function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("notices")
      .select("*")
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setNotices(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <Badge variant="secondary" className="mb-3">নোটিশ বোর্ড</Badge>
            <h1 className="text-3xl md:text-4xl font-bold">সর্বশেষ <span className="text-gradient">নোটিশ ও ঘোষণা</span></h1>
          </div>
          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : notices.length === 0 ? (
            <Card className="p-10 text-center text-muted-foreground">
              এখনো কোনো নোটিশ পোস্ট করা হয়নি।
              <div className="mt-4">
                <Link to="/admin"><Button variant="outline" size="sm">অ্যাডমিন থেকে পোস্ট করুন</Button></Link>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {notices.map((n) => (
                <Card key={n.id} className="p-6 gradient-card border-border/50 shadow-card hover:shadow-glow transition-all">
                  <div className="flex gap-4">
                    <div className="w-11 h-11 rounded-xl gradient-hero flex items-center justify-center shrink-0 shadow-soft">
                      <Bell className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {n.is_pinned && <Badge className="text-xs gradient-hero text-primary-foreground border-0">📌 পিন</Badge>}
                        <span className="text-xs text-muted-foreground">{new Date(n.created_at).toLocaleDateString("bn-BD")}</span>
                      </div>
                      <h3 className="font-bold text-lg mb-1">{n.title}</h3>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{n.content}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
