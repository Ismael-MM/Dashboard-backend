import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number) // Transforma el string de la URL a número
  @IsInt()
  @Min(1)
  page?: number = 1; // Página 1 por defecto

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10; // 10 registros por defecto
}
