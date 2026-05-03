import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Target, Heart, Award } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "আমাদের সম্পর্কে — MNS Academy" }, { name: "description", content: "MNS Academyর লক্ষ্য, মিশন ও যাত্রা সম্পর্কে জানুন।" }] }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">আমাদের <span className="text-gradient">সম্পর্কে</span></h1>
            <p className="text-muted-foreground text-lg">MNS Academy — শিক্ষাকে সহজলভ্য করার একটি প্রতিশ্রুতি</p>
          </div>
          <Card className="p-8 mb-8 gradient-card border-border/50 shadow-card">
            <p className="text-foreground/80 leading-relaxed mb-4">
              MNS Academy বাংলাদেশের শিক্ষার্থীদের জন্য তৈরি একটি আধুনিক অনলাইন শিক্ষা প্ল্যাটফর্ম। ক্লাস ৫ থেকে ১২ পর্যন্ত প্রতিটি শিক্ষার্থী যেন মানসম্মত শিক্ষা পেতে পারে — এটিই আমাদের মূল লক্ষ্য।
            </p>
            <p className="text-foreground/80 leading-relaxed">
              দেশের শ্রেষ্ঠ শিক্ষকদের নিয়ে গঠিত আমাদের টিম প্রতিদিন লাইভ ক্লাস, রেকর্ডেড ভিডিও, নোট, মডেল টেস্ট ও ডাউট সলভিং সেবা প্রদান করে যাচ্ছে।
            </p>
          </Card>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Target, title: "আমাদের মিশন", text: "প্রতিটি শিক্ষার্থীর কাছে মানসম্মত শিক্ষা পৌঁছে দেওয়া।" },
              { icon: Heart, title: "আমাদের ভিশন", text: "বাংলাদেশের সবচেয়ে বিশ্বস্ত শিক্ষা প্ল্যাটফর্ম হওয়া।" },
              { icon: Award, title: "আমাদের মূল্যবোধ", text: "মান, সততা ও শিক্ষার্থী-কেন্দ্রিক সেবা।" },
            ].map((v) => (
              <Card key={v.title} className="p-6 text-center gradient-card border-border/50 shadow-soft">
                <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center mx-auto mb-3 shadow-soft">
                  <v.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-bold mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
