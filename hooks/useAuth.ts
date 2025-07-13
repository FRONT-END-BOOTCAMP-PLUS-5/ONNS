'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/supabaseClient';
import { User } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      const { session } = data;
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // onAuthStateChange : 인증 상태 이벤트 감지
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { subscription } = data;

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading, isAuthenticated: !!user };
};
