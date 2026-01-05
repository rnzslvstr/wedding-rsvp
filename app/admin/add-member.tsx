'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

export default function AddMember({
  householdId,
}: {
  householdId: string;
}) {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMember = async () => {
    if (!firstName.trim() || !lastName.trim()) return;

    setLoading(true);
    setError(null);

    const { error } = await supabase.from('guests').insert({
      household_id: householdId,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setFirstName('');
    setLastName('');
    router.refresh();
  };

  return (
    <div className="mt-16 card-secondary">
      <div style={{ fontWeight: 600, marginBottom: 8 }}>
        Add Member
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <button onClick={addMember} disabled={loading}>
          {loading ? 'Adding…' : 'Add'}
        </button>
      </div>

      {error && (
        <p style={{ color: 'var(--danger)', marginTop: 8 }}>
          {error}
        </p>
      )}
    </div>
  );
}
