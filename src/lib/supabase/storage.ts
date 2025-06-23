import { createSupabaseClient } from "~/lib/supabase/client";
import { createSupabaseServerClient } from "~/lib/supabase/server";

// server-side storage operations
export const createStorageServerClient = () => {
  const supabase = createSupabaseServerClient();
  return supabase.storage;
};

// client-side storage operations
export const createStorageClient = () => {
  const supabase = createSupabaseClient();
  return supabase.storage;
};

// upload file to supabase storage
export const uploadFile = async (
  bucket: string,
  path: string,
  file: File,
  options?: {
    cacheControl?: string;
    contentType?: string;
    upsert?: boolean;
  },
) => {
  const storage = createStorageClient();

  return await storage.from(bucket).upload(path, file, {
    cacheControl: options?.cacheControl || "3600",
    contentType: options?.contentType || file.type,
    upsert: options?.upsert || false,
  });
};

// delete file from supabase storage
export const deleteFile = async (bucket: string, path: string) => {
  const storage = createStorageServerClient();
  return await storage.from(bucket).remove([path]);
};

// get public url for file
export const getPublicUrl = (bucket: string, path: string) => {
  const storage = createStorageClient();
  const { data } = storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

// generate signed url for private files
export const getSignedUrl = async (
  bucket: string,
  path: string,
  expiresIn = 3600,
) => {
  const storage = createStorageServerClient();
  return await storage.from(bucket).createSignedUrl(path, expiresIn);
};
