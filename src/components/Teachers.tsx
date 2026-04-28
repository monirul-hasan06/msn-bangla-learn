import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap } from "lucide-react";

const teachers = [
  { name: "মোঃ রফিকুল ইসলাম", subject: "পদার্থবিজ্ঞান", classes: "ক্লাস ৯-১২", exp: "১২+ বছর", initial: "র" },
  { name: "ড. সাবরিনা আক্তার", subject: "রসায়ন", classes: "ক্লাস ৯-১২", exp: "১০+ বছর", initial: "সা" },
  { name: "মোঃ কামরুল হাসান", subject: "উচ্চতর গণিত", classes: "ক্লাস ৬-১২", exp: "১৫+ বছর", initial: "কা" },
  { name: "নাফিসা তাবাসসুম", subject: "ইংরেজি", classes: "ক্লাস ৫-১২", exp: "৮+ বছর", initial: "না" },
  { name: "তারেক মাহমুদ", subject: "জীববিজ্ঞান", classes: "ক্লাস ৯-১২", exp: "৯+ বছর", initial: "তা" },
  { name: "ফারজানা ইয়াসমিন", subject: "বাংলা", classes: "ক্লাস ৫-১২", exp: "১১+ বছর", initial: "ফা" },
];

const colors = [
  "from-orange-400 to-red-500",
  "from-amber-400 to-orange-600",
  "from-yellow-400 to-orange-500",
  "from-orange-500 to-pink-500",
  "from-red-400 to-orange-500",
  "from-amber-500 to-yellow-500",
];

export function Teachers() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="secondary" className="mb-3">আমাদের শিক্ষকমণ্ডলী</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            দেশের <span className="text-gradient">সেরা শিক্ষকরা</span>
          </h2>
          <p className="text-muted-foreground">অভিজ্ঞ ও যোগ্যতাসম্পন্ন শিক্ষকদের সাথে শেখো</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((t, i) => (
            <Card key={t.name} className="group p-6 gradient-card border-border/50 shadow-card hover:shadow-glow transition-all hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colors[i]} flex items-center justify-center text-2xl font-bold text-white shadow-soft`}>
                  {t.initial}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{t.name}</h3>
                  <p className="text-sm text-primary font-medium">{t.subject}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                <Badge variant="outline" className="text-xs"><GraduationCap className="h-3 w-3 mr-1" />{t.classes}</Badge>
                <Badge variant="outline" className="text-xs">{t.exp} অভিজ্ঞতা</Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
