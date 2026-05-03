import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "প্রাইভেসি পলিসি — MNS Academy" }, { name: "description", content: "MNS Academyর প্রাইভেসি পলিসি।" }] }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-center">প্রাইভেসি <span className="text-gradient">পলিসি</span></h1>
          <p className="text-center text-muted-foreground mb-8">সর্বশেষ আপডেট: ২৮ এপ্রিল, ২০২৬</p>
          <Card className="p-8 gradient-card border-border/50 shadow-card space-y-5 text-foreground/80 leading-relaxed">
            <section>
              <h2 className="font-bold text-lg mb-2 text-foreground">১. তথ্য সংগ্রহ</h2>
              <p>আমরা শুধু সেই তথ্য সংগ্রহ করি যা আপনি আমাদের কাছে স্বেচ্ছায় প্রদান করেন (নাম, ইমেইল, ফোন, ক্লাস)।</p>
            </section>
            <section>
              <h2 className="font-bold text-lg mb-2 text-foreground">২. তথ্যের ব্যবহার</h2>
              <p>সংগৃহীত তথ্য শুধুমাত্র কোর্স পরিচালনা, যোগাযোগ ও সেবার মান উন্নয়নে ব্যবহার করা হয়।</p>
            </section>
            <section>
              <h2 className="font-bold text-lg mb-2 text-foreground">৩. ডিভাইস সীমা</h2>
              <p>প্রতিটি অ্যাকাউন্ট সর্বোচ্চ ২টি ডিভাইসে একসাথে লগইন থাকতে পারবে।</p>
            </section>
            <section>
              <h2 className="font-bold text-lg mb-2 text-foreground">৪. তথ্য সুরক্ষা</h2>
              <p>আপনার তথ্য সুরক্ষিত রাখতে আমরা সর্বোচ্চ নিরাপত্তা ব্যবস্থা গ্রহণ করি।</p>
            </section>
            <section>
              <h2 className="font-bold text-lg mb-2 text-foreground">৫. যোগাযোগ</h2>
              <p>প্রাইভেসি সংক্রান্ত যেকোনো প্রশ্নে: info@msn.edu.bd</p>
            </section>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
