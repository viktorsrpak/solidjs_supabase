import { createEffect, createSignal } from "solid-js";
import { useAuth } from "../components/AuthProvider";
import { supabase } from "../services/supabase";
import { A } from "@solidjs/router";

export default function Home(props) {
    const session = useAuth();

    const [projects, setProjects] = createSignal(null);

    createEffect(async () => {
        if (session()) {
            const { data, error } = await supabase
                .from("projects")
                .select();

            if (!error) {
                setProjects(data);
            }
        }
    });



    return (
        <>
        <Show when={!session()}>

        </Show>
        </>
    )
}