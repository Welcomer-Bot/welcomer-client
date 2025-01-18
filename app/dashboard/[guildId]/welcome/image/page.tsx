import { Editor } from "@/components/dashboard/guild/imageEditor/editor";
import ModuleInitialiser from "@/components/dashboard/guild/moduleInitialiser";

export default function Page() {
    return (
        <ModuleInitialiser moduleName="welcomer">
        <Editor />
        </ModuleInitialiser>
    );
}