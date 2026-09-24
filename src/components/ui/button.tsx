import Link from "next/link";
import type { ComponentProps } from "react";
export function ButtonLink({ variant = "primary", className = "", ...props }: ComponentProps<typeof Link> & { variant?: "primary" | "secondary" }) {
  return <Link className={`button button--${variant} ${className}`} {...props} />;
}
export function Button({ className = "", ...props }: ComponentProps<"button">) {
  return <button className={`button button--primary ${className}`} {...props} />;
}
