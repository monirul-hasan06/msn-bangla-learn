import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Courses } from "@/components/Courses";

export const Route = createFileRoute("/courses")({
  head: () => ({ meta: [{ title: "কোর্সসমূহ — MSN একাডেমি" }, { name: "description", content: "ক্লাস ৫ থেকে ১২ পর্যন্ত সকল কোর্স এক জায়গায়।" }] }),
  component: () => (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-8"><Courses /></main>
      <Footer />
    </div>
  ),
});
