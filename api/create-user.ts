import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// This Supabase client uses the service role key for admin actions
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // 1. Check for Authorization header and extract JWT
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header is missing or invalid.' });
    }
    const jwt = authHeader.split(' ')[1];

    // 2. Verify the JWT and get the user
    const { data: { user }, error: userError } = await createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!, {
        global: { headers: { Authorization: `Bearer ${jwt}` } },
    }).auth.getUser();

    if (userError || !user) {
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }

    // 3. Check if the user is a super_admin
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role !== 'super_admin') {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to perform this action.' });
    }

    // 4. Proceed with user creation logic
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
  await supabaseAdmin.auth.admin.deleteUser(authData.user.id); // Rollback
  throw new Error(profileInsertError.message);
}

    return res.status(200).json({ id: authData.user.id, email: authData.user.email, full_name, role });

  } catch (error: any) {
    console.error('API Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
