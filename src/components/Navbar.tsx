import { Link, useNavigate } from "@tanstack/react-router";
import { Moon, Sun, GraduationCap, Menu, X, Download, LogOut, LayoutDashboard, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";
import { useInstallPrompt } from "@/hooks/use-install-prompt";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const navItems = [
  { label: "হোম", to: "/" },
  { label: "কোর্স", to: "/courses" },
  { label: "শিক্ষক", to: "/teachers" },
  { label: "ফ্রি ক্লাস", to: "/free-classes" },
  { label: "পরীক্ষা", to: "/exam" },
  { label: "নোটিশ", to: "/notices" },
  { label: "যোগাযোগ", to: "/contact" },
  { label: "অ্যাডমিন", to: "/admin/login" },
];

export function Navbar() {
  const { theme, toggle } = useTheme();
  const { user, role, signOut } = useAuth();
  const { canInstall, installed, promptInstall } = useInstallPrompt();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
      <nav className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-9 h-9 rounded-xl gradient-hero flex items-center justify-center shadow-glow">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-gradient">MNS Academy</span>
        </Link>

        <ul className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className="px-4 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:text-primary hover:bg-accent transition-colors"
                activeProps={{ className: "px-4 py-2 rounded-lg text-sm font-medium text-primary bg-accent" }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5">
          {!installed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={promptInstall}
              aria-label="ইনস্টল অ্যাপ"
              title={canInstall ? "অ্যাপ ইনস্টল করুন" : "Add to Home Screen"}
              className="text-primary"
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full gradient-hero text-primary-foreground">
                  <UserIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-xs text-muted-foreground truncate">{user.email}</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile"><UserIcon className="h-4 w-4 mr-2" /> আমার প্রোফাইল</Link>
                </DropdownMenuItem>
                {role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin"><LayoutDashboard className="h-4 w-4 mr-2" /> অ্যাডমিন প্যানেল</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" /> লগআউট
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login" className="hidden sm:block">
                <Button variant="ghost" size="sm">লগইন</Button>
              </Link>
              <Link to="/signup" className="hidden sm:block">
                <Button size="sm" className="gradient-hero text-primary-foreground border-0 shadow-soft hover:shadow-glow transition-all">
                  সাইন আপ
                </Button>
              </Link>
            </>
          )}

          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <ul className="container mx-auto py-3 px-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-accent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {!user && (
              <li className="flex gap-2 pt-2 border-t border-border mt-2">
                <Link to="/login" className="flex-1" onClick={() => setOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">লগইন</Button>
                </Link>
                <Link to="/signup" className="flex-1" onClick={() => setOpen(false)}>
                  <Button size="sm" className="w-full gradient-hero text-primary-foreground border-0">সাইন আপ</Button>
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
