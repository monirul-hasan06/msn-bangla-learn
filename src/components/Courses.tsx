import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

interface Course { id: string; title: string; description: string | null; class_level: string; subject: string | null; price: number; thumbnail_url: string | null; }

export function Courses() {
  const [list, setList] = useState<Course[]>([]);
  useEffect(() => {
    supabase.from("courses").select("*").eq("is_published", true).eq("is_visible", true).order("created_at", { ascending: false }).limit(6)
      .then(({ data }) => setList((data as any) || []));
  }, []);

  if (!list.length) return null;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="secondary" className="mb-3">আমাদের কোর্স</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            তোমার ক্লাসের জন্য <span className="text-gradient">পারফেক্ট কোর্স</span>
          </h2>
          <p className="text-muted-foreground">প্রতিটি ক্লাসের জন্য আলাদা কারিকুলাম, লাইভ ক্লাস ও রেকর্ডেড ভিডিও</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((c) => (
            <Card key={c.id} className="group relative overflow-hidden gradient-card border-border/50 shadow-card hover:shadow-glow transition-all hover:-translate-y-1 p-6 flex flex-col">
              <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center mb-4 shadow-soft">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <Badge variant="outline" className="mb-2 border-primary/30 text-primary self-start">ক্লাস {c.class_level}</Badge>
              <h3 className="text-xl font-bold mb-2">{c.title}</h3>
              {c.description && <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{c.description}</p>}
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
                <div>
                  <div className="text-2xl font-bold text-gradient">৳ {c.price}</div>
                  <div className="text-xs text-muted-foreground">সম্পূর্ণ কোর্স</div>
                </div>
                <Link to="/courses">
                  <Button size="sm" className="gradient-hero text-primary-foreground border-0">বিস্তারিত</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/courses">
            <Button variant="outline" className="border-primary/30 hover:bg-primary/5">সকল কোর্স দেখুন</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
