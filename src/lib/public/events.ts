import { db } from "@/db";
import { events } from "@/db/schema";
import { eq, and, isNull, ne, desc, asc } from "drizzle-orm";

const publicFilter = and(isNull(events.deletedAt), ne(events.status, "draft"));

export async function getAllPublicEvents() {
  return db
    .select()
    .from(events)
    .where(publicFilter)
    .orderBy(desc(events.eventDate));
}

export async function getEventBySlug(slug: string) {
  const [event] = await db
    .select()
    .from(events)
    .where(and(eq(events.slug, slug), publicFilter))
    .limit(1);

  return event ?? null;
}

export async function getRelatedEvents(currentSlug: string, limit = 2) {
  const rows = await db
    .select()
    .from(events)
    .where(publicFilter)
    .orderBy(asc(events.eventDate))
    .limit(limit + 1);

  return rows.filter((e) => e.slug !== currentSlug).slice(0, limit);
}
