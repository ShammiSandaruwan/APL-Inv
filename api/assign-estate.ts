import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { target_user_id, estate_id } = req.body;
    if (!target_user_id || !estate_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify caller is super_admin
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const jwt = authHeader.split(' ')[1];

    const supabaseUser = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${jwt}` } } }
    );

    const { data: { user } } = await supabaseUser.auth.getUser();
    if (!user) {
        return res.status(401).json({ error: 'Invalid token' });
    }
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'super_admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Insert mapping
    const { error } = await supabaseAdmin
      .from('user_estates')
      .insert({ user_id: target_user_id, estate_id, assigned_by: user.id });

    if (error) throw error;

    return res.status(200).json({ message: 'Estate assigned successfully' });

  } catch (err: any) {
    console.error('API Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
