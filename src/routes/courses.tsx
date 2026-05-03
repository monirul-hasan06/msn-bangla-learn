import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Loader2, ShoppingCart, CheckCircle2, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/courses")({
  head: () => ({ meta: [{ title: "কোর্সসমূহ — MNS Academy" }, { name: "description", content: "ক্লাস ১ থেকে ১২ পর্যন্ত সকল কোর্স এক জায়গায়।" }] }),
  component: CoursesPage,
});

interface Course {
  id: string;
  title: string;
  description: string | null;
  class_level: string;
  subject: string | null;
  price: number;
  thumbnail_url: string | null;
}

interface Enrollment {
  course_id: string;
  status: string;
}

function CoursesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data: c } = await supabase.from("courses").select("*").eq("is_published", true).order("created_at", { ascending: false });
    setCourses(c || []);
    if (user) {
      const { data: e } = await supabase.from("enrollments").select("course_id, status").eq("user_id", user.id);
      setEnrollments(e || []);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const handleBuy = async (course: Course) => {
    if (!user) {
      toast.info("কোর্স কিনতে লগইন করুন");
      navigate({ to: "/login" });
      return;
    }
    const { error } = await supabase.from("enrollments").insert({
      user_id: user.id,
      course_id: course.id,
      status: "pending",
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("রিকোয়েস্ট পাঠানো হয়েছে! অ্যাডমিনের অনুমতির অপেক্ষায়।");
    load();
  };

  const enrollmentStatus = (id: string) => enrollments.find((e) => e.course_id === id)?.status;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Badge variant="secondary" className="mb-3">আমাদের কোর্সসমূহ</Badge>
            <h1 className="text-3xl md:text-4xl font-bold">তোমার ক্লাসের জন্য <span className="text-gradient">সঠিক কোর্স</span></h1>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">প্রতিটি কোর্সে লাইভ ক্লাস, রেকর্ডেড ভিডিও, নোট ও মডেল টেস্ট অন্তর্ভুক্ত।</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : courses.length === 0 ? (
            <Card className="p-12 text-center text-muted-foreground max-w-2xl mx-auto">
              এখনো কোনো কোর্স প্রকাশ করা হয়নি। অ্যাডমিন প্যানেল থেকে কোর্স যোগ করুন।
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((c) => {
                const status = enrollmentStatus(c.id);
                return (
                  <Card key={c.id} className="overflow-hidden gradient-card border-border/50 shadow-card hover:shadow-glow transition-all hover:-translate-y-1 duration-300 flex flex-col">
                    <div className="aspect-video gradient-hero relative flex items-center justify-center">
                      {c.thumbnail_url ? (
                        <img src={c.thumbnail_url} alt={c.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <BookOpen className="h-16 w-16 text-primary-foreground/80" />
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs border-primary/30 text-primary">ক্লাস {c.class_level}</Badge>
                        {c.subject && <Badge variant="secondary" className="text-xs">{c.subject}</Badge>}
                      </div>
                      <h3 className="font-bold text-lg mb-1">{c.title}</h3>
                      {c.description && <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{c.description}</p>}
                      <div className="mt-auto flex items-center justify-between gap-2 pt-3 border-t border-border">
                        <span className="text-xl font-bold text-primary">৳ {c.price}</span>
                        {status === "approved" ? (
                          <Button size="sm" disabled className="bg-success text-success-foreground">
                            <CheckCircle2 className="h-4 w-4 mr-1" /> কেনা হয়েছে
                          </Button>
                        ) : status === "pending" ? (
                          <Button size="sm" disabled variant="outline">
                            <Clock className="h-4 w-4 mr-1" /> অপেক্ষমাণ
                          </Button>
                        ) : (
                          <Button size="sm" onClick={() => handleBuy(c)} className="gradient-hero text-primary-foreground border-0">
                            <ShoppingCart className="h-4 w-4 mr-1" /> কিনুন
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
