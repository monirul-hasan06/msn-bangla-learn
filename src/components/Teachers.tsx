import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Teacher { id: string; name: string; expertise: string; class_range: string; photo_url: string | null; }

const colors = [
  "from-orange-400 to-red-500",
  "from-amber-400 to-orange-600",
  "from-yellow-400 to-orange-500",
  "from-orange-500 to-pink-500",
  "from-red-400 to-orange-500",
  "from-amber-500 to-yellow-500",
];

export function Teachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  useEffect(() => {
    supabase.from("teachers").select("*").eq("is_visible", true).order("display_order")
      .then(({ data }) => setTeachers((data as any) || []));
  }, []);

  if (!teachers.length) return null;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="secondary" className="mb-3">আমাদের শিক্ষকমণ্ডলী</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            অভিজ্ঞ ও <span className="text-gradient">যোগ্যতাসম্পন্ন শিক্ষক</span>
          </h2>
          <p className="text-muted-foreground">দেশের সেরা শিক্ষকদের সাথে শেখো</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {teachers.map((t, i) => (
            <Card key={t.id} className="group p-6 gradient-card border-border/50 shadow-card hover:shadow-glow transition-all hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                {t.photo_url ? (
                  <img src={t.photo_url} alt={t.name} className="w-16 h-16 rounded-2xl object-cover shadow-soft" />
                ) : (
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colors[i % colors.length]} flex items-center justify-center shadow-soft`}>
                    <User className="h-8 w-8 text-white" />
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-base leading-tight">{t.name}</h3>
                  <p className="text-sm text-primary font-medium mt-1">{t.expertise}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <Badge variant="outline" className="text-xs"><GraduationCap className="h-3 w-3 mr-1" />{t.class_range}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
