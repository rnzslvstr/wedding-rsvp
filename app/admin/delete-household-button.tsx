'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

export default function DeleteHouseholdButton({
  householdId,
  householdName,
}: {
  householdId: string;
  householdName: string;
}) {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const deleteHousehold = async () => {
    const ok = confirm(`Delete ${householdName}?`);
    if (!ok) return;

    setLoading(true);

    const { error } = await supabase
      .from('households')
      .delete()
      .eq('id', householdId);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.refresh();
  };

  return (
    <button
      className="danger"
      onClick={deleteHousehold}
      disabled={loading}
    >
      {loading ? 'Deleting…' : 'Delete Household'}
    </button>
  );
}
