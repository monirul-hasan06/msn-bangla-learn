import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FreeClasses } from "@/components/FreeClasses";

export const Route = createFileRoute("/free-classes")({
  head: () => ({ meta: [{ title: "ফ্রি ক্লাস — MNS Academy" }, { name: "description", content: "ইউটিউবে আমাদের ফ্রি লেকচারগুলো দেখুন।" }] }),
  component: () => (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-8"><FreeClasses /></main>
      <Footer />
    </div>
  ),
});
