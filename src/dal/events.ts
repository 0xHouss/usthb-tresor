import "server-only";

import { requireAdmin } from "@/dal/session";
import { prisma } from "@/lib/prisma";
import { EventType, Prisma } from "@prisma/client";

export const EVENTS_PAGE_SIZE = 50;

export type NewEvent = {
  type: EventType;
  actorId?: string | null;
  targetId?: string | null;
  metadata?: Prisma.InputJsonValue;
};

/**
 * Records an audit-log entry. Best-effort: a logging failure is reported but
 * never fails the action that triggered it.
 */
export async function logEvent({ type, actorId, targetId, metadata }: NewEvent) {
  try {
    await prisma.eventLog.create({
      data: { type, actorId: actorId ?? null, targetId: targetId ?? null, metadata },
    });
  } catch (error) {
    console.error(`Failed to log ${type} event:`, error);
  }
}

/** Paginated audit log, newest first. Admin only. */
export async function getEvents({ type, page }: { type?: EventType; page: number }) {
  await requireAdmin();

  const where: Prisma.EventLogWhereInput = { type };

  const [events, totalCount] = await Promise.all([
    prisma.eventLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: EVENTS_PAGE_SIZE,
      skip: (page - 1) * EVENTS_PAGE_SIZE,
      include: { actor: { select: { name: true, email: true } } },
    }),
    prisma.eventLog.count({ where }),
  ]);

  return { events, totalCount };
}
