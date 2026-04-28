import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";

const classes = [
  { title: "পদার্থবিজ্ঞান - নিউটনের গতিসূত্র", cls: "ক্লাস ৯-১০", url: "https://www.youtube.com/watch?v=kKKM8Y-u7ds", thumb: "https://img.youtube.com/vi/kKKM8Y-u7ds/maxresdefault.jpg" },
  { title: "গণিত - দ্বিঘাত সমীকরণ", cls: "ক্লাস ৯-১০", url: "https://www.youtube.com/watch?v=Jiv6m8VS7XI", thumb: "https://img.youtube.com/vi/Jiv6m8VS7XI/maxresdefault.jpg" },
  { title: "রসায়ন - পর্যায় সারণি", cls: "ক্লাস ১১-১২", url: "https://www.youtube.com/watch?v=0RRVV4Diomg", thumb: "https://img.youtube.com/vi/0RRVV4Diomg/maxresdefault.jpg" },
];

export function FreeClasses() {
  return (
    <section className="py-20 gradient-warm">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="secondary" className="mb-3">ফ্রি ক্লাস</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            ইউটিউবে <span className="text-gradient">বিনামূল্যে শিখুন</span>
          </h2>
          <p className="text-muted-foreground">আমাদের ইউটিউব চ্যানেলে শত শত ফ্রি লেকচার পাওয়া যাচ্ছে</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {classes.map((c) => (
            <a key={c.title} href={c.url} target="_blank" rel="noopener noreferrer" className="group">
              <Card className="overflow-hidden border-border/50 shadow-card hover:shadow-glow transition-all">
                <div className="relative aspect-video bg-muted overflow-hidden">
                  <img src={c.thumb} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                  <div className="absolute inset-0 bg-foreground/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 rounded-full gradient-hero flex items-center justify-center shadow-glow">
                      <Play className="h-7 w-7 text-primary-foreground fill-current ml-1" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <Badge variant="outline" className="mb-2 text-xs border-primary/30 text-primary">{c.cls}</Badge>
                  <h3 className="font-bold group-hover:text-primary transition-colors">{c.title}</h3>
                </div>
              </Card>
            </a>
          ))}
        </div>

        <div className="text-center">
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="outline" className="border-primary/30 hover:bg-primary/5">
              <Youtube className="mr-2 h-5 w-5 text-primary" />
              আমাদের ইউটিউব চ্যানেল ভিজিট করুন
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
