import type { Metadata } from "next";
import { Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "News",
  description: "Latest news and updates from the Kubeflow community in India.",
};

const mockPosts = [
  {
    id: "1",
    title: "Kubeflow 1.9 Released: What's New for Indian Developers",
    excerpt: "The latest Kubeflow release brings improved pipeline support, better notebook integration, and enhanced model serving capabilities.",
    slug: "kubeflow-1-9-released",
    tags: ["Release", "Kubeflow"],
    publishedAt: "2026-05-01T10:00:00",
    author: "Kubeflow Common Hubs",
  },
  {
    id: "2",
    title: "Recap: KCD Chennai 2026",
    excerpt: "Over 200 developers gathered in Chennai for the first Kubernetes Community Day of the year. Here's what happened.",
    slug: "recap-kcd-chennai-2026",
    tags: ["Event", "Recap"],
    publishedAt: "2026-04-20T10:00:00",
    author: "Priya Patel",
  },
  {
    id: "3",
    title: "Getting Started with Kubeflow Pipelines v2",
    excerpt: "A beginner-friendly guide to building your first ML pipeline with Kubeflow Pipelines v2. Step-by-step with code examples.",
    slug: "getting-started-kubeflow-pipelines-v2",
    tags: ["Tutorial", "Pipelines"],
    publishedAt: "2026-04-10T10:00:00",
    author: "Amit Kumar",
  },
];

export default function NewsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          News & Updates
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl">
          Stay up to date with the latest from the Kubeflow community in India.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {mockPosts.map((post) => (
          <a
            key={post.id}
            href={`/news/${post.slug}`}
            className="group block rounded-xl border border-border bg-bg-secondary p-6 md:p-8 transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:-translate-y-0.5 hover:shadow-lg hover:border-border-strong"
          >
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
              <span className="text-xs text-text-muted flex items-center gap-1">
                <Clock className="size-3" />
                {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-semibold mb-2 group-hover:text-[var(--kf-blue)] transition-colors">
              {post.title}
            </h2>
            <p className="text-text-secondary mb-4">{post.excerpt}</p>

            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">By {post.author}</span>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-[var(--kf-blue)] group-hover:gap-2 transition-all">
                Read more <ArrowRight className="size-4" />
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
