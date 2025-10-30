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
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header is missing or invalid.' });
    }
    const jwt = authHeader.split(' ')[1];

    const supabaseUserClient = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!,
        {
          global: { headers: { Authorization: `Bearer ${jwt}` } },
        }
      );
    const { data: { user }, error: userError } = await supabaseUserClient.auth.getUser();

    if (userError || !user) {
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role !== 'super_admin') {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to perform this action.' });
    }

    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .update({ is_active: false })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);

    return res.status(200).json(data);

  } catch (error: any) {
    console.error('API Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
