import { pageMetadata } from "@/lib/seo";
import { LeadForm } from "@/components/forms/lead-form";
import { forms } from "@/content/forms";
import "../forms.css";
const content = forms["book-meeting"];
export const metadata = pageMetadata("/book-meeting", "Book a Meeting", content.introduction);
export default function Page() { return <LeadForm content={content} />; }
