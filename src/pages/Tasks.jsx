import { useParams } from "@solidjs/router";
import { useAuth } from "../components/AuthProvider";
import { createSignal, For, onMount } from "solid-js";
import { supabase } from "../services/supabase";



export default function Tasks(props) {

    const params = useParams();
    const session = useAuth();

    const [project, setProject] = createSignal(null);
    const [isOwner, setOwner] = createSignal(false);
    const [tasks, setTasks] = createSignal([]);

    onMount(async () => {
        const { data, error } = await supabase
            .from("projects")
            .select()
            .eq("id", params.id);
        if (error) return;
        setProject(data[0]);
        if (session().user.id === project().author_id) setOwner(true);
        loadTasks();
    });

    async function formSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const name = formData.get("name");
        const { error } = await supabase
            .from("tasks")
            .insert({
                name: name,
                done: false,
                project_id: project().id
            });

        if (error) {
            alert("Spremanje nije uspijelo.");

        } else {
            loadTasks();
            event.target.reset();
        }

    }

    async function loadTasks() {

        const { data, error } = await supabase
            .from("tasks")
            .select()
            .eq("project_id", project().id);
        if (error) return;
        setTasks(data);
    }


    async function takeOwnership(taskId) {

        const { error } = await supabase
            .from("tasks")
            .update({ owner_id: session().user.Id })
            .eq("id", taskId);
        if (error) {
            alert("Operacija nije uspijela");
        } else {
            loadTasks();
        }
    }

    async function markDone(taskId) {

        const { error } = await supabase
            .from("tasks")
            .update({ done: true })
            .eq("id", taskId);
        if (error) {
            alert("Operacija nije uspijela.");
        } else {
            loadTasks();
        }
    }

    return(
        <>
        <Show when={project()}>
            <div class="text-xl font-bold">Dobro došli na projekt: {project().name}</div>
        <Show when={isOwner()}>
            <div>Vi ste vlasnik projekta, možete dodavati zadatke.</div>
            <form onSubmit={formSubmit}>
                <div class="p-2 flex flex-col gap-1">
                    <label>Naziv: </label>
                    <input type="text" name="name" required="true" />
                </div>
                <div class="p-2 flex flex-col gap-1">

                </div>
            </form>
                    

        </Show>
        </Show>


        <For each={tasks()} fallback={<div>Nema zadataka.</div>}>
            {(item) => <div class="place-self-start text-xl">{item.name}</div>}

        </For>
        </>


    )



}