import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Es bueno imprimir el error original en consola para tu propia depuración
    console.error(`[Prisma Error ${exception.code}]:`, exception.message);

    switch (exception.code) {
      case 'P2002': {
        const status = HttpStatus.CONFLICT;
        const meta = exception.meta as any;
        let field = 'dato';

        // 1. Intentar por el camino estándar de Prisma
        if (meta?.target) {
          field = Array.isArray(meta.target) ? meta.target.join(', ') : meta.target;
        } else if (meta?.driverAdapterError?.cause?.originalMessage) {
          const msg = meta.driverAdapterError?.cause.originalMessage; // "Duplicate entry 'dada' for key 'User_username_key'"

          // Buscamos lo que hay entre el nombre de la tabla 'User_' y el sufijo '_key'
          const match = msg.match(/key '.*_(.*)_key'/);

          if (match && match[1]) {
            field = match[1]; // Esto extraerá "username"
          }
        }

        response.status(status).json({
          statusCode: status,
          message: `Ya existe un registro con ese ${field}. Por favor, elige otro.`,
          error: 'Conflict',
        });
        break;
      }
      // Aquí puedes agregar otros casos en el futuro
      default:
        // Delega los errores no manejados al filtro por defecto de Nest
        super.catch(exception, host);
        break;
    }
  }
}