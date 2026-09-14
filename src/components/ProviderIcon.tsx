/**
 * A sign-in provider's own brand mark, served as a static file.
 *
 * Deliberately NOT an icon-font glyph or a Phosphor icon: Google's brand
 * guidelines require their multi-colour "G" as supplied, and a monochrome
 * stand-in is both off-brand and harder to recognise at a glance — the mark is
 * what users scan for, not the word.
 *
 * Static files rather than inlined JSX so a brand refresh is a file swap, the
 * markup stays out of the JS bundle, and the browser caches each mark once
 * across every screen that shows it (login, register, settings).
 *
 * Rendered with `alt=""` and `aria-hidden`: the button's own text already says
 * "Continue with Google", so announcing the logo as well would read the
 * provider twice to a screen reader.
 */
export type Provider = 'google' | 'apple';

// Add a file to /public/brand and a line here; nothing else changes.
const marks: Record<Provider, string> = {
	google: '/brand/google.svg',
	apple: '/brand/apple.svg',
};

export function ProviderIcon({
	provider,
	className = 'h-5 w-5',
}: {
	provider: Provider;
	className?: string;
}) {
	return <img src={marks[provider]} alt="" aria-hidden="true" className={className} />;
}
