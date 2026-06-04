export type TicketStatus = "new" | "in-progress" | "resolved";

export interface TicketNote {
  id: string;
  ticketId: string;
  body: string;
  author: string;
  role: "staff" | "management" | "owner";
  createdAt: string;
  internal: boolean; // internal = staff-only note, false = visible reply
}

export interface Ticket {
  id: string;
  discord: string;
  service: string;
  budget: string;
  message: string;
  createdAt: string;
  status: TicketStatus;
}

const KEY = "vs_tickets";
const NOTES_KEY = "vs_ticket_notes";

export function getTickets(): Ticket[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveTicket(ticket: Omit<Ticket, "id" | "createdAt" | "status">): Ticket {
  const tickets = getTickets();
  const newTicket: Ticket = {
    ...ticket,
    id: `TKT-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    status: "new",
  };
  localStorage.setItem(KEY, JSON.stringify([newTicket, ...tickets]));
  return newTicket;
}

export function updateTicketStatus(id: string, status: TicketStatus): void {
  const tickets = getTickets().map((t) => (t.id === id ? { ...t, status } : t));
  localStorage.setItem(KEY, JSON.stringify(tickets));
}

export function deleteTicket(id: string): void {
  const tickets = getTickets().filter((t) => t.id !== id);
  localStorage.setItem(KEY, JSON.stringify(tickets));
}

export function getTicketNotes(ticketId: string): TicketNote[] {
  try {
    const all: TicketNote[] = JSON.parse(localStorage.getItem(NOTES_KEY) || "[]");
    return all.filter((n) => n.ticketId === ticketId);
  } catch {
    return [];
  }
}

export function addTicketNote(
  ticketId: string,
  body: string,
  author: string,
  role: TicketNote["role"],
  internal: boolean
): TicketNote {
  const all: TicketNote[] = JSON.parse(localStorage.getItem(NOTES_KEY) || "[]");
  const note: TicketNote = {
    id: Date.now().toString(36).toUpperCase(),
    ticketId,
    body,
    author,
    role,
    createdAt: new Date().toISOString(),
    internal,
  };
  localStorage.setItem(NOTES_KEY, JSON.stringify([...all, note]));
  return note;
}

export function deleteTicketNote(noteId: string): void {
  const all: TicketNote[] = JSON.parse(localStorage.getItem(NOTES_KEY) || "[]");
  localStorage.setItem(NOTES_KEY, JSON.stringify(all.filter((n) => n.id !== noteId)));
}
