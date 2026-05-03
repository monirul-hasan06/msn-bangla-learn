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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2, Plus, Trash2, Bell, BookOpen, Users, ShieldCheck, GraduationCap, Settings, Share2, Video, FileText, MessageSquare, Pencil, Eye, EyeOff } from "lucide-react";
import { ImageUpload } from "@/components/ImageUpload";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "অ্যাডমিন ড্যাশবোর্ড — MNS Academy" }] }),
  component: AdminPage,
});

function AdminPage() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) navigate({ to: "/admin/login" });
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
              <h1 className="text-2xl md:text-3xl font-bold">অ্যাডমিন <span className="text-gradient">ড্যাশবোর্ড</span></h1>
              <p className="text-sm text-muted-foreground">MNS Academy এর সম্পূর্ণ নিয়ন্ত্রণ এক জায়গায়</p>
            </div>
          </div>

          <Tabs defaultValue="notices">
            <TabsList className="mb-4 flex-wrap h-auto">
              <TabsTrigger value="notices"><Bell className="h-4 w-4 mr-1.5" /> নোটিশ</TabsTrigger>
              <TabsTrigger value="exams"><FileText className="h-4 w-4 mr-1.5" /> পরীক্ষা</TabsTrigger>
              <TabsTrigger value="courses"><BookOpen className="h-4 w-4 mr-1.5" /> কোর্স</TabsTrigger>
              <TabsTrigger value="teachers"><GraduationCap className="h-4 w-4 mr-1.5" /> শিক্ষক</TabsTrigger>
              <TabsTrigger value="classes"><Video className="h-4 w-4 mr-1.5" /> ক্লাস লিংক</TabsTrigger>
              <TabsTrigger value="info"><Settings className="h-4 w-4 mr-1.5" /> সাইট তথ্য</TabsTrigger>
              <TabsTrigger value="social"><Share2 className="h-4 w-4 mr-1.5" /> সোশ্যাল</TabsTrigger>
              <TabsTrigger value="messages"><MessageSquare className="h-4 w-4 mr-1.5" /> মেসেজ</TabsTrigger>
              <TabsTrigger value="users"><Users className="h-4 w-4 mr-1.5" /> ইউজার</TabsTrigger>
            </TabsList>

            <TabsContent value="notices"><NoticesTab /></TabsContent>
            <TabsContent value="exams"><ExamsTab /></TabsContent>
            <TabsContent value="courses"><CoursesTab /></TabsContent>
            <TabsContent value="teachers"><TeachersTab /></TabsContent>
            <TabsContent value="classes"><ClassLinksTab /></TabsContent>
            <TabsContent value="info"><SiteInfoTab /></TabsContent>
            <TabsContent value="social"><SocialTab /></TabsContent>
            <TabsContent value="messages"><MessagesTab /></TabsContent>
            <TabsContent value="users"><UsersTab /></TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ConfirmDelete({ onConfirm, label = "এই আইটেম" }: { onConfirm: () => void; label?: string }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="icon" variant="ghost"><Trash2 className="h-4 w-4 text-destructive" /></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>মুছে ফেলতে চান?</AlertDialogTitle>
          <AlertDialogDescription>{label} স্থায়ীভাবে মুছে যাবে। এটি ফিরিয়ে আনা যাবে না।</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>বাতিল</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-destructive hover:bg-destructive/90">হ্যাঁ, মুছে দিন</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function VisibilityToggle({ visible, onChange }: { visible: boolean; onChange: (v: boolean) => void }) {
  return (
    <Button size="icon" variant="ghost" onClick={() => onChange(!visible)} title={visible ? "লুকান" : "দেখান"}>
      {visible ? <Eye className="h-4 w-4 text-success" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
    </Button>
  );
}

/* --------- NOTICES --------- */
function NoticesTab() {
  const [list, setList] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [title, setTitle] = useState(""); const [content, setContent] = useState("");
  const [pinned, setPinned] = useState(false); const [broadcast, setBroadcast] = useState(true);

  const load = async () => {
    const { data } = await supabase.from("notices").select("*").order("created_at", { ascending: false });
    setList(data || []);
  };
  useEffect(() => { load(); }, []);

  const reset = () => { setEditing(null); setTitle(""); setContent(""); setPinned(false); };

  const save = async () => {
    if (!title || !content) return toast.error("সব ঘর পূরণ করুন");
    if (editing) {
      const { error } = await supabase.from("notices").update({ title, content, is_pinned: pinned }).eq("id", editing.id);
      if (error) return toast.error(error.message);
      toast.success("আপডেট হয়েছে");
    } else {
      const { error } = await supabase.from("notices").insert({ title, content, is_pinned: pinned });
      if (error) return toast.error(error.message);
      if (broadcast) await supabase.from("notifications").insert({ title, body: content, link: "/notices" });
      toast.success("নোটিশ পোস্ট হয়েছে");
    }
    reset(); load();
  };

  const startEdit = (n: any) => { setEditing(n); setTitle(n.title); setContent(n.content); setPinned(n.is_pinned); };
  const toggleVis = async (id: string, v: boolean) => { await supabase.from("notices").update({ is_visible: v }).eq("id", id); load(); };
  const del = async (id: string) => { await supabase.from("notices").delete().eq("id", id); toast.success("মুছে ফেলা হয়েছে"); load(); };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="p-6 gradient-card">
        <h3 className="font-bold mb-4">{editing ? "নোটিশ এডিট করুন" : "নতুন নোটিশ পোস্ট করুন"}</h3>
        <div className="space-y-3">
          <div><Label>শিরোনাম</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1.5" /></div>
          <div><Label>বিস্তারিত</Label><Textarea rows={5} value={content} onChange={(e) => setContent(e.target.value)} className="mt-1.5" /></div>
          <div className="flex items-center gap-3"><Switch checked={pinned} onCheckedChange={setPinned} id="pin" /><Label htmlFor="pin">পিন করুন</Label></div>
          {!editing && <div className="flex items-center gap-3"><Switch checked={broadcast} onCheckedChange={setBroadcast} id="bc" /><Label htmlFor="bc">সকলকে নোটিফিকেশন পাঠান</Label></div>}
          <div className="flex gap-2">
            <Button onClick={save} className="gradient-hero text-primary-foreground border-0 flex-1">
              {editing ? <><Pencil className="h-4 w-4 mr-1" /> আপডেট</> : <><Plus className="h-4 w-4 mr-1" /> পোস্ট করুন</>}
            </Button>
            {editing && <Button variant="outline" onClick={reset}>বাতিল</Button>}
          </div>
        </div>
      </Card>
      <Card className="p-6 gradient-card">
        <h3 className="font-bold mb-4">সকল নোটিশ ({list.length})</h3>
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {list.map((n) => (
            <div key={n.id} className="p-3 rounded-lg border border-border">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <div className="font-medium text-sm">{n.title} {n.is_pinned && <Badge variant="outline" className="ml-1 text-xs">📌</Badge>}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2">{n.content}</div>
                </div>
                <div className="flex gap-1">
                  <VisibilityToggle visible={n.is_visible} onChange={(v) => toggleVis(n.id, v)} />
                  <Button size="icon" variant="ghost" onClick={() => startEdit(n)}><Pencil className="h-4 w-4" /></Button>
                  <ConfirmDelete onConfirm={() => del(n.id)} label="এই নোটিশ" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* --------- EXAMS --------- */
function ExamsTab() {
  const [list, setList] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ title: "", description: "", url: "", publish_date: new Date().toISOString().slice(0,10) });

  const load = async () => {
    const { data } = await supabase.from("exam_links").select("*").order("publish_date", { ascending: false });
    setList(data || []);
  };
  useEffect(() => { load(); }, []);

  const reset = () => { setEditing(null); setForm({ title: "", description: "", url: "", publish_date: new Date().toISOString().slice(0,10) }); };

  const save = async () => {
    if (!form.title || !form.url) return toast.error("শিরোনাম ও লিংক দিন");
    const payload = { ...form, publish_date: new Date(form.publish_date).toISOString() };
    if (editing) {
      const { error } = await supabase.from("exam_links").update(payload).eq("id", editing.id);
      if (error) return toast.error(error.message);
      toast.success("আপডেট হয়েছে");
    } else {
      const { error } = await supabase.from("exam_links").insert(payload);
      if (error) return toast.error(error.message);
      toast.success("পরীক্ষার লিংক যোগ হয়েছে");
    }
    reset(); load();
  };
  const startEdit = (e: any) => { setEditing(e); setForm({ title: e.title, description: e.description || "", url: e.url, publish_date: e.publish_date.slice(0,10) }); };
  const toggleVis = async (id: string, v: boolean) => { await supabase.from("exam_links").update({ is_visible: v }).eq("id", id); load(); };
  const del = async (id: string) => { await supabase.from("exam_links").delete().eq("id", id); toast.success("মুছে ফেলা হয়েছে"); load(); };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="p-6 gradient-card">
        <h3 className="font-bold mb-4">{editing ? "পরীক্ষা এডিট" : "নতুন পরীক্ষা যোগ করুন"}</h3>
        <div className="space-y-3">
          <Input placeholder="পরীক্ষার শিরোনাম" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Textarea placeholder="বিবরণ (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input placeholder="পরীক্ষার URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
          <Input type="date" value={form.publish_date} onChange={(e) => setForm({ ...form, publish_date: e.target.value })} />
          <div className="flex gap-2">
            <Button onClick={save} className="gradient-hero text-primary-foreground border-0 flex-1">{editing ? "আপডেট" : "যোগ করুন"}</Button>
            {editing && <Button variant="outline" onClick={reset}>বাতিল</Button>}
          </div>
        </div>
      </Card>
      <Card className="p-6 gradient-card">
        <h3 className="font-bold mb-4">সকল পরীক্ষা ({list.length})</h3>
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {list.map((e) => (
            <div key={e.id} className="flex justify-between items-center p-3 rounded-lg border border-border gap-2">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{e.title}</div>
                <div className="text-xs text-muted-foreground truncate">{e.url}</div>
              </div>
              <div className="flex gap-1 shrink-0">
                <VisibilityToggle visible={e.is_visible} onChange={(v) => toggleVis(e.id, v)} />
                <Button size="icon" variant="ghost" onClick={() => startEdit(e)}><Pencil className="h-4 w-4" /></Button>
                <ConfirmDelete onConfirm={() => del(e.id)} label="এই পরীক্ষা" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* --------- COURSES --------- */
function CoursesTab() {
  const [list, setList] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const empty = { title: "", description: "", class_level: "", subject: "", price: "0", thumbnail_url: "" };
  const [form, setForm] = useState(empty);

  const load = async () => {
    const { data } = await supabase.from("courses").select("*").order("created_at", { ascending: false });
    setList(data || []);
  };
  useEffect(() => { load(); }, []);

  const reset = () => { setEditing(null); setForm(empty); };
  const save = async () => {
    if (!form.title || !form.class_level) return toast.error("শিরোনাম ও ক্লাস দিন");
    const payload = { ...form, price: Number(form.price) || 0 };
    if (editing) {
      const { error } = await supabase.from("courses").update(payload).eq("id", editing.id);
      if (error) return toast.error(error.message);
      toast.success("আপডেট হয়েছে");
    } else {
      const { error } = await supabase.from("courses").insert(payload);
      if (error) return toast.error(error.message);
      toast.success("কোর্স যোগ হয়েছে");
    }
    reset(); load();
  };
  const startEdit = (c: any) => { setEditing(c); setForm({ title: c.title, description: c.description || "", class_level: c.class_level, subject: c.subject || "", price: String(c.price), thumbnail_url: c.thumbnail_url || "" }); };
  const toggleVis = async (id: string, v: boolean) => { await supabase.from("courses").update({ is_visible: v }).eq("id", id); load(); };
  const del = async (id: string) => { await supabase.from("courses").delete().eq("id", id); toast.success("মুছে ফেলা হয়েছে"); load(); };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="p-6 gradient-card">
        <h3 className="font-bold mb-4">{editing ? "কোর্স এডিট" : "নতুন কোর্স যোগ করুন"}</h3>
        <div className="space-y-3">
          <Input placeholder="কোর্সের নাম" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Textarea placeholder="বিবরণ" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="ক্লাস (e.g. 9)" value={form.class_level} onChange={(e) => setForm({ ...form, class_level: e.target.value })} />
            <Input placeholder="বিষয় / সময়কাল" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          </div>
          <Input type="number" placeholder="মূল্য (৳)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <Input placeholder="থাম্বনেইল URL (optional)" value={form.thumbnail_url} onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })} />
          <div className="flex gap-2">
            <Button onClick={save} className="gradient-hero text-primary-foreground border-0 flex-1">{editing ? "আপডেট" : "যোগ করুন"}</Button>
            {editing && <Button variant="outline" onClick={reset}>বাতিল</Button>}
          </div>
        </div>
      </Card>
      <Card className="p-6 gradient-card">
        <h3 className="font-bold mb-4">সকল কোর্স ({list.length})</h3>
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {list.map((c) => (
            <div key={c.id} className="flex justify-between items-center p-3 rounded-lg border border-border gap-2">
              <div className="min-w-0 flex-1">
                <div className="font-medium text-sm truncate">{c.title}</div>
                <div className="text-xs text-muted-foreground">ক্লাস {c.class_level} • ৳{c.price}</div>
              </div>
              <div className="flex gap-1 shrink-0">
                <VisibilityToggle visible={c.is_visible} onChange={(v) => toggleVis(c.id, v)} />
                <Button size="icon" variant="ghost" onClick={() => startEdit(c)}><Pencil className="h-4 w-4" /></Button>
                <ConfirmDelete onConfirm={() => del(c.id)} label="এই কোর্স" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* --------- TEACHERS --------- */
function TeachersTab() {
  const [list, setList] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const empty = { name: "", expertise: "", class_range: "", photo_url: "" };
  const [form, setForm] = useState(empty);

  const load = async () => {
    const { data } = await supabase.from("teachers").select("*").order("display_order");
    setList(data || []);
  };
  useEffect(() => { load(); }, []);

  const reset = () => { setEditing(null); setForm(empty); };
  const save = async () => {
    if (!form.name || !form.expertise || !form.class_range) return toast.error("সব ঘর পূরণ করুন");
    if (editing) {
      const { error } = await supabase.from("teachers").update(form).eq("id", editing.id);
      if (error) return toast.error(error.message);
      toast.success("আপডেট হয়েছে");
    } else {
      const { error } = await supabase.from("teachers").insert(form);
      if (error) return toast.error(error.message);
      toast.success("শিক্ষক যোগ হয়েছে");
    }
    reset(); load();
  };
  const startEdit = (t: any) => { setEditing(t); setForm({ name: t.name, expertise: t.expertise, class_range: t.class_range, photo_url: t.photo_url || "" }); };
  const toggleVis = async (id: string, v: boolean) => { await supabase.from("teachers").update({ is_visible: v }).eq("id", id); load(); };
  const del = async (id: string) => { await supabase.from("teachers").delete().eq("id", id); toast.success("মুছে ফেলা হয়েছে"); load(); };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="p-6 gradient-card">
        <h3 className="font-bold mb-4">{editing ? "শিক্ষক এডিট" : "নতুন শিক্ষক যোগ করুন"}</h3>
        <div className="space-y-3">
          <Input placeholder="নাম" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="বিশেষজ্ঞতা (e.g. Expert in Math, Physics)" value={form.expertise} onChange={(e) => setForm({ ...form, expertise: e.target.value })} />
          <Input placeholder="ক্লাস রেঞ্জ (e.g. Class 1 to 12)" value={form.class_range} onChange={(e) => setForm({ ...form, class_range: e.target.value })} />
          <Input placeholder="ছবি URL (optional)" value={form.photo_url} onChange={(e) => setForm({ ...form, photo_url: e.target.value })} />
          <div className="flex gap-2">
            <Button onClick={save} className="gradient-hero text-primary-foreground border-0 flex-1">{editing ? "আপডেট" : "যোগ করুন"}</Button>
            {editing && <Button variant="outline" onClick={reset}>বাতিল</Button>}
          </div>
        </div>
      </Card>
      <Card className="p-6 gradient-card">
        <h3 className="font-bold mb-4">সকল শিক্ষক ({list.length})</h3>
        <div className="space-y-2">
          {list.map((t) => (
            <div key={t.id} className="flex justify-between items-center p-3 rounded-lg border border-border gap-2">
              <div className="min-w-0 flex-1">
                <div className="font-medium text-sm truncate">{t.name}</div>
                <div className="text-xs text-muted-foreground truncate">{t.expertise} • {t.class_range}</div>
              </div>
              <div className="flex gap-1 shrink-0">
                <VisibilityToggle visible={t.is_visible} onChange={(v) => toggleVis(t.id, v)} />
                <Button size="icon" variant="ghost" onClick={() => startEdit(t)}><Pencil className="h-4 w-4" /></Button>
                <ConfirmDelete onConfirm={() => del(t.id)} label="এই শিক্ষক" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* --------- CLASS LINKS --------- */
function ClassLinksTab() {
  const [list, setList] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const empty = { title: "", url: "", type: "free" };
  const [form, setForm] = useState(empty);

  const load = async () => {
    const { data } = await supabase.from("class_links").select("*").order("created_at", { ascending: false });
    setList(data || []);
  };
  useEffect(() => { load(); }, []);

  const reset = () => { setEditing(null); setForm(empty); };
  const save = async () => {
    if (!form.title || !form.url) return toast.error("শিরোনাম ও লিংক দিন");
    if (editing) {
      const { error } = await supabase.from("class_links").update(form).eq("id", editing.id);
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from("class_links").insert(form);
      if (error) return toast.error(error.message);
    }
    toast.success("সম্পন্ন"); reset(); load();
  };
  const startEdit = (c: any) => { setEditing(c); setForm({ title: c.title, url: c.url, type: c.type }); };
  const toggleVis = async (id: string, v: boolean) => { await supabase.from("class_links").update({ is_visible: v }).eq("id", id); load(); };
  const del = async (id: string) => { await supabase.from("class_links").delete().eq("id", id); load(); };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="p-6 gradient-card">
        <h3 className="font-bold mb-4">{editing ? "ক্লাস লিংক এডিট" : "নতুন ফ্রি ক্লাস / ভিডিও লিংক"}</h3>
        <div className="space-y-3">
          <Input placeholder="শিরোনাম" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input placeholder="YouTube / ভিডিও লিংক" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
          <div className="flex gap-2">
            <Button onClick={save} className="gradient-hero text-primary-foreground border-0 flex-1">{editing ? "আপডেট" : "যোগ করুন"}</Button>
            {editing && <Button variant="outline" onClick={reset}>বাতিল</Button>}
          </div>
        </div>
      </Card>
      <Card className="p-6 gradient-card">
        <h3 className="font-bold mb-4">সকল ক্লাস লিংক ({list.length})</h3>
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {list.map((c) => (
            <div key={c.id} className="flex justify-between items-center p-3 rounded-lg border border-border gap-2">
              <div className="min-w-0 flex-1">
                <div className="font-medium text-sm truncate">{c.title}</div>
                <div className="text-xs text-muted-foreground truncate">{c.url}</div>
              </div>
              <div className="flex gap-1 shrink-0">
                <VisibilityToggle visible={c.is_visible} onChange={(v) => toggleVis(c.id, v)} />
                <Button size="icon" variant="ghost" onClick={() => startEdit(c)}><Pencil className="h-4 w-4" /></Button>
                <ConfirmDelete onConfirm={() => del(c.id)} label="এই লিংক" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* --------- SITE INFO --------- */
function SiteInfoTab() {
  const [list, setList] = useState<any[]>([]);
  const load = async () => {
    const { data } = await supabase.from("site_settings").select("*").order("key");
    setList(data || []);
  };
  useEffect(() => { load(); }, []);

  const update = async (id: string, value: string, is_visible: boolean) => {
    const { error } = await supabase.from("site_settings").update({ value, is_visible }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("সংরক্ষণ হয়েছে"); load();
  };

  return (
    <Card className="p-6 gradient-card">
      <h3 className="font-bold mb-4">সাইট তথ্য (জিমেইল, হোয়াটসঅ্যাপ, ইউটিউব, ঠিকানা)</h3>
      <div className="space-y-4">
        {list.map((s) => <SettingRow key={s.id} item={s} onSave={update} />)}
      </div>
    </Card>
  );
}
function SettingRow({ item, onSave }: { item: any; onSave: (id: string, v: string, vis: boolean) => void }) {
  const [v, setV] = useState(item.value);
  const [vis, setVis] = useState(item.is_visible);
  return (
    <div className="grid md:grid-cols-[180px_1fr_auto_auto] gap-2 items-center p-3 rounded-lg border border-border">
      <div className="text-sm font-medium">{item.label || item.key}</div>
      <Input value={v} onChange={(e) => setV(e.target.value)} />
      <div className="flex items-center gap-2">
        <Switch checked={vis} onCheckedChange={setVis} />
        <span className="text-xs text-muted-foreground">{vis ? "দেখানো হচ্ছে" : "লুকানো"}</span>
      </div>
      <Button size="sm" onClick={() => onSave(item.id, v, vis)} className="gradient-hero text-primary-foreground border-0">সেভ</Button>
    </div>
  );
}

/* --------- SOCIAL --------- */
function SocialTab() {
  const [list, setList] = useState<any[]>([]);
  const load = async () => { const { data } = await supabase.from("social_links").select("*").order("platform"); setList(data || []); };
  useEffect(() => { load(); }, []);
  const update = async (id: string, url: string, is_visible: boolean) => {
    const { error } = await supabase.from("social_links").update({ url, is_visible }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("সংরক্ষণ হয়েছে"); load();
  };
  return (
    <Card className="p-6 gradient-card">
      <h3 className="font-bold mb-4">সোশ্যাল লিংক (ফুটার)</h3>
      <div className="space-y-4">
        {list.map((s) => <SettingRow key={s.id} item={{ ...s, label: s.platform.replace("_"," ").toUpperCase(), value: s.url }} onSave={update} />)}
      </div>
    </Card>
  );
}

/* --------- MESSAGES --------- */
function MessagesTab() {
  const [list, setList] = useState<any[]>([]);
  const load = async () => { const { data } = await supabase.from("messages").select("*").order("created_at", { ascending: false }); setList(data || []); };
  useEffect(() => { load(); }, []);
  const del = async (id: string) => { await supabase.from("messages").delete().eq("id", id); load(); };
  return (
    <Card className="p-6 gradient-card">
      <h3 className="font-bold mb-4">যোগাযোগ মেসেজ ({list.length})</h3>
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {list.map((m) => (
          <div key={m.id} className="p-4 rounded-lg border border-border">
            <div className="flex justify-between items-start gap-2 mb-2">
              <div>
                <div className="font-medium text-sm">{m.name}</div>
                <a href={`mailto:${m.email}`} className="text-xs text-primary hover:underline">{m.email}</a>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString("bn-BD")}</span>
                <ConfirmDelete onConfirm={() => del(m.id)} label="এই মেসেজ" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{m.message}</p>
          </div>
        ))}
        {list.length === 0 && <p className="text-center text-muted-foreground py-8">কোনো মেসেজ নেই</p>}
      </div>
    </Card>
  );
}

/* --------- USERS --------- */
function UsersTab() {
  const [list, setList] = useState<any[]>([]);
  const [roles, setRoles] = useState<Record<string, string[]>>({});
  const load = async () => {
    const { data: profiles } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    const { data: r } = await supabase.from("user_roles").select("*");
    const byUser: Record<string, string[]> = {};
    (r || []).forEach((row: any) => { (byUser[row.user_id] ||= []).push(row.role); });
    setRoles(byUser); setList(profiles || []);
  };
  useEffect(() => { load(); }, []);
  const toggleAdmin = async (userId: string, isAdmin: boolean) => {
    if (isAdmin) await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
    else await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
    toast.success("ভূমিকা আপডেট"); load();
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
                <div className="text-xs text-muted-foreground">{u.email}</div>
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
