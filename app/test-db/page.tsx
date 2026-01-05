import { supabase } from '@/lib/supabase';

export default async function TestDB() {
  const { data: guests } = await supabase
    .from('guests')
    .select('*');

  return (
    <div style={{ padding: 24 }}>
      <h1>Guests</h1>
      {guests?.map(g => (
        <p key={g.id}>
          {g.first_name} {g.last_name}
        </p>
      ))}
    </div>
  );
}
