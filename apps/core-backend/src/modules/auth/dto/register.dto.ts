import { IsEmail, IsString, MinLength, Matches, IsPhoneNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterWorkshopDto {
    @ApiProperty({ example: 'Mi Taller de Motos' })
    @IsString()
    @MinLength(3)
    workshopName: string;

    @ApiProperty({ example: '12-34567890-0' })
    @IsString()
    taxId: string;

    @ApiProperty({ example: 'admin@mitaller.com' })
    @IsEmail()
    adminEmail: string;

    @ApiProperty({ example: 'Juan' })
    @IsString()
    @MinLength(2)
    firstName: string;

    @ApiProperty({ example: 'Pérez' })
    @IsString()
    @MinLength(2)
    lastName: string;

    @ApiProperty({ example: 'Password123!' })
    @IsString()
    @MinLength(8)
    @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/, {
        message: 'Password must contain at least one uppercase, one lowercase, and one number',
    })
    password: string;

    @ApiProperty({ example: '123 Calle Industrial, Buenos Aires' })
    @IsString()
    address: string;

    @ApiProperty({ example: '+54 11 1234-5678' })
    @IsString()
    phone: string;
}
