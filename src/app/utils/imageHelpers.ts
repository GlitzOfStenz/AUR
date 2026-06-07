export function getUnsplashImage(query: string, size: string = "800x600"): string {
  const encoded = encodeURIComponent(query.trim());
  return `https://source.unsplash.com/featured/${size}?${encoded}`;
}
