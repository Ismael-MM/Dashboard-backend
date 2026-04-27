import { Request } from 'express';
import { User } from '@prisma/client';

export interface JwTPayload {
  id: number;
  email: string;
  username: string;
  nombre: string;
  apellido: string;
  reloId: string | null;
}

export type LocalUser = User;

export interface LocalAuthenticatedRequest extends Request {
  user: LocalUser;
}

export interface JwTAuthenticatedRequest extends Request {
  user: JwTPayload;
}
