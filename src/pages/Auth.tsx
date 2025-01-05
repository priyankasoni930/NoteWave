import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Welcome to NoteWave AI
          </h2>
        </div>
        <div className="mt-8 bg-[#1a1a1a] py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#11ff88',
                    brandAccent: '#0ee077',
                    brandButtonText: 'black',
                    defaultButtonBackground: '#2a2a2a',
                    defaultButtonBackgroundHover: '#3a3a3a',
                    inputBackground: '#2a2a2a',
                    inputBorder: '#3a3a3a',
                    inputBorderHover: '#4a4a4a',
                    inputBorderFocus: '#11ff88',
                    inputText: 'white',
                    inputLabelText: '#d1d1d1',
                    inputPlaceholder: '#888888',
                  },
                },
              },
            }}
            theme="dark"
            providers={[]}
          />
        </div>
      </div>
    </div>
  );
}
