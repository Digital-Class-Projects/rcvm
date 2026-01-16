import Image from "next/image";
import { galleryContent } from "@/lib/content";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export default function Gallery() {
  return (
    <section id="gallery" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-block bg-primary px-6 py-2 rounded-full">
            <h2 className="font-serif text-4xl text-primary-foreground">
              {galleryContent.title}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryContent.images.map((img) => {
            return (
              <Dialog key={img.id}>
                <DialogTrigger asChild>
                  <div className="group relative aspect-[3/4] w-full overflow-hidden rounded-lg cursor-pointer">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 25vw"
                      data-ai-hint={img.alt}
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-primary/50 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Plus className="h-12 w-12 text-white" />
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-3xl p-0 border-0 bg-transparent shadow-none">
                   <Image
                      src={img.src}
                      alt={img.alt}
                      width={800}
                      height={1067}
                      className="w-full h-auto rounded-lg"
                    />
                </DialogContent>
              </Dialog>
            );
          })}
        </div>
      </div>
    </section>
  );
}
