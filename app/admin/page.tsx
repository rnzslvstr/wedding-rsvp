import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase-server';

import LogoutButton from './logout-button';
import AddHousehold from './add-household';
import AddMember from './add-member';
import MemberList from './member-list';
import DeleteHouseholdButton from './delete-household-button';

type Guest = {
  id: string;
  first_name: string;
  last_name: string;
  rsvp_status: string | null;
};

type HouseholdRow = {
  id: string;
  guests: Guest[];
};

type MessageRow = {
  id: string;
  message: string | null;
  submitted_at: string;
  submitted_by_name: string | null;
  submitted_by_last_name: string | null;
};

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth?.user) redirect('/admin/login');

  /* ---------- STATS ---------- */
  const { count: totalGuests } = await supabase
    .from('guests')
    .select('*', { count: 'exact', head: true });

  const { count: accepted } = await supabase
    .from('guests')
    .select('*', { count: 'exact', head: true })
    .eq('rsvp_status', 'accepted');

  const { count: declined } = await supabase
    .from('guests')
    .select('*', { count: 'exact', head: true })
    .eq('rsvp_status', 'declined');

  /* ---------- HOUSEHOLDS ---------- */
  const { data: households } = await supabase
    .from('households')
    .select('id,guests(id,first_name,last_name,rsvp_status)')
    .order('created_at', { ascending: false });

  const rows = ((households ?? []) as HouseholdRow[]).map((h) => {
    const guests = h.guests ?? [];

    const total = guests.length;
    const acceptedCount = guests.filter((g) => g.rsvp_status === 'accepted').length;
    const declinedCount = guests.filter((g) => g.rsvp_status === 'declined').length;
    const pendingCount = total - acceptedCount - declinedCount;

    const householdLastName = deriveHouseholdLastName(guests);

    return {
      id: h.id,
      label: householdLastName
        ? `${householdLastName} Household`
        : 'Unknown Household',
      guests,
      total,
      accepted: acceptedCount,
      declined: declinedCount,
      pending: pendingCount,
    };
  });

  /* ---------- MESSAGES ---------- */
  const { data: messages } = await supabase
    .from('rsvp_submissions')
    .select('id,message,submitted_at,submitted_by_name,submitted_by_last_name')
    .order('submitted_at', { ascending: false });

  const msgRows = (messages ?? []) as MessageRow[];

  return (
    <div className="container">
      {/* HEADER */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h1>Admin Dashboard</h1>
          <p className="text-muted">Logged in as {auth.user.email}</p>
        </div>

        <LogoutButton />
      </div>

      {/* STATS */}
      <div className="stats-grid mt-24">
        <StatCard label="Total Guests" value={totalGuests ?? 0} />
        <StatCard label="Accepted" value={accepted ?? 0} />
        <StatCard label="Declined" value={declined ?? 0} />
      </div>

      {/* ADD HOUSEHOLD */}
      <div className="mt-24">
        <AddHousehold />
      </div>

      {/* HOUSEHOLDS */}
      <h2 className="mt-32">Households</h2>

      <div className="mt-16" style={{ display: 'grid', gap: 20 }}>
        {rows.map((r) => (
          <div key={r.id} className="card household-card">
            <h3>{r.label}</h3>

            <div className="household-pills pills">
              <Pill label="Total" value={r.total} />
              <Pill label="Accepted" value={r.accepted} />
              <Pill label="Declined" value={r.declined} />
              <Pill label="Pending" value={r.pending} />
            </div>

            <AddMember householdId={r.id} />
            <MemberList householdId={r.id} guests={r.guests} />

            <div className="mt-16">
              <DeleteHouseholdButton
                householdId={r.id}
                householdName={r.label}
              />
            </div>
          </div>
        ))}
      </div>

      {/* MESSAGES */}
      <h2 className="mt-32">Messages</h2>

      {msgRows.length === 0 && (
        <p className="text-muted">No messages yet.</p>
      )}

      <div className="mt-16" style={{ display: 'grid', gap: 16 }}>
        {msgRows.map((m) => {
          const householdLabel = m.submitted_by_last_name
            ? `${m.submitted_by_last_name} Household`
            : 'No sender';

          return (
            <div key={m.id} className="message-card">
              <h4>{householdLabel}</h4>

              <div className="message-meta">
                Submitted by: {m.submitted_by_name ?? '—'}
              </div>

              <div className="mt-8">
                {m.message || <i className="text-muted">(No message)</i>}
              </div>

              <div className="message-meta mt-8">
                {new Date(m.submitted_at).toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- HELPERS ---------- */

function deriveHouseholdLastName(guests: Guest[]) {
  const counts = new Map<string, number>();
  guests.forEach((g) => {
    if (!g.last_name) return;
    counts.set(g.last_name, (counts.get(g.last_name) ?? 0) + 1);
  });

  let best: string | null = null;
  let bestCount = 0;
  counts.forEach((count, name) => {
    if (count > bestCount) {
      best = name;
      bestCount = count;
    }
  });

  return best;
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="stat-card">
      <p>{label}</p>
      <h2>{value}</h2>
    </div>
  );
}

function Pill({ label, value }: { label: string; value: number }) {
  return (
    <div className="pill">
      {label}: <b>{value}</b>
    </div>
  );
}
