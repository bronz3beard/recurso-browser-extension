import React, { useEffect, useState } from 'react';
import LogInSignUp from '@src/components/logInSignUp';
import AddResourceForm from '@src/components/addResourceForm';
import { User } from '@supabase/supabase-js';
import { supabase, SupaBaseUser } from '@src/lib/supabaseClient';
import Banner from '@src/components/common/banner';

export default function Popup(): JSX.Element {
  const [user, setUser] = useState<User | undefined>()

  useEffect(function getUserDetailsFromAuthOrSession() {
    const setUserSession = async () => {
      const supabaseUser: Promise<SupaBaseUser> = supabase.auth.getUser()
      const { data } = await supabaseUser

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
        <div className="flex flex-wrap w-full justify-center items-start space-y-4 mt-1">
          <div className="fixed w-full h-full top-1/2 transform -translate-y-1/2 overflow-hidden space-y-6 pb-7">
            <Banner {...{ title: 'Recurso' }} />
            <div className="mx-auto p-0 bg-theme-grey space-y-4 pb-7">
              {!user ? <LogInSignUp {...{ setUser }}/> : <AddResourceForm {...{ user }}/>}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
