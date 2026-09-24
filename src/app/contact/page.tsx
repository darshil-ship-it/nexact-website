import { pageMetadata } from "@/lib/seo";
import { LeadForm } from "@/components/forms/lead-form";
import { forms } from "@/content/forms";
import "../forms.css";
const content = forms.contact;
export const metadata = pageMetadata("/contact", "Contact", content.introduction);
export default function Page() { return <LeadForm content={content} />; }
