import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SiteSetting { key: string; value: string; label: string | null; is_visible: boolean; }
export interface SocialLink { id: string; platform: string; url: string; is_visible: boolean; }

export function useSiteSettings() {
  const [settings, setSettings] = useState<Record<string, SiteSetting>>({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.from("site_settings").select("*").then(({ data }) => {
      const map: Record<string, SiteSetting> = {};
      (data || []).forEach((r: any) => { map[r.key] = r; });
      setSettings(map);
      setLoading(false);
    });
  }, []);
  return { settings, loading };
}

export function useSocialLinks() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  useEffect(() => {
    supabase.from("social_links").select("*").then(({ data }) => setLinks((data as any) || []));
  }, []);
  return links;
}

export function buildWhatsAppLink(number: string, message = "Hello MNS Academy, I need more information.") {
  const digits = (number || "").replace(/\D/g, "");
  // Bangladesh: prefix 88 if local format like 01XXXXXXXXX
  const intl = digits.startsWith("88") ? digits : digits.startsWith("0") ? "88" + digits : digits;
  return `https://wa.me/${intl}?text=${encodeURIComponent(message)}`;
}
