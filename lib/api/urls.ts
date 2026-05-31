export function createApiPath(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return normalizedPath.startsWith("/api")
    ? normalizedPath
    : `/api${normalizedPath}`;
}
