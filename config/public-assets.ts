const r2PublicUrl: string | undefined = import.meta.env.VITE_R2_PUBLIC_URL;

if (!r2PublicUrl) {
  throw new Error('VITE_R2_PUBLIC_URL is not configured');
}

const normalizedR2PublicUrl = r2PublicUrl.replace(/\/+$/, '');

export function getPublicAssetUrl(path: string): string {
  return `${normalizedR2PublicUrl}/${path.replace(/^\/+/, '')}`;
}
