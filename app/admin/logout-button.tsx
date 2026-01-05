'use client';

import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace('/admin/login');
    router.refresh();
  };

  return <button onClick={logout}>Logout</button>;
}
