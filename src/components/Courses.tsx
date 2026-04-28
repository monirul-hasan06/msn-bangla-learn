import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Users, Star } from "lucide-react";
import { Link } from "@tanstack/react-router";

const courses = [
  { cls: "ক্লাস ১২", title: "HSC ২০২৬ ফুল কোর্স", subjects: "পদার্থ, রসায়ন, গণিত, জীববিজ্ঞান", price: "৳৩,৫০০", duration: "১২ মাস", students: "১২০০+", rating: "৪.৯", popular: true },
  { cls: "ক্লাস ১০", title: "SSC ২০২৬ প্রস্তুতি", subjects: "সকল বিষয়ের সম্পূর্ণ সমাধান", price: "৳২,৮০০", duration: "১০ মাস", students: "৯৫০+", rating: "৪.৮" },
  { cls: "ক্লাস ৯", title: "নবম শ্রেণি বিজ্ঞান বিভাগ", subjects: "গণিত, পদার্থ, রসায়ন, জীববিজ্ঞান", price: "৳২,২০০", duration: "১০ মাস", students: "৭৮০+", rating: "৪.৮" },
  { cls: "ক্লাস ৮", title: "অষ্টম শ্রেণি ফাউন্ডেশন", subjects: "গণিত, ইংরেজি, বিজ্ঞান", price: "৳১,৮০০", duration: "৮ মাস", students: "৬৫০+", rating: "৪.৭" },
  { cls: "ক্লাস ৬-৭", title: "জুনিয়র ফাউন্ডেশন কোর্স", subjects: "মূল বিষয়সমূহের ভিত্তি", price: "৳১,৫০০", duration: "৮ মাস", students: "৫২০+", rating: "৪.৭" },
  { cls: "ক্লাস ৫", title: "PSC প্রস্তুতি কোর্স", subjects: "বাংলা, গণিত, ইংরেজি, বিজ্ঞান", price: "৳১,২০০", duration: "৬ মাস", students: "৪২০+", rating: "৪.৮" },
];

export function Courses() {
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
          {courses.map((c) => (
            <Card key={c.title} className="group relative overflow-hidden gradient-card border-border/50 shadow-card hover:shadow-glow transition-all hover:-translate-y-1 p-6">
              {c.popular && (
                <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-semibold gradient-hero text-primary-foreground">
                  জনপ্রিয়
                </div>
              )}
              <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center mb-4 shadow-soft">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <Badge variant="outline" className="mb-2 border-primary/30 text-primary">{c.cls}</Badge>
              <h3 className="text-xl font-bold mb-2">{c.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{c.subjects}</p>

              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4 pb-4 border-b border-border">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{c.duration}</span>
                <span className="flex items-center gap-1"><Users className="h-3 w-3" />{c.students}</span>
                <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-primary text-primary" />{c.rating}</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gradient">{c.price}</div>
                  <div className="text-xs text-muted-foreground">সম্পূর্ণ কোর্স</div>
                </div>
                <Link to="/login">
                  <Button size="sm" className="gradient-hero text-primary-foreground border-0">এনরোল করুন</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
