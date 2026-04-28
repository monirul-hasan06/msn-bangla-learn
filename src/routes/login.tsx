import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "লগইন — MSN একাডেমি" }] }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center gradient-warm px-4 py-10">
      <Card className="w-full max-w-md p-8 gradient-card border-border/50 shadow-glow">
        <Link to="/" className="flex items-center justify-center gap-2 font-bold text-2xl mb-6">
          <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center shadow-soft">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-gradient">MSN</span>
        </Link>
        <h1 className="text-2xl font-bold text-center mb-2">পুনরায় স্বাগতম</h1>
        <p className="text-sm text-muted-foreground text-center mb-6">আপনার অ্যাকাউন্টে লগইন করুন</p>
        <form className="space-y-4">
          <div>
            <Label htmlFor="email">ইমেইল</Label>
            <Input id="email" type="email" placeholder="email@example.com" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="pwd">পাসওয়ার্ড</Label>
            <Input id="pwd" type="password" placeholder="••••••••" className="mt-1.5" />
          </div>
          <Button type="submit" className="w-full gradient-hero text-primary-foreground border-0 shadow-soft hover:shadow-glow transition-all">লগইন</Button>
          <Button type="button" variant="outline" className="w-full">Google দিয়ে লগইন</Button>
        </form>
        <p className="text-sm text-center text-muted-foreground mt-6">
          অ্যাকাউন্ট নেই? <Link to="/signup" className="text-primary font-medium hover:underline">সাইন আপ করুন</Link>
        </p>
      </Card>
    </div>
  );
}
