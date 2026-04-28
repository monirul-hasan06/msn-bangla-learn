import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Teachers } from "@/components/Teachers";

export const Route = createFileRoute("/teachers")({
  head: () => ({ meta: [{ title: "শিক্ষকমণ্ডলী — MSN একাডেমি" }, { name: "description", content: "MSN একাডেমির অভিজ্ঞ শিক্ষকদের তালিকা।" }] }),
  component: () => (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-8"><Teachers /></main>
      <Footer />
    </div>
  ),
});
