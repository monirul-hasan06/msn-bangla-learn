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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2, Plus, Trash2, Bell, BookOpen, Users, ShieldCheck, GraduationCap, Settings, Share2, Video, FileText, MessageSquare, Pencil, Eye, EyeOff, Ban, Send } from "lucide-react";
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
              <TabsTrigger value="enrolled"><Users className="h-4 w-4 mr-1.5" /> ভর্তিকৃত</TabsTrigger>
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
            <TabsContent value="enrolled"><EnrolledTab /></TabsContent>
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

function useCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  useEffect(() => {
    supabase.from("courses").select("id,title,class_level").order("title").then(({ data }) => setCourses(data || []));
  }, []);
  return courses;
}

function CourseSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const courses = useCourses();
  return (
    <div>
      <Label className="text-xs text-muted-foreground">টার্গেট কোর্স (ফাঁকা = সবার জন্য)</Label>
      <Select value={value || "__all__"} onValueChange={(v) => onChange(v === "__all__" ? "" : v)}>
        <SelectTrigger className="mt-1.5"><SelectValue placeholder="সবার জন্য" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">— সবার জন্য (পাবলিক) —</SelectItem>
          {courses.map((c) => <SelectItem key={c.id} value={c.id}>{c.title} (ক্লাস {c.class_level})</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}

/* --------- NOTICES --------- */
function NoticesTab() {
  const [list, setList] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [title, setTitle] = useState(""); const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [pinned, setPinned] = useState(false); const [broadcast, setBroadcast] = useState(true);
  const [courseId, setCourseId] = useState("");

  const load = async () => {
    const { data } = await supabase.from("notices").select("*").order("created_at", { ascending: false });
    setList(data || []);
  };
  useEffect(() => { load(); }, []);

  const reset = () => { setEditing(null); setTitle(""); setContent(""); setImageUrl(""); setPinned(false); setCourseId(""); };

  const save = async () => {
    if (!title || !content) return toast.error("সব ঘর পূরণ করুন");
    const payload: any = { title, content, is_pinned: pinned, image_url: imageUrl || null, course_id: courseId || null };
    if (editing) {
      const { error } = await supabase.from("notices").update(payload).eq("id", editing.id);
      if (error) return toast.error(error.message);
      toast.success("আপডেট হয়েছে");
    } else {
      const { error } = await supabase.from("notices").insert(payload);
      if (error) return toast.error(error.message);
      if (broadcast) await supabase.from("notifications").insert({ title, body: content, link: "/notices", course_id: courseId || null });
      toast.success(courseId ? "ভর্তিকৃতদের জন্য নোটিশ পোস্ট হয়েছে" : "নোটিশ পোস্ট হয়েছে");
    }
    reset(); load();
  };

  const startEdit = (n: any) => { setEditing(n); setTitle(n.title); setContent(n.content); setImageUrl(n.image_url || ""); setPinned(n.is_pinned); setCourseId(n.course_id || ""); };
  const toggleVis = async (id: string, v: boolean) => { await supabase.from("notices").update({ is_visible: v }).eq("id", id); load(); };
  const del = async (id: string) => { await supabase.from("notices").delete().eq("id", id); toast.success("মুছে ফেলা হয়েছে"); load(); };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="p-6 gradient-card">
        <h3 className="font-bold mb-4">{editing ? "নোটিশ এডিট করুন" : "নতুন নোটিশ পোস্ট করুন"}</h3>
        <div className="space-y-3">
          <div><Label>শিরোনাম</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1.5" /></div>
          <div><Label>বিস্তারিত</Label><Textarea rows={5} value={content} onChange={(e) => setContent(e.target.value)} className="mt-1.5" /></div>
          <CourseSelect value={courseId} onChange={setCourseId} />
          <ImageUpload value={imageUrl} onChange={setImageUrl} folder="notices" label="নোটিশ ছবি (optional)" />
          <div className="flex items-center gap-3"><Switch checked={pinned} onCheckedChange={setPinned} id="pin" /><Label htmlFor="pin">পিন করুন</Label></div>
          {!editing && <div className="flex items-center gap-3"><Switch checked={broadcast} onCheckedChange={setBroadcast} id="bc" /><Label htmlFor="bc">নোটিফিকেশন পাঠান</Label></div>}
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
                {n.image_url && <img src={n.image_url} alt="" className="w-12 h-12 rounded object-cover shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{n.title} {n.is_pinned && <Badge variant="outline" className="ml-1 text-xs">📌</Badge>} {n.course_id && <Badge className="ml-1 text-xs" variant="secondary">কোর্স</Badge>}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2">{n.content}</div>
                </div>
                <div className="flex gap-1 shrink-0">
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
  const empty = { title: "", description: "", url: "", image_url: "", publish_date: new Date().toISOString().slice(0,10), course_id: "" };
  const [form, setForm] = useState(empty);

  const load = async () => {
    const { data } = await supabase.from("exam_links").select("*").order("publish_date", { ascending: false });
    setList(data || []);
  };
  useEffect(() => { load(); }, []);

  const reset = () => { setEditing(null); setForm(empty); };

  const save = async () => {
    if (!form.title || !form.url) return toast.error("শিরোনাম ও লিংক দিন");
    const payload = { title: form.title, description: form.description, url: form.url, image_url: form.image_url || null, publish_date: new Date(form.publish_date).toISOString(), course_id: form.course_id || null };
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
  const startEdit = (e: any) => { setEditing(e); setForm({ title: e.title, description: e.description || "", url: e.url, image_url: e.image_url || "", publish_date: e.publish_date.slice(0,10), course_id: e.course_id || "" }); };
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
          <CourseSelect value={form.course_id} onChange={(v) => setForm({ ...form, course_id: v })} />
          <ImageUpload value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} folder="exams" label="পরীক্ষার ছবি (optional)" />
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
                <div className="font-medium text-sm truncate">{e.title} {e.course_id && <Badge variant="secondary" className="ml-1 text-xs">কোর্স</Badge>}</div>
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
          <ImageUpload value={form.thumbnail_url} onChange={(v) => setForm({ ...form, thumbnail_url: v })} folder="courses" label="কোর্স থাম্বনেইল (optional)" />
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

/* --------- ENROLLED (per-course management) --------- */
function EnrolledTab() {
  const courses = useCourses();
  const [courseId, setCourseId] = useState("");
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Record<string, any>>({});

  const load = async () => {
    if (!courseId) return setEnrollments([]);
    const { data } = await supabase.from("enrollments").select("*").eq("course_id", courseId).order("created_at", { ascending: false });
    setEnrollments(data || []);
    const ids = (data || []).map((e: any) => e.user_id);
    if (ids.length) {
      const { data: pr } = await supabase.from("profiles").select("*").in("id", ids);
      const map: Record<string, any> = {};
      (pr || []).forEach((p: any) => { map[p.id] = p; });
      setProfiles(map);
    } else setProfiles({});
  };
  useEffect(() => { load(); }, [courseId]);

  const setStatus = async (id: string, status: string) => {
    await supabase.from("enrollments").update({ status }).eq("id", id);
    toast.success("স্ট্যাটাস আপডেট হয়েছে"); load();
  };
  const removeEnrollment = async (id: string) => {
    await supabase.from("enrollments").delete().eq("id", id);
    toast.success("ভর্তি বাতিল হয়েছে"); load();
  };
  const sendNotice = async (title: string, body: string) => {
    if (!courseId) return;
    await supabase.from("notifications").insert({ title, body, link: "/notices", course_id: courseId });
    toast.success("নোটিফিকেশন পাঠানো হয়েছে");
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 gradient-card">
        <h3 className="font-bold mb-4">কোর্স নির্বাচন করুন</h3>
        <Select value={courseId} onValueChange={setCourseId}>
          <SelectTrigger><SelectValue placeholder="একটি কোর্স বেছে নিন..." /></SelectTrigger>
          <SelectContent>
            {courses.map((c) => <SelectItem key={c.id} value={c.id}>{c.title} (ক্লাস {c.class_level})</SelectItem>)}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-2">নোটিশ / ক্লাস লিংক / পরীক্ষা ট্যাবে এই কোর্স টার্গেট করে পোস্ট করুন — শুধু ভর্তিকৃত শিক্ষার্থীরা দেখবে।</p>
      </Card>

      {courseId && (
        <>
          <QuickPushCard courseId={courseId} onPushNotice={sendNotice} />
          <Card className="p-6 gradient-card">
            <h3 className="font-bold mb-4">ভর্তিকৃত শিক্ষার্থী ({enrollments.length})</h3>
            <div className="space-y-2">
              {enrollments.length === 0 && <p className="text-sm text-muted-foreground">এই কোর্সে কোনো ভর্তি নেই।</p>}
              {enrollments.map((en) => {
                const p = profiles[en.user_id] || {};
                return (
                  <div key={en.id} className="flex flex-col sm:flex-row justify-between gap-2 p-3 rounded-lg border border-border">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {p.avatar_url ? <img src={p.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover" /> : <div className="w-9 h-9 rounded-full bg-muted" />}
                      <div className="min-w-0">
                        <div className="font-medium text-sm truncate">{p.full_name || "নামহীন"}</div>
                        <div className="text-xs text-muted-foreground truncate">{p.email} {p.phone && <>• {p.phone}</>}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={en.status === "approved" ? "default" : "secondary"} className={en.status === "approved" ? "bg-success" : ""}>
                        {en.status}
                      </Badge>
                      <Select value={en.status} onValueChange={(v) => setStatus(en.id, v)}>
                        <SelectTrigger className="h-8 w-[130px] text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">অপেক্ষমাণ</SelectItem>
                          <SelectItem value="approved">অনুমোদিত</SelectItem>
                          <SelectItem value="rejected">প্রত্যাখ্যাত</SelectItem>
                        </SelectContent>
                      </Select>
                      <ConfirmDelete onConfirm={() => removeEnrollment(en.id)} label="এই ভর্তি" />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

function QuickPushCard({ courseId, onPushNotice }: { courseId: string; onPushNotice: (t: string, b: string) => void }) {
  const [tab, setTab] = useState<"notice" | "class" | "exam">("notice");
  const [title, setTitle] = useState(""); const [body, setBody] = useState(""); const [url, setUrl] = useState("");
  const submit = async () => {
    if (!title) return toast.error("শিরোনাম দিন");
    if (tab === "notice") {
      const { error } = await supabase.from("notices").insert({ title, content: body, course_id: courseId });
      if (error) return toast.error(error.message);
      onPushNotice(title, body);
    } else if (tab === "class") {
      if (!url) return toast.error("ক্লাস লিংক দিন");
      const { error } = await supabase.from("class_links").insert({ title, url, course_id: courseId, type: "paid" });
      if (error) return toast.error(error.message);
    } else {
      if (!url) return toast.error("পরীক্ষার লিংক দিন");
      const { error } = await supabase.from("exam_links").insert({ title, url, description: body, course_id: courseId });
      if (error) return toast.error(error.message);
    }
    toast.success("ভর্তিকৃতদের জন্য পাঠানো হয়েছে");
    setTitle(""); setBody(""); setUrl("");
  };
  return (
    <Card className="p-6 gradient-card">
      <h3 className="font-bold mb-3">দ্রুত পাঠান (শুধু ভর্তিকৃতদের জন্য)</h3>
      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        <TabsList>
          <TabsTrigger value="notice">নোটিশ</TabsTrigger>
          <TabsTrigger value="class">ক্লাস লিংক</TabsTrigger>
          <TabsTrigger value="exam">পরীক্ষা</TabsTrigger>
        </TabsList>
        <div className="space-y-3 mt-4">
          <Input placeholder="শিরোনাম" value={title} onChange={(e) => setTitle(e.target.value)} />
          {tab !== "notice" && <Input placeholder="URL / লিংক" value={url} onChange={(e) => setUrl(e.target.value)} />}
          <Textarea placeholder={tab === "notice" ? "বিস্তারিত" : "বিবরণ (optional)"} value={body} onChange={(e) => setBody(e.target.value)} />
          <Button onClick={submit} className="gradient-hero text-primary-foreground border-0">
            <Send className="h-4 w-4 mr-1" /> পাঠান
          </Button>
        </div>
      </Tabs>
    </Card>
  );
}

/* --------- TEACHERS --------- */
function TeachersTab() {
  const [list, setList] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const empty = { name: "", expertise: "", class_range: "", photo_url: "", display_order: 0 };
  const [form, setForm] = useState<any>(empty);

  const load = async () => {
    const { data } = await supabase.from("teachers").select("*").order("display_order");
    setList(data || []);
  };
  useEffect(() => { load(); }, []);

  const reset = () => { setEditing(null); setForm(empty); };
  const save = async () => {
    if (!form.name || !form.expertise || !form.class_range) return toast.error("সব ঘর পূরণ করুন");
    const payload = { ...form, display_order: Number(form.display_order) || 0 };
    if (editing) {
      const { error } = await supabase.from("teachers").update(payload).eq("id", editing.id);
      if (error) return toast.error(error.message);
      toast.success("আপডেট হয়েছে");
    } else {
      const { error } = await supabase.from("teachers").insert(payload);
      if (error) return toast.error(error.message);
      toast.success("শিক্ষক যোগ হয়েছে");
    }
    reset(); load();
  };
  const startEdit = (t: any) => { setEditing(t); setForm({ name: t.name, expertise: t.expertise, class_range: t.class_range, photo_url: t.photo_url || "", display_order: t.display_order || 0 }); };
  const toggleVis = async (id: string, v: boolean) => { await supabase.from("teachers").update({ is_visible: v }).eq("id", id); load(); };
  const del = async (id: string) => { await supabase.from("teachers").delete().eq("id", id); toast.success("মুছে ফেলা হয়েছে"); load(); };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="p-4 sm:p-6 gradient-card">
        <h3 className="font-bold mb-4">{editing ? "শিক্ষক এডিট" : "নতুন শিক্ষক যোগ করুন"}</h3>
        <div className="space-y-3">
          <div><Label>নাম</Label><Input className="mt-1.5" placeholder="শিক্ষকের নাম" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><Label>বিশেষজ্ঞতা</Label><Input className="mt-1.5" placeholder="যেমন: গণিত, পদার্থ" value={form.expertise} onChange={(e) => setForm({ ...form, expertise: e.target.value })} /></div>
          <div><Label>ক্লাস রেঞ্জ</Label><Input className="mt-1.5" placeholder="যেমন: ৬-১০" value={form.class_range} onChange={(e) => setForm({ ...form, class_range: e.target.value })} /></div>
          <div><Label>ক্রম (ছোট = আগে)</Label><Input className="mt-1.5" type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: e.target.value })} /></div>
          <ImageUpload value={form.photo_url} onChange={(v) => setForm({ ...form, photo_url: v })} folder="teachers" label="শিক্ষকের ছবি" />
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button onClick={save} className="gradient-hero text-primary-foreground border-0 flex-1">{editing ? "আপডেট করুন" : "যোগ করুন"}</Button>
            {editing && <Button variant="outline" onClick={reset}>বাতিল</Button>}
          </div>
        </div>
      </Card>
      <Card className="p-4 sm:p-6 gradient-card">
        <h3 className="font-bold mb-4">সকল শিক্ষক ({list.length})</h3>
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {list.map((t) => (
            <div key={t.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg border border-border">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {t.photo_url ? <img src={t.photo_url} alt="" className="w-12 h-12 rounded-full object-cover shrink-0" /> : <div className="w-12 h-12 rounded-full bg-muted shrink-0" />}
                <div className="min-w-0">
                  <div className="font-medium text-sm truncate">{t.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{t.expertise} • {t.class_range}</div>
                </div>
              </div>
              <div className="flex gap-1 shrink-0 self-end sm:self-auto">
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
  const empty = { title: "", url: "", type: "free", image_url: "", course_id: "" };
  const [form, setForm] = useState(empty);

  const load = async () => {
    const { data } = await supabase.from("class_links").select("*").order("created_at", { ascending: false });
    setList(data || []);
  };
  useEffect(() => { load(); }, []);

  const reset = () => { setEditing(null); setForm(empty); };
  const save = async () => {
    if (!form.title || !form.url) return toast.error("শিরোনাম ও লিংক দিন");
    const payload = { title: form.title, url: form.url, type: form.type, image_url: form.image_url || null, course_id: form.course_id || null };
    if (editing) {
      const { error } = await supabase.from("class_links").update(payload).eq("id", editing.id);
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from("class_links").insert(payload);
      if (error) return toast.error(error.message);
    }
    toast.success("সম্পন্ন"); reset(); load();
  };
  const startEdit = (c: any) => { setEditing(c); setForm({ title: c.title, url: c.url, type: c.type, image_url: c.image_url || "", course_id: c.course_id || "" }); };
  const toggleVis = async (id: string, v: boolean) => { await supabase.from("class_links").update({ is_visible: v }).eq("id", id); load(); };
  const del = async (id: string) => { await supabase.from("class_links").delete().eq("id", id); load(); };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="p-6 gradient-card">
        <h3 className="font-bold mb-4">{editing ? "ক্লাস লিংক এডিট" : "নতুন ক্লাস লিংক"}</h3>
        <div className="space-y-3">
          <Input placeholder="শিরোনাম" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input placeholder="YouTube / ভিডিও / ক্লাস লিংক" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
          <CourseSelect value={form.course_id} onChange={(v) => setForm({ ...form, course_id: v })} />
          <ImageUpload value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} folder="classes" label="ক্লাস কভার ছবি (optional)" />
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
                <div className="font-medium text-sm truncate">{c.title} {c.course_id && <Badge variant="secondary" className="ml-1 text-xs">কোর্স</Badge>}</div>
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
      <h3 className="font-bold mb-4">সাইট তথ্য (জিমেইল, হোয়াটসঅ্যাপ, ব্যানার, ঠিকানা)</h3>
      <div className="space-y-4">
        {list.map((s) => <SettingRow key={s.id} item={s} onSave={update} />)}
      </div>
    </Card>
  );
}
function SettingRow({ item, onSave }: { item: any; onSave: (id: string, v: string, vis: boolean) => void }) {
  const [v, setV] = useState(item.value);
  const [vis, setVis] = useState(item.is_visible);
  const isImage = /banner|image|logo|photo/i.test(item.key);
  return (
    <div className="grid md:grid-cols-[180px_1fr_auto_auto] gap-2 items-start p-3 rounded-lg border border-border">
      <div className="text-sm font-medium pt-2">{item.label || item.key}</div>
      {isImage ? (
        <ImageUpload value={v} onChange={setV} folder="site" label="" />
      ) : (
        <Input value={v} onChange={(e) => setV(e.target.value)} />
      )}
      <div className="flex items-center gap-2 pt-2">
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
  const markRead = async (id: string, v: boolean) => { await supabase.from("messages").update({ is_read: v }).eq("id", id); load(); };
  const sendReply = async (m: any, reply: string) => {
    await supabase.from("messages").update({ reply, replied_at: new Date().toISOString(), is_read: true }).eq("id", m.id);
    if (m.user_id) {
      await supabase.from("notifications").insert({ user_id: m.user_id, title: "অ্যাডমিন আপনার মেসেজে উত্তর দিয়েছেন", body: reply, link: "/profile" });
    }
    toast.success("উত্তর পাঠানো হয়েছে"); load();
  };
  return (
    <Card className="p-6 gradient-card">
      <h3 className="font-bold mb-4">যোগাযোগ মেসেজ ({list.length})</h3>
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {list.map((m) => <MessageRow key={m.id} m={m} onDelete={() => del(m.id)} onMarkRead={(v) => markRead(m.id, v)} onReply={(r) => sendReply(m, r)} />)}
        {list.length === 0 && <p className="text-center text-muted-foreground py-8">কোনো মেসেজ নেই</p>}
      </div>
    </Card>
  );
}

function MessageRow({ m, onDelete, onMarkRead, onReply }: { m: any; onDelete: () => void; onMarkRead: (v: boolean) => void; onReply: (r: string) => void }) {
  const [reply, setReply] = useState(m.reply || "");
  const [open, setOpen] = useState(false);
  return (
    <div className={`p-4 rounded-lg border ${m.is_read ? "border-border" : "border-primary/40 bg-primary/5"}`}>
      <div className="flex justify-between items-start gap-2 mb-2">
        <div className="min-w-0">
          <div className="font-medium text-sm flex items-center gap-2">{m.name} {!m.is_read && <Badge variant="secondary" className="text-xs">নতুন</Badge>} {m.user_id && <Badge className="text-xs gradient-hero text-primary-foreground border-0">রেজিস্টার্ড</Badge>}</div>
          <a href={`mailto:${m.email}`} className="text-xs text-primary hover:underline">{m.email}</a>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-xs text-muted-foreground hidden sm:inline">{new Date(m.created_at).toLocaleString("bn-BD")}</span>
          <Button size="sm" variant="ghost" onClick={() => onMarkRead(!m.is_read)}>{m.is_read ? "অপঠিত" : "পঠিত"}</Button>
          <ConfirmDelete onConfirm={onDelete} label="এই মেসেজ" />
        </div>
      </div>
      <p className="text-sm text-muted-foreground whitespace-pre-wrap mb-2">{m.message}</p>
      {m.reply && <div className="text-xs p-2 rounded bg-success/10 text-foreground border border-success/30 mb-2"><b>আপনার উত্তর:</b> {m.reply}</div>}
      {!open ? (
        <Button size="sm" variant="outline" onClick={() => setOpen(true)}>{m.reply ? "উত্তর সম্পাদনা" : "উত্তর দিন"}</Button>
      ) : (
        <div className="space-y-2">
          <Textarea rows={2} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="আপনার উত্তর লিখুন..." />
          <div className="flex gap-2">
            <Button size="sm" className="gradient-hero text-primary-foreground border-0" onClick={() => { if (reply.trim()) { onReply(reply.trim()); setOpen(false); } }}>
              <Send className="h-3.5 w-3.5 mr-1" /> পাঠান
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>বাতিল</Button>
          </div>
        </div>
      )}
    </div>
  );
}

/* --------- USERS --------- */
function UsersTab() {
  const [list, setList] = useState<any[]>([]);
  const [roles, setRoles] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

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

  const callAction = async (action: string, user_id: string, days?: number) => {
    const { error } = await supabase.functions.invoke("admin-user-action", { body: { action, user_id, days } });
    if (error) return toast.error(error.message);
    toast.success(action === "delete" ? "অ্যাকাউন্ট মুছে ফেলা হয়েছে" : "সাসপেন্ড আপডেট হয়েছে");
    load();
  };

  const filtered = list.filter((u) =>
    !search || (u.full_name || "").toLowerCase().includes(search.toLowerCase()) || (u.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="p-6 gradient-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h3 className="font-bold">সকল ইউজার ({filtered.length}/{list.length})</h3>
        <Input placeholder="নাম/ইমেইল খুঁজুন..." value={search} onChange={(e) => setSearch(e.target.value)} className="sm:max-w-xs" />
      </div>
      <div className="space-y-2">
        {filtered.map((u) => {
          const isAdmin = roles[u.id]?.includes("admin");
          const suspended = u.suspended_until && new Date(u.suspended_until) > new Date();
          return (
            <div key={u.id} className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 p-3 rounded-lg border border-border">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {u.avatar_url ? <img src={u.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 rounded-full bg-muted" />}
                <div className="min-w-0">
                  <div className="font-medium flex items-center gap-2 flex-wrap">
                    {u.full_name || "নামহীন"}
                    {isAdmin && <Badge className="gradient-hero text-primary-foreground border-0 text-xs">Admin</Badge>}
                    {suspended && <Badge variant="destructive" className="text-xs">সাসপেন্ডেড</Badge>}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                  {suspended && <div className="text-xs text-destructive">পর্যন্ত: {new Date(u.suspended_until).toLocaleDateString("bn-BD")}</div>}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <Button size="sm" variant={isAdmin ? "outline" : "default"} onClick={() => toggleAdmin(u.id, !!isAdmin)} className={!isAdmin ? "gradient-hero text-primary-foreground border-0" : ""}>
                  {isAdmin ? "Admin সরান" : "Admin বানান"}
                </Button>
                <SuspendDialog onConfirm={(d) => callAction("suspend", u.id, d)} suspended={!!suspended} onUnsuspend={() => callAction("suspend", u.id, 0)} />
                <DeleteUserDialog onConfirm={() => callAction("delete", u.id)} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function SuspendDialog({ onConfirm, suspended, onUnsuspend }: { onConfirm: (days: number) => void; suspended: boolean; onUnsuspend: () => void }) {
  const [days, setDays] = useState("7");
  if (suspended) return <Button size="sm" variant="outline" onClick={onUnsuspend}>সাসপেন্ড সরান</Button>;
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="outline"><Ban className="h-3.5 w-3.5 mr-1" /> সাসপেন্ড</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>কত দিনের জন্য সাসপেন্ড করবেন?</AlertDialogTitle>
          <AlertDialogDescription>সাসপেন্ডকৃত ইউজার লগইন করতে পারবে কিন্তু কেনা / ভর্তি হতে পারবে না।</AlertDialogDescription>
        </AlertDialogHeader>
        <Input type="number" min={1} value={days} onChange={(e) => setDays(e.target.value)} />
        <AlertDialogFooter>
          <AlertDialogCancel>বাতিল</AlertDialogCancel>
          <AlertDialogAction onClick={() => onConfirm(Number(days) || 7)}>সাসপেন্ড করুন</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function DeleteUserDialog({ onConfirm }: { onConfirm: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5 mr-1" /> মুছুন</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>স্থায়ীভাবে মুছবেন?</AlertDialogTitle>
          <AlertDialogDescription>এই ইউজারের সব ডেটা স্থায়ীভাবে মুছে যাবে। ফিরিয়ে আনা যাবে না।</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>বাতিল</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-destructive hover:bg-destructive/90">হ্যাঁ, মুছুন</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
