import { IsString } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  name: string;

  @IsString()
  label: string;

  @IsString()
  group: string;
}
