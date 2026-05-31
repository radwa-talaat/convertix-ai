import type { SupabaseDatabaseClient } from "@/services/database/types";

export const pageAssetsBucket = "page-assets";

function buildUserAssetPath(userId: string, path: string) {
  const normalizedPath = path.replace(/^\/+/, "");
  return `${userId}/${normalizedPath}`;
}

export async function uploadPageAsset(
  supabase: SupabaseDatabaseClient,
  userId: string,
  path: string,
  file: File | Blob,
) {
  return supabase.storage
    .from(pageAssetsBucket)
    .upload(buildUserAssetPath(userId, path), file, {
      cacheControl: "31536000",
      upsert: false,
    });
}

export async function createSignedPageAssetUrl(
  supabase: SupabaseDatabaseClient,
  userId: string,
  path: string,
  expiresIn = 60 * 10,
) {
  return supabase.storage
    .from(pageAssetsBucket)
    .createSignedUrl(buildUserAssetPath(userId, path), expiresIn);
}

export async function removePageAsset(
  supabase: SupabaseDatabaseClient,
  userId: string,
  path: string,
) {
  return supabase.storage
    .from(pageAssetsBucket)
    .remove([buildUserAssetPath(userId, path)]);
}
