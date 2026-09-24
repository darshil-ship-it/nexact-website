import Link from "next/link";
import { site } from "@/content/site";
import { footerGroups } from "@/content/navigation";
export function Footer() {
  return <footer className="site-footer"><div className="container footer-grid"><div className="footer-brand"><Link href="/" className="wordmark">NexAct<span>GLOBAL</span></Link><p>{site.tagline}</p></div>{footerGroups.map(group => <div key={group.label}><h2>{group.label}</h2><ul>{group.links.map(link => <li key={link.href}><Link href={link.href}>{link.label}</Link></li>)}</ul></div>)}</div><div className="container footer-bottom"><small>© {new Date().getFullYear()} {site.name}</small></div></footer>;
}
