import { IsString, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MachineType, MachineStatus } from '@prisma/client';

export class CreateMachineDto {
    @ApiProperty({ example: 'MCH-001' })
    @IsString()
    code: string;

    @ApiProperty({ example: 'Cortadora Laser Fiber' })
    @IsString()
    name: string;

    @ApiProperty({ enum: MachineType, example: 'LASER_CUTTER' })
    @IsEnum(MachineType)
    type: MachineType;

    @ApiProperty({ example: 'Trumpf' })
    @IsString()
    brand: string;

    @ApiProperty({ example: 'TruLaser 3030' })
    @IsString()
    model: string;

    @ApiProperty({ example: '10mm acero, 6mm inox' })
    @IsString()
    capacity: string;

    @ApiPropertyOptional({ enum: MachineStatus, example: 'AVAILABLE' })
    @IsOptional()
    @IsEnum(MachineStatus)
    status?: MachineStatus;
}

export class UpdateMachineStatusDto {
    @ApiProperty({ enum: MachineStatus, example: 'MAINTENANCE' })
    @IsEnum(MachineStatus)
    status: MachineStatus;

    @ApiPropertyOptional({ example: '2024-12-31T10:00:00Z' })
    @IsOptional()
    @IsDateString()
    nextMaintenance?: string;
}
