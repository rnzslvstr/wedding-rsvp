'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

export default function AddHousehold() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createHousehold = async () => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.from('households').insert({});

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.refresh();
  };

  return (
    <div className="card-secondary">
      <div style={{ fontWeight: 600, marginBottom: 8 }}>
        Add Household
      </div>

      <button onClick={createHousehold} disabled={loading}>
        {loading ? 'Creating…' : 'Add Household'}
      </button>

      {error && (
        <p style={{ color: 'var(--danger)', marginTop: 8 }}>
          {error}
        </p>
      )}
    </div>
  );
}
