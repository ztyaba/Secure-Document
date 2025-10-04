import { currentUser } from '@clerk/nextjs/server';
import { roles } from '@/lib/constants';

export async function RoleGate({ roles: allowed, children }: { roles: typeof roles[number][]; children: React.ReactNode }) {
  const user = await currentUser();
  if (!user) return null;
  const role = (user.publicMetadata.role as string | undefined) ?? 'client';
  if (!allowed.includes(role as any)) return null;
  return <>{children}</>;
}
