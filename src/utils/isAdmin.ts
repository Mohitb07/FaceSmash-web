import { ADMIN_EMAILS } from '@/constant';
import type { User } from '@/interface';

export const checkIsAdmin = (user: User | null | undefined): boolean => {
  if (!user) return false;
  if (user.role === 'admin') return true;
  if (
    user.email &&
    ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(
      user.email.toLowerCase().trim()
    )
  ) {
    return true;
  }
  return false;
};
