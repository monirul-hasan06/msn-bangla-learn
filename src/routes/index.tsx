import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Courses } from "@/components/Courses";
import { Features } from "@/components/Features";
import { Teachers } from "@/components/Teachers";
import { FreeClasses } from "@/components/FreeClasses";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MSN একাডেমি — ক্লাস ৫-১২ অনলাইন শিক্ষা প্ল্যাটফর্ম" },
      { name: "description", content: "MSN একাডেমিতে ক্লাস ৫ থেকে ১২ পর্যন্ত লাইভ ক্লাস, রেকর্ডেড ভিডিও, নোট ও মডেল টেস্ট। দেশের সেরা শিক্ষকদের সাথে ঘরে বসেই পড়াশোনা।" },
      { property: "og:title", content: "MSN একাডেমি — অনলাইন শিক্ষা প্ল্যাটফর্ম" },
      { property: "og:description", content: "ক্লাস ৫ থেকে ১২ পর্যন্ত সম্পূর্ণ একাডেমিক সমাধান।" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <Courses />
        <Teachers />
        <FreeClasses />
      </main>
      <Footer />
    </div>
  );
}
