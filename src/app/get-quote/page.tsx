import { pageMetadata } from "@/lib/seo";
import { LeadForm } from "@/components/forms/lead-form";
import { forms } from "@/content/forms";
import "../forms.css";
const content = forms["get-quote"];
export const metadata = pageMetadata("/get-quote", "Get a Quote", content.introduction);
export default function Page() { return <LeadForm content={content} />; }
