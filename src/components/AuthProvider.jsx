import { createContext, createSignal, useContext, Show } from "solid-js";
import { supabase } from "../services/supabase";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider(props) {
    const [session, setSession] = createSignal(null);
    const [loading, setLoading] = createSignal(true);


    supabase.auth.onAuthStateChange((event, session) => {
        console.log(event, session);

        if (event === "SIGNED_IN" || event === "USER_UPDATED") {
            setSession(session);
            setLoading(false);
        } else if (event === "SIGNED_OUT") {
            setSession(null);
            setLoading(false);
        } else if (event === "INITIAL_SESSION") {
            setLoading(false);
        }


    });

return(
    <Show when={!loading()}>
        <AuthContext.Provider value={session}>{props.children}</AuthContext.Provider>

    </Show>
)



}