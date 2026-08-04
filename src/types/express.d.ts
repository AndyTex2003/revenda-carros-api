import { Profile } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        profile: Profile;
      };
    }
  }
}
