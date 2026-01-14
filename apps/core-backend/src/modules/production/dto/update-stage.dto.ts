import { IsEnum, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StageStatus } from '@prisma/client';

export class UpdateStageDto {
    @ApiProperty({ enum: StageStatus, example: 'COMPLETED' })
    @IsEnum(StageStatus)
    status: StageStatus;

    @ApiPropertyOptional({ example: 2.5 })
    @IsOptional()
    @IsNumber()
    actualHours?: number;

    @ApiPropertyOptional({ example: 'Completed without issues' })
    @IsOptional()
    @IsString()
    notes?: string;
}
