import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/exam")({
  head: () => ({ meta: [
    { title: "পরীক্ষা — MNS Academy" },
    { name: "description", content: "MNS Academy এর সকল চলমান ও আসন্ন পরীক্ষার লিংক।" },
  ]}),
  component: ExamPage,
});

interface Exam { id: string; title: string; description: string | null; url: string; image_url: string | null; publish_date: string; }

function ExamPage() {
  const [list, setList] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.from("exam_links").select("*").eq("is_visible", true).order("publish_date", { ascending: false })
      .then(({ data }) => { setList((data as any) || []); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <Badge variant="secondary" className="mb-3">পরীক্ষা সেকশন</Badge>
            <h1 className="text-3xl md:text-4xl font-bold">চলমান <span className="text-gradient">পরীক্ষা</span></h1>
            <p className="text-muted-foreground mt-2">নিচের লিংকে ক্লিক করে সরাসরি পরীক্ষা দিন</p>
          </div>
          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : list.length === 0 ? (
            <Card className="p-10 text-center text-muted-foreground">এই মুহূর্তে কোনো পরীক্ষা নেই।</Card>
          ) : (
            <div className="space-y-4">
              {list.map((e) => (
                <Card key={e.id} className="p-6 gradient-card border-border/50 shadow-card hover:shadow-glow transition-all">
                  <div className="flex gap-4 items-start">
                    <div className="w-11 h-11 rounded-xl gradient-hero flex items-center justify-center shrink-0 shadow-soft">
                      <FileText className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground mb-1">{new Date(e.publish_date).toLocaleDateString("bn-BD")}</div>
                      <h3 className="font-bold text-lg mb-1">{e.title}</h3>
                      {e.description && <p className="text-sm text-muted-foreground mb-3 whitespace-pre-wrap">{e.description}</p>}
                      {e.image_url && <img src={e.image_url} alt={e.title} className="mb-3 rounded-lg max-h-72 w-auto" loading="lazy" />}
                      <a href={e.url} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" className="gradient-hero text-primary-foreground border-0">
                          পরীক্ষা দিন <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </a>
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
