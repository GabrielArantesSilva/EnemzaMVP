import { paraUrlEmbed } from "@/lib/youtube";

interface VideoEmbedProps {
  youtubeUrl: string;
  titulo: string;
}

// Sempre embed via iframe — nunca cache/download do vídeo (ToS do YouTube).
// Ver .harness/boundaries.md.
export function VideoEmbed({ youtubeUrl, titulo }: VideoEmbedProps) {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
      <iframe
        src={paraUrlEmbed(youtubeUrl)}
        title={titulo}
        className="size-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
