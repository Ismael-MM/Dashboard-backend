import { Request } from 'express';
import { User } from '@prisma/client';

export interface JwTPayload {
  id: number;
  email: string;
  username: string;
  nombre: string;
  apellido: string;
  roleId: string | null;
  role?: {
    id: string;
    name: string;
    permissions: { id: string; name: string }[];
  } | null;
}

export type LocalUser = User;

export interface LocalAuthenticatedRequest extends Request {
  user: LocalUser;
}

export interface JwTAuthenticatedRequest extends Request {
  user: JwTPayload;
}
