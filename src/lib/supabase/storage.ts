import { createSupabaseClient } from "~/lib/supabase/client";
import { createSupabaseServerClient } from "~/lib/supabase/server";

// server-side storage operations
export const createStorageServerClient = async () => {
  const supabase = await createSupabaseServerClient();
  return supabase.storage;
};

// client-side storage operations
export const createStorageClient = async () => {
  const supabase = await createSupabaseClient();
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
  const storage = await createStorageClient();

  return await storage.from(bucket).upload(path, file, {
    cacheControl: options?.cacheControl || "3600",
    contentType: options?.contentType || file.type,
    upsert: options?.upsert || false,
  });
};

// delete file from supabase storage
export const deleteFile = async (bucket: string, path: string) => {
  const storage = await createStorageServerClient();
  return await storage.from(bucket).remove([path]);
};

// get public url for file
export const getPublicUrl = async (bucket: string, path: string) => {
  const storage = await createStorageClient();
  const { data } = storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

// generate signed url for private files
export const getSignedUrl = async (
  bucket: string,
  path: string,
  expiresIn = 3600,
) => {
  const storage = await createStorageServerClient();
  return await storage.from(bucket).createSignedUrl(path, expiresIn);
};
