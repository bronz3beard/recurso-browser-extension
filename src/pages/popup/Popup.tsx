import React, { useEffect, useState } from 'react';
import LogInSignUp from '@src/components/logInSignUp';
import AddResourceForm from '@src/components/addResourceForm';
import { User } from '@supabase/supabase-js';
import { supabase, SupaBaseUser } from '@src/lib/supabaseClient';

export default function Popup(): JSX.Element {
  const [user, setUser] = useState<User | undefined>()

  useEffect(function getUserDetailsFromAuthOrSession() {
    const setUserSession = async () => {
      const supabaseUser: Promise<SupaBaseUser> = supabase.auth.getUser()
      const { data, error } = await supabaseUser

      if (error) {
        console.error("🚀 ~ file: Popup.tsx:15 ~ setUserSession ~ error:", error)
      }

      const supabaseSessionUser: User | undefined =
        (await supabase.auth.getSession()).data.session?.user

      if (!data.user) {
        setUser(supabaseSessionUser)
      } else {
        setUser(data.user ?? undefined)
      }
    }

    setUserSession()
  }, [])
  
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 text-center h-full p-3 bg-theme-grey">
      <header className="flex flex-col items-center justify-center text-white">
        {!user ? <LogInSignUp {...{ setUser }}/> : <AddResourceForm {...{ user }}/>}
      </header>
    </div>
  );
}
