const ga = process.env.NEXT_PUBLIC_GA_ID?.trim();
const gtm = process.env.NEXT_PUBLIC_GTM_ID?.trim();

export const gaId = ga && /^G-[A-Z0-9]+$/.test(ga) ? ga : undefined;
export const gtmId = gtm && /^GTM-[A-Z0-9]+$/.test(gtm) ? gtm : undefined;
