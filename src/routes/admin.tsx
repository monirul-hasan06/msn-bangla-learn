import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Trash2, Bell, BookOpen, Users, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "অ্যাডমিন প্যানেল — MSN" }] }),
  component: AdminPage,
});

function AdminPage() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) navigate({ to: "/login" });
      else if (role && role !== "admin") {
        toast.error("আপনি অ্যাডমিন নন");
        navigate({ to: "/" });
      }
    }
  }, [user, role, loading]);

  if (loading || !user || role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center shadow-glow">
              <ShieldCheck className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">অ্যাডমিন <span className="text-gradient">প্যানেল</span></h1>
              <p className="text-sm text-muted-foreground">পুরো ওয়েবসাইট নিয়ন্ত্রণ করুন</p>
            </div>
          </div>

          <Tabs defaultValue="notices">
            <TabsList className="mb-4 flex-wrap h-auto">
              <TabsTrigger value="notices"><Bell className="h-4 w-4 mr-1.5" /> নোটিশ</TabsTrigger>
              <TabsTrigger value="courses"><BookOpen className="h-4 w-4 mr-1.5" /> কোর্স</TabsTrigger>
              <TabsTrigger value="enrollments"><Users className="h-4 w-4 mr-1.5" /> এনরোলমেন্ট</TabsTrigger>
              <TabsTrigger value="users"><Users className="h-4 w-4 mr-1.5" /> ইউজার</TabsTrigger>
            </TabsList>

            <TabsContent value="notices"><NoticesTab /></TabsContent>
            <TabsContent value="courses"><CoursesTab /></TabsContent>
            <TabsContent value="enrollments"><EnrollmentsTab /></TabsContent>
            <TabsContent value="users"><UsersTab /></TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function NoticesTab() {
  const [list, setList] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pinned, setPinned] = useState(false);
  const [broadcast, setBroadcast] = useState(true);

  const load = async () => {
    const { data } = await supabase.from("notices").select("*").order("created_at", { ascending: false });
    setList(data || []);
  };
  useEffect(() => { load(); }, []);

  const post = async () => {
    if (!title || !content) return toast.error("সব ঘর পূরণ করুন");
    const { error } = await supabase.from("notices").insert({ title, content, is_pinned: pinned });
    if (error) return toast.error(error.message);
    if (broadcast) {
      await supabase.from("notifications").insert({ title, body: content, link: "/notices" });
    }
    toast.success("নোটিশ পোস্ট হয়েছে");
    setTitle(""); setContent(""); setPinned(false);
    load();
  };

  const del = async (id: string) => {
    await supabase.from("notices").delete().eq("id", id);
    load();
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="p-6 gradient-card">
        <h3 className="font-bold mb-4">নতুন নোটিশ পোস্ট করুন</h3>
        <div className="space-y-3">
          <div><Label>শিরোনাম</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1.5" /></div>
          <div><Label>বিস্তারিত</Label><Textarea rows={5} value={content} onChange={(e) => setContent(e.target.value)} className="mt-1.5" /></div>
          <div className="flex items-center gap-3"><Switch checked={pinned} onCheckedChange={setPinned} id="pin" /><Label htmlFor="pin">পিন করুন</Label></div>
          <div className="flex items-center gap-3"><Switch checked={broadcast} onCheckedChange={setBroadcast} id="bc" /><Label htmlFor="bc">সকলকে নোটিফিকেশন পাঠান</Label></div>
          <Button onClick={post} className="gradient-hero text-primary-foreground border-0 w-full"><Plus className="h-4 w-4 mr-1" /> পোস্ট করুন</Button>
        </div>
      </Card>
      <Card className="p-6 gradient-card">
        <h3 className="font-bold mb-4">সকল নোটিশ ({list.length})</h3>
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {list.map((n) => (
            <div key={n.id} className="p-3 rounded-lg border border-border">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <div className="font-medium text-sm">{n.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2">{n.content}</div>
                </div>
                <Button size="icon" variant="ghost" onClick={() => del(n.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function CoursesTab() {
  const [list, setList] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", description: "", class_level: "", subject: "", price: "0", thumbnail_url: "" });

  const load = async () => {
    const { data } = await supabase.from("courses").select("*").order("created_at", { ascending: false });
    setList(data || []);
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.title || !form.class_level) return toast.error("শিরোনাম ও ক্লাস দিন");
    const { error } = await supabase.from("courses").insert({ ...form, price: Number(form.price) || 0 });
    if (error) return toast.error(error.message);
    toast.success("কোর্স যোগ হয়েছে");
    setForm({ title: "", description: "", class_level: "", subject: "", price: "0", thumbnail_url: "" });
    load();
  };

  const del = async (id: string) => {
    await supabase.from("courses").delete().eq("id", id);
    load();
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="p-6 gradient-card">
        <h3 className="font-bold mb-4">নতুন কোর্স যোগ করুন</h3>
        <div className="space-y-3">
          <Input placeholder="কোর্সের নাম" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Textarea placeholder="বিবরণ" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="ক্লাস (e.g. 9)" value={form.class_level} onChange={(e) => setForm({ ...form, class_level: e.target.value })} />
            <Input placeholder="বিষয়" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          </div>
          <Input type="number" placeholder="মূল্য (৳)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <Input placeholder="থাম্বনেইল URL (optional)" value={form.thumbnail_url} onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })} />
          <Button onClick={create} className="gradient-hero text-primary-foreground border-0 w-full"><Plus className="h-4 w-4 mr-1" /> যোগ করুন</Button>
        </div>
      </Card>
      <Card className="p-6 gradient-card">
        <h3 className="font-bold mb-4">সকল কোর্স ({list.length})</h3>
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {list.map((c) => (
            <div key={c.id} className="flex justify-between items-center p-3 rounded-lg border border-border">
              <div>
                <div className="font-medium text-sm">{c.title}</div>
                <div className="text-xs text-muted-foreground">ক্লাস {c.class_level} • ৳{c.price}</div>
              </div>
              <Button size="icon" variant="ghost" onClick={() => del(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function EnrollmentsTab() {
  const [list, setList] = useState<any[]>([]);

  const load = async () => {
    const { data } = await supabase
      .from("enrollments")
      .select("*, courses(title, price), profiles(full_name, email, phone)")
      .order("created_at", { ascending: false });
    setList(data || []);
  };
  useEffect(() => { load(); }, []);

  const update = async (id: string, status: string) => {
    await supabase.from("enrollments").update({ status }).eq("id", id);
    toast.success(status === "approved" ? "অনুমোদন দেওয়া হয়েছে" : "প্রত্যাখ্যান করা হয়েছে");
    load();
  };

  return (
    <Card className="p-6 gradient-card">
      <h3 className="font-bold mb-4">সকল কোর্স রিকোয়েস্ট ({list.length})</h3>
      <div className="space-y-2">
        {list.map((e) => (
          <div key={e.id} className="flex flex-col sm:flex-row justify-between gap-2 p-3 rounded-lg border border-border">
            <div className="flex-1">
              <div className="font-medium">{e.courses?.title} — ৳{e.courses?.price}</div>
              <div className="text-xs text-muted-foreground">{e.profiles?.full_name} • {e.profiles?.email} • {e.profiles?.phone}</div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={e.status === "approved" ? "default" : "secondary"} className={e.status === "approved" ? "bg-success" : ""}>{e.status}</Badge>
              {e.status === "pending" && (
                <>
                  <Button size="sm" onClick={() => update(e.id, "approved")} className="bg-success hover:bg-success/90">অনুমোদন</Button>
                  <Button size="sm" variant="outline" onClick={() => update(e.id, "rejected")}>প্রত্যাখ্যান</Button>
                </>
              )}
            </div>
          </div>
        ))}
        {list.length === 0 && <p className="text-center text-muted-foreground py-8">কোনো রিকোয়েস্ট নেই</p>}
      </div>
    </Card>
  );
}

function UsersTab() {
  const [list, setList] = useState<any[]>([]);
  const [roles, setRoles] = useState<Record<string, string[]>>({});

  const load = async () => {
    const { data: profiles } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    const { data: r } = await supabase.from("user_roles").select("*");
    const byUser: Record<string, string[]> = {};
    (r || []).forEach((row) => { (byUser[row.user_id] ||= []).push(row.role); });
    setRoles(byUser);
    setList(profiles || []);
  };
  useEffect(() => { load(); }, []);

  const toggleAdmin = async (userId: string, isAdmin: boolean) => {
    if (isAdmin) {
      await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
    } else {
      await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
    }
    toast.success("ভূমিকা আপডেট হয়েছে");
    load();
  };

  return (
    <Card className="p-6 gradient-card">
      <h3 className="font-bold mb-4">সকল ইউজার ({list.length})</h3>
      <div className="space-y-2">
        {list.map((u) => {
          const isAdmin = roles[u.id]?.includes("admin");
          return (
            <div key={u.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-3 rounded-lg border border-border">
              <div>
                <div className="font-medium">{u.full_name || "নামহীন"}</div>
                <div className="text-xs text-muted-foreground">{u.email} {u.phone && `• ${u.phone}`} {u.class_level && `• ক্লাস ${u.class_level}`}</div>
              </div>
              <div className="flex items-center gap-2">
                {isAdmin && <Badge className="gradient-hero text-primary-foreground border-0">Admin</Badge>}
                <Button size="sm" variant={isAdmin ? "outline" : "default"} onClick={() => toggleAdmin(u.id, !!isAdmin)} className={!isAdmin ? "gradient-hero text-primary-foreground border-0" : ""}>
                  {isAdmin ? "Admin সরান" : "Admin বানান"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
