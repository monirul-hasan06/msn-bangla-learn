import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/use-site";

interface ClassLink { id: string; title: string; url: string; type: string; image_url?: string | null; }

function ytId(url: string) {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

export function FreeClasses() {
  const [items, setItems] = useState<ClassLink[]>([]);
  const { settings } = useSiteSettings();
  useEffect(() => {
    supabase.from("class_links").select("*").eq("is_visible", true).order("created_at", { ascending: false })
      .then(({ data }) => setItems((data as any) || []));
  }, []);

  const yt = settings.youtube_channel?.is_visible ? settings.youtube_channel.value : null;

  if (!items.length && !yt) return null;

  return (
    <section className="py-20 gradient-warm">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="secondary" className="mb-3">ফ্রি ক্লাস</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            ইউটিউবে <span className="text-gradient">বিনামূল্যে শিখুন</span>
          </h2>
          <p className="text-muted-foreground">আমাদের চ্যানেলে শত শত ফ্রি লেকচার পাওয়া যাচ্ছে</p>
        </div>

        {items.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {items.slice(0, 6).map((c) => {
              const id = ytId(c.url);
              const thumb = id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : null;
              return (
                <a key={c.id} href={c.url} target="_blank" rel="noopener noreferrer" className="group">
                  <Card className="overflow-hidden border-border/50 shadow-card hover:shadow-glow transition-all">
                    <div className="relative aspect-video bg-muted overflow-hidden flex items-center justify-center">
                      {thumb ? (
                        <img src={thumb} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                      ) : (
                        <Play className="h-12 w-12 text-primary" />
                      )}
                      <div className="absolute inset-0 bg-foreground/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 rounded-full gradient-hero flex items-center justify-center shadow-glow">
                          <Play className="h-7 w-7 text-primary-foreground fill-current ml-1" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold group-hover:text-primary transition-colors line-clamp-2">{c.title}</h3>
                    </div>
                  </Card>
                </a>
              );
            })}
          </div>
        )}

        {yt && (
          <div className="text-center">
            <a href={yt} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-primary/30 hover:bg-primary/5">
                <Youtube className="mr-2 h-5 w-5 text-primary" /> আমাদের ইউটিউব চ্যানেল ভিজিট করুন
              </Button>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
