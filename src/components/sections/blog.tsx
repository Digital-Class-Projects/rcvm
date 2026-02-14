"use client";

import Image from "next/image";
import { blogContent } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { MessageCircle, Calendar } from "lucide-react";
import Link from "next/link";

export default function Blog() {
  return (
    <section id="blog" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          <div className="grid gap-8">
            {blogContent.posts.slice(0, 2).map((post) => (
              <div key={post.id} className="group relative aspect-video w-full overflow-hidden rounded-lg">
                <Image
                  src={post.imageSrc}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  data-ai-hint={post.imageHint}
                />
                <div className="absolute inset-0 bg-black/40 opacity-100 group-hover:opacity-0 transition-opacity duration-300"></div>
                <div className="absolute inset-0 flex items-end p-6 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                  <div className="text-white">
                    <div className="flex items-center gap-4 text-sm mb-2">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4"/>
                            <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MessageCircle className="w-4 h-4"/>
                            <span>{post.comments} Comments</span>
                        </div>
                    </div>
                    <h3 className="font-serif text-3xl font-semibold leading-tight">
                      {post.title}
                    </h3>
                  </div>
                </div>
                <div className="absolute inset-0 bg-primary/80 p-8 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end">
                    <div className="flex items-center gap-4 text-sm mb-2">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4"/>
                            <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MessageCircle className="w-4 h-4"/>
                            <span>{post.comments} Comments</span>
                        </div>
                    </div>
                    <h3 className="font-serif text-3xl font-semibold leading-tight mb-4">
                      {post.title}
                    </h3>
                    <p className="text-sm mb-4">{post.description}</p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Image src={post.author.avatar} alt={post.author.name} width={40} height={40} className="rounded-full" />
                            <div>
                                <p className="text-xs">Posted by</p>
                                <p className="font-semibold">{post.author.name}</p>
                            </div>
                        </div>
                        <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">Continue</Button>
                    </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-8">
            <div className="border-2 border-dashed border-primary/30 p-8 rounded-lg text-center h-full flex flex-col justify-center min-h-[360px]">
              <h2 className="font-serif text-4xl">
                <span className="text-foreground">Our Nice</span><br/>
                <span className="text-primary">Blog</span>
              </h2>
              <p className="text-muted-foreground my-4">
                But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give.
              </p>
              <Button asChild className="self-center">
                <Link href="#">View More</Link>
              </Button>
            </div>

            {blogContent.posts.slice(2, 3).map((post) => (
                <div key={post.id} className="group relative aspect-video w-full overflow-hidden rounded-lg">
                    <Image
                    src={post.imageSrc}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    data-ai-hint={post.imageHint}
                    />
                    <div className="absolute inset-0 bg-primary/80 p-8 text-primary-foreground flex flex-col justify-end">
                        <div className="flex items-center gap-4 text-sm mb-2">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4"/>
                                <span>{post.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MessageCircle className="w-4 h-4"/>
                                <span>{post.comments} Comments</span>
                            </div>
                        </div>
                        <h3 className="font-serif text-3xl font-semibold leading-tight mb-4">
                        {post.title}
                        </h3>
                        <p className="text-sm mb-4">{post.description}</p>
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Image src={post.author.avatar} alt={post.author.name} width={40} height={40} className="rounded-full" />
                                <div>
                                    <p className="text-xs">Posted by</p>
                                    <p className="font-semibold">{post.author.name}</p>
                                </div>
                            </div>
                            <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">Continue</Button>
                        </div>
                    </div>
                </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
