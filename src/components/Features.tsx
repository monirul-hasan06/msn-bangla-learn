import { Card } from "@/components/ui/card";
import { Video, FileText, ClipboardCheck, Users, Award, MessageCircle } from "lucide-react";

const features = [
  { icon: Video, title: "লাইভ ক্লাস", desc: "প্রতিদিন অভিজ্ঞ শিক্ষকদের সাথে লাইভ ইন্টারঅ্যাকটিভ ক্লাস" },
  { icon: FileText, title: "রেকর্ডেড ভিডিও", desc: "যেকোনো সময় পুনরায় দেখার সুবিধা সহ HD ভিডিও লেকচার" },
  { icon: ClipboardCheck, title: "মডেল টেস্ট", desc: "সাপ্তাহিক MCQ ও CQ টেস্ট এবং বিস্তারিত সমাধান" },
  { icon: FileText, title: "PDF নোট", desc: "প্রতিটি অধ্যায়ের গোছানো হ্যান্ড নোট ডাউনলোড করুন" },
  { icon: Users, title: "ডাউট সলভিং", desc: "ব্যক্তিগত ডাউট ক্লিয়ার করার জন্য ডেডিকেটেড সেশন" },
  { icon: Award, title: "সার্টিফিকেট", desc: "কোর্স সম্পন্ন করার পর প্রাপ্ত হবে বৈধ সার্টিফিকেট" },
];

export function Features() {
  return (
    <section className="py-20 gradient-warm">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            শিক্ষকরা যা <span className="text-gradient">প্রদান করবেন</span>
          </h2>
          <p className="text-muted-foreground">পড়াশোনার জন্য প্রয়োজনীয় সব কিছু এক প্ল্যাটফর্মে</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <Card key={f.title} className="group p-6 bg-card/80 backdrop-blur border-border/50 shadow-soft hover:shadow-card transition-all">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:gradient-hero group-hover:shadow-glow transition-all">
                <f.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
