import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

export function ImageUpload({ value, onChange, folder = "uploads", label = "ছবি" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("শুধু ছবি আপলোড করা যাবে");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("ছবির সাইজ ৫ MB এর কম হতে হবে");
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("media").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (error) {
      toast.error(error.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("media").getPublicUrl(path);
    onChange(data.publicUrl);
    toast.success("ছবি আপলোড হয়েছে");
    setUploading(false);
  };

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">{label}</div>
      {value && (
        <div className="relative inline-block">
          <img src={value} alt="preview" className="h-24 w-24 object-cover rounded-lg border border-border" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow"
            aria-label="remove"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Upload className="h-4 w-4 mr-1" />}
          {uploading ? "আপলোড হচ্ছে..." : value ? "পরিবর্তন করুন" : "ছবি আপলোড"}
        </Button>
        <Input
          placeholder="অথবা URL পেস্ট করুন"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
        />
      </div>
    </div>
  );
}
