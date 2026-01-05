'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

type Guest = {
  id: string;
  first_name: string;
  last_name: string;
  rsvp_status: string | null;
};

const STATUSES = ['pending', 'accepted', 'declined'] as const;
type Status = (typeof STATUSES)[number];

function normalizeStatus(s: string | null): Status {
  const v = (s ?? 'pending').toLowerCase();
  return (STATUSES as readonly string[]).includes(v) ? (v as Status) : 'pending';
}

export default function MemberList({
  householdId,
  guests,
}: {
  householdId: string;
  guests: Guest[];
}) {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startEdit = (g: Guest) => {
    setError(null);
    setEditingId(g.id);
    setFirstName(g.first_name);
    setLastName(g.last_name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFirstName('');
    setLastName('');
  };

  const saveEdit = async () => {
    if (!editingId) return;

    setBusyId(editingId);
    setError(null);

    const { error } = await supabase
      .from('guests')
      .update({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', editingId)
      .eq('household_id', householdId);

    setBusyId(null);

    if (error) {
      setError(error.message);
      return;
    }

    cancelEdit();
    router.refresh();
  };

  const deleteMember = async (id: string) => {
    const ok = confirm('Delete this member?');
    if (!ok) return;

    setBusyId(id);
    setError(null);

    const { error } = await supabase
      .from('guests')
      .delete()
      .eq('id', id)
      .eq('household_id', householdId);

    setBusyId(null);

    if (error) {
      setError(error.message);
      return;
    }

    router.refresh();
  };

  const setStatus = async (id: string, status: Status) => {
    setBusyId(id);
    setError(null);

    const { error } = await supabase
      .from('guests')
      .update({
        rsvp_status: status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('household_id', householdId);

    setBusyId(null);

    if (error) {
      setError(error.message);
      return;
    }

    router.refresh();
  };

  if (guests.length === 0) {
    return <p className="text-muted mt-8">No members yet.</p>;
  }

  return (
    <div className="mt-16">
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Members</div>

      <div style={{ display: 'grid', gap: 10 }}>
        {guests.map((g) => {
          const currentStatus = normalizeStatus(g.rsvp_status);

          return (
            <div key={g.id} className="member-row">
              {/* LEFT: NAME / EDIT */}
              <div style={{ minWidth: 220 }}>
                {editingId === g.id ? (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                    />
                    <input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                    />
                  </div>
                ) : (
                  <div style={{ fontWeight: 500 }}>
                    {g.first_name} {g.last_name}
                  </div>
                )}
              </div>

              {/* MIDDLE: STATUS */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <StatusBadge status={currentStatus} />
                <select
                  value={currentStatus}
                  disabled={busyId === g.id}
                  onChange={(e) => setStatus(g.id, e.target.value as Status)}
                >
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="declined">Declined</option>
                </select>
              </div>

              {/* RIGHT: ACTIONS */}
              <div style={{ display: 'flex', gap: 8 }}>
                {editingId === g.id ? (
                  <>
                    <button
                      onClick={saveEdit}
                      disabled={
                        busyId === g.id ||
                        !firstName.trim() ||
                        !lastName.trim()
                      }
                    >
                      {busyId === g.id ? 'Saving…' : 'Save'}
                    </button>
                    <button
                      className="secondary"
                      onClick={cancelEdit}
                      disabled={busyId === g.id}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="secondary"
                      onClick={() => startEdit(g)}
                      disabled={busyId === g.id}
                    >
                      Edit
                    </button>
                    <button
                      className="danger"
                      onClick={() => deleteMember(g.id)}
                      disabled={busyId === g.id}
                    >
                      {busyId === g.id ? 'Deleting…' : 'Delete'}
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {error && (
        <p style={{ color: 'var(--danger)', marginTop: 10 }}>
          {error}
        </p>
      )}
    </div>
  );
}

/* ---------- STATUS BADGE ---------- */

function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, { label: string; bg: string }> = {
    accepted: { label: 'Accepted', bg: '#DAAB96' },
    declined: { label: 'Declined', bg: '#B5958C' },
    pending: { label: 'Pending', bg: '#D2C3BE' },
  };

  const s = map[status];

  return (
    <span
      className="badge"
      style={{
        background: s.bg,
        color: '#3A2E2A',
        fontWeight: 600,
      }}
    >
      {s.label}
    </span>
  );
}
