import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero.jpg";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 gradient-warm opacity-60" />
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-primary-glow/20 blur-3xl" />

      <div className="container relative mx-auto px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
              <Sparkles className="h-3.5 w-3.5" />
              <span>ক্লাস ১ থেকে ১২ পর্যন্ত সম্পূর্ণ সমাধান</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              শেখার নতুন ঠিকানা <br />
              <span className="text-gradient">MNS Academy</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              অভিজ্ঞ শিক্ষকদের সাথে ঘরে বসেই পড়াশোনা করো। লাইভ ক্লাস, রেকর্ডেড ভিডিও, নোট, পরীক্ষা ও মডেল টেস্ট — সব এক জায়গায়।
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/courses">
                <Button size="lg" className="gradient-hero text-primary-foreground border-0 shadow-glow hover:scale-105 transition-transform">
                  কোর্স দেখুন <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/free-classes">
                <Button size="lg" variant="outline" className="border-primary/30 hover:bg-primary/5">
                  <Play className="mr-2 h-4 w-4" /> ফ্রি ক্লাস
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 gradient-hero rounded-3xl blur-2xl opacity-30 scale-95" />
            <img src={heroImg} alt="MNS Academy এ পড়াশোনা করছে শিক্ষার্থীরা" className="relative rounded-3xl shadow-glow w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
