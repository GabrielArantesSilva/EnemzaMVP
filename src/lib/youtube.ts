export function paraUrlEmbed(youtubeUrl: string): string {
  const url = new URL(youtubeUrl);
  const id = url.hostname.includes("youtu.be")
    ? url.pathname.slice(1)
    : url.searchParams.get("v");

  return `https://www.youtube.com/embed/${id}`;
}
