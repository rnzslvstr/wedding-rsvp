'use client';

import { useEffect, useMemo, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

type Guest = {
  id: string;
  household_id: string;
  first_name: string;
  last_name: string;
};

type HouseholdMember = {
  id: string;
  first_name: string;
  last_name: string;
  rsvp_status: string | null;
};

type RSVPChoice = 'accepted' | 'declined';

type NoteItem = {
  guestId: string;
  guestName: string;
  guestLastName: string;
  message: string;
};


export default function RSVPPage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1
  const [fullName, setFullName] = useState('');
  const [foundGuest, setFoundGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 2
  const [members, setMembers] = useState<HouseholdMember[]>([]);
  const [choices, setChoices] = useState<Record<string, RSVPChoice | undefined>>(
    {}
  );
  const [loadingMembers, setLoadingMembers] = useState(false);

  // Step 3
  const [selectedGuestId, setSelectedGuestId] = useState<string>('');
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [noteError, setNoteError] = useState<string | null>(null);

  // Step 4 submit
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const allChosen =
    members.length > 0 && members.every((m) => !!choices[m.id]);

  const usedGuestIds = useMemo(
    () => new Set(notes.map((n) => n.guestId)),
    [notes]
  );

  useEffect(() => {
    if (step !== 2 || !foundGuest?.household_id) return;

    const loadMembers = async () => {
      setLoadingMembers(true);
      setError(null);

      const { data, error } = await supabase
        .from('guests')
        .select('id,first_name,last_name,rsvp_status')
        .eq('household_id', foundGuest.household_id)
        .order('last_name', { ascending: true })
        .order('first_name', { ascending: true });

      setLoadingMembers(false);

      if (error || !data) {
        setError('Unable to load household members.');
        return;
      }

      setMembers(data as HouseholdMember[]);

      const init: Record<string, RSVPChoice | undefined> = {};
      (data as HouseholdMember[]).forEach((m) => (init[m.id] = undefined));
      setChoices(init);
    };

    loadMembers();
  }, [step, foundGuest?.household_id, supabase]);

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parts = fullName.trim().split(/\s+/);
    if (parts.length < 2) {
      setError('Please enter your first and last name.');
      return;
    }

    const firstName = parts[0];
    const lastNameQuery = parts.slice(1).join(' ');

    setLoading(true);

    const { data, error } = await supabase
      .from('guests')
      .select('id,household_id,first_name,last_name')
      .ilike('first_name', firstName) // exact (no %), case-insensitive
      .ilike('last_name', `%${lastNameQuery}%`) // contains, case-insensitive
      .limit(1)
      .single();

    setLoading(false);

    if (error || !data) {
      setError('Name not found. Please check spelling.');
      return;
    }

    setFoundGuest(data as Guest);
    setSubmitted(false);
    setSubmitError(null);
    setStep(2);
  };

  const setMemberChoice = (memberId: string, choice: RSVPChoice) => {
    setChoices((prev) => ({ ...prev, [memberId]: choice }));
  };

  const goBackToStep1 = () => {
    setStep(1);
    setFoundGuest(null);
    setMembers([]);
    setChoices({});
    setNotes([]);
    setSelectedGuestId('');
    setNoteText('');
    setError(null);
    setNoteError(null);
    setSubmitError(null);
    setSubmitted(false);
  };

  const goBackToStep2 = () => {
    setStep(2);
    setNoteError(null);
    setSubmitError(null);
  };

  const goBackToStep3 = () => {
    setStep(3);
    setSubmitError(null);
  };

  const addNote = () => {
    setNoteError(null);

    if (!selectedGuestId) return setNoteError('Please choose a member.');
    if (!noteText.trim()) return setNoteError('Please write a note.');
    if (usedGuestIds.has(selectedGuestId)) return setNoteError('That member already added a note.');

    const guest = members.find((m) => m.id === selectedGuestId);
    if (!guest) return setNoteError('Invalid member selection.');

setNotes((prev) => [
  ...prev,
  {
    guestId: guest.id,
    guestName: `${guest.first_name} ${guest.last_name}`,
    guestLastName: guest.last_name,
    message: noteText.trim(),
  },
]);


    setSelectedGuestId('');
    setNoteText('');
  };

  const removeNote = (guestId: string) => {
    setNotes((prev) => prev.filter((n) => n.guestId !== guestId));
  };

  const submitAll = async () => {
    if (!foundGuest?.household_id) return;
    if (!allChosen) {
      setSubmitError('Please complete guest selections first.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const updates = members.map((m) => ({
      guest_id: m.id,
      rsvp_status: choices[m.id]!, // safe since allChosen
    }));

 const notesPayload = notes.map((n) => ({
  guest_id: n.guestId,
  message: n.message,
  submitted_by_name: n.guestName,
  submitted_by_last_name: n.guestLastName,
}));


    const { error } = await supabase.rpc('submit_rsvp', {
      p_household_id: foundGuest.household_id,
      p_updates: updates,
      p_notes: notesPayload,
    });

    setSubmitting(false);

    if (error) {
      setSubmitError(error.message);
      return;
    }

    setSubmitted(true);
  };

  return (
    <div className="rsvp-shell">
      {/* Header */}
      <header className="rsvp-header">
        <h1 className="rsvp-title">RSVP</h1>
        <p className="rsvp-subtitle">
          Please respond to the invitation by confirming your household.
        </p>
      </header>

      <Stepper step={step} />

      {/* STEP 1 */}
      {step === 1 && (
        <div className="rsvp-card">
          <label className="rsvp-label">Your full name</label>

          <form onSubmit={handleStep1Submit}>
            <input
              className="rsvp-input"
              placeholder="First name + last name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <div className="rsvp-help">
              Tip: If you have a middle name, you can still enter your first + last name.
            </div>

            <div className="rsvp-actions">
              <button className="rsvp-primary" type="submit" disabled={loading}>
                {loading ? 'Checking…' : 'Continue'}
              </button>
            </div>

            {error && <div className="rsvp-error">{error}</div>}
          </form>
        </div>
      )}

      {/* The rest of steps remain unchanged in logic/UI for now */}
      {/* STEP 2 */}
{step === 2 && (
  <>
    <p>
      Please let us know who will be able to attend.
    </p>

    <button onClick={goBackToStep1} style={{ marginBottom: 12 }}>
      ← Back
    </button>

    {loadingMembers ? (
      <p>Loading household…</p>
    ) : (
      <>
        <div style={{ display: 'grid', gap: 12 }}>
          {members.map((m) => {
            const current = choices[m.id];

            return (
              <div key={m.id} className="rsvp-guest-card">
                <div className="rsvp-guest-name">
                  {m.first_name} {m.last_name}
                </div>

                <div className="rsvp-choice-group">
                  <button
                    type="button"
                    className={`rsvp-choice-btn accepted ${
                      current === 'accepted' ? 'active' : ''
                    }`}
                    onClick={() => setMemberChoice(m.id, 'accepted')}
                  >
                    Accept
                  </button>

                  <button
                    type="button"
                    className={`rsvp-choice-btn declined ${
                      current === 'declined' ? 'active' : ''
                    }`}
                    onClick={() => setMemberChoice(m.id, 'declined')}
                  >
                    Decline
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rsvp-step-actions">
          <button
            type="button"
            onClick={() => setStep(3)}
            disabled={!allChosen}
            className="rsvp-primary"
          >
            Continue
          </button>
        </div>

        {!allChosen && (
          <p style={{ marginTop: 8, opacity: 0.75 }}>
            Please choose for everyone before continuing.
          </p>
        )}
      </>
    )}
  </>
)}


      {/* STEP 3 */}
{step === 3 && (
  <>
    <p className="text-muted" style={{ marginTop: 4 }}>
      Optional: leave a short note for the couple.
    </p>

    <div className="rsvp-topbar">
      <button className="secondary" onClick={goBackToStep2}>
        ← Back
      </button>

      <button className="rsvp-skip" onClick={() => setStep(4)}>
        Skip
      </button>
    </div>

    <div className="rsvp-note-card">
      <div className="rsvp-note-grid">
        <div>
          <label className="rsvp-label">Member sending the note</label>
          <select
            value={selectedGuestId}
            onChange={(e) => setSelectedGuestId(e.target.value)}
          >
            <option value="">Select member</option>
            {members.map((m) => (
              <option key={m.id} value={m.id} disabled={usedGuestIds.has(m.id)}>
                {m.first_name} {m.last_name}
              </option>
            ))}
          </select>
          <div className="rsvp-help">
            Each member can only send one note.
          </div>
        </div>

        <div>
          <label className="rsvp-label">Note</label>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Write your message here…"
            style={{ minHeight: 120 }}
          />
        </div>

        <div className="rsvp-note-actions">
          <button className="rsvp-primary" type="button" onClick={addNote}>
            Add note
          </button>
        </div>

        {noteError && <div className="rsvp-error">{noteError}</div>}
      </div>
    </div>

    <div className="mt-16">
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Notes added</div>

      {notes.length === 0 ? (
        <p className="text-muted">No notes added.</p>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {notes.map((n) => (
            <div key={n.guestId} className="rsvp-note-item">
              <div className="rsvp-note-item-title">{n.guestName}</div>
              <div style={{ marginTop: 8, whiteSpace: 'pre-wrap' }}>{n.message}</div>

              <button
                type="button"
                className="rsvp-note-remove"
                onClick={() => removeNote(n.guestId)}
              >
                Remove note
              </button>
            </div>
          ))}
        </div>
      )}
    </div>

    <div className="rsvp-step-actions">
      <button className="rsvp-primary" type="button" onClick={() => setStep(4)}>
        Continue
      </button>
    </div>
  </>
)}


    {/* STEP 4 (Review + Submit + Thank you) */}
{step === 4 && (
  <>
    {!submitted ? (
      <>
        <p className="text-muted" style={{ marginTop: 4 }}>
          Review your selections before submitting.
        </p>

        <div className="rsvp-topbar">
          <button className="secondary" onClick={goBackToStep3}>
            ← Back
          </button>
        </div>

        <div className="rsvp-review-card">
          <div className="rsvp-section-title">Guest responses</div>

          <div style={{ display: 'grid', gap: 10 }}>
            {members.map((m) => {
              const choice = choices[m.id] ?? 'pending';
              return (
                <div key={m.id} className="rsvp-review-row">
                  <div style={{ fontWeight: 600 }}>
                    {m.first_name} {m.last_name}
                  </div>

                  <span
                    className={`rsvp-choice-chip ${
                      choice === 'accepted'
                        ? 'accepted'
                        : choice === 'declined'
                        ? 'declined'
                        : 'pending'
                    }`}
                  >
                    {choice === 'accepted'
                      ? 'Accepted'
                      : choice === 'declined'
                      ? 'Declined'
                      : 'Pending'}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-16" style={{ fontWeight: 800 }}>
            Notes
          </div>

          {notes.length === 0 ? (
            <p className="text-muted mt-8">No notes.</p>
          ) : (
            <div style={{ display: 'grid', gap: 10, marginTop: 10 }}>
              {notes.map((n) => (
                <div key={n.guestId} className="rsvp-note-item">
                  <div className="rsvp-note-item-title">{n.guestName}</div>
                  <div style={{ marginTop: 8, whiteSpace: 'pre-wrap' }}>
                    {n.message}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rsvp-submitbar">
          <button
            type="button"
            className="rsvp-primary"
            onClick={submitAll}
            disabled={submitting}
          >
            {submitting ? 'Submitting…' : 'Submit RSVP'}
          </button>

          {submitError && <div className="rsvp-error">{submitError}</div>}
        </div>
      </>
    ) : (
      <div className="rsvp-success">
        <h2>Thank you!</h2>
        <p>Your RSVP has been submitted.</p>

        <div className="rsvp-submitbar">
          <button className="rsvp-primary" onClick={goBackToStep1}>
            Start over
          </button>
        </div>
      </div>
    )}
  </>
)}

    </div>
  );
}

/* ---------- GAUGE STEPPER ---------- */

function Stepper({ step }: { step: 1 | 2 | 3 | 4 }) {
  const pct = ((step - 1) / 3) * 100;
  const labels = ['Step 1', 'Step 2', 'Step 3', 'Step 4'];

  return (
    <div style={{ margin: '12px 0 18px' }}>
      <div
        style={{
          position: 'relative',
          height: 14,
          borderRadius: 999,
          background: '#E8C6B6',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: '#DAAB96',
            borderRadius: 999,
            transition: 'width 250ms ease',
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 12 }}>
        {labels.map((l, i) => (
          <div
            key={l}
            style={{
              fontWeight: step === i + 1 ? 700 : 500,
              opacity: step >= i + 1 ? 1 : 0.6,
            }}
          >
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}
