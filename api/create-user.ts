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

    const { email, password, full_name, role } = req.body;
    if (!email || !password || !full_name || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role },
    });
    if (authError) throw new Error(authError.message);
    if (!authData.user) throw new Error('User not created.');

    const { error: profileInsertError } = await supabaseAdmin
      .from('user_profiles')
      .insert({ id: authData.user.id, full_name, role });

    if (profileInsertError) {
      console.error('Profile Insert Error Details:', JSON.stringify(profileInsertError, null, 2));
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      throw new Error(`Profile insert failed: ${profileInsertError.message}`);
    }

    return res.status(200).json({
      id: authData.user.id,
      email: authData.user.email,
      full_name,
      role,
    });

  } catch (error: any) {
    console.error('API Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
