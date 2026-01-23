import { pool } from "../config/connectDB.js";



export async function upsertChatSessionForUser( userId) {
    
    const { rows } = await pool.query(
        `
        insert into public.chat_sessions (user_id, expires_at)
        values($1, now() + interval '1 day')
        on conflict (user_id)
        do update set
            expires_at = now() + interval '1 day',
            updated_at = now()
        returning id, expires_at
        `,
        [userId]
    );
    return rows[0] ?? null;
}
export async function upsertChatSessionForGuest(guestId) {
  const { rows } = await pool.query(
    `
    insert into public.chat_sessions (guest_id, expires_at)
    values ($1, now() + interval '1 day')
    on conflict (guest_id)
    do update set
      expires_at = now() + interval '1 day',
      updated_at = now()
    returning id, expires_at
    `,
    [guestId]
  );
  return rows[0] ?? null;
}