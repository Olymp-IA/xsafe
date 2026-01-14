import { IsNumber, IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum AdjustmentType {
    ADD = 'ADD',
    SUBTRACT = 'SUBTRACT',
    SET = 'SET',
}

export class AdjustStockDto {
    @ApiProperty({ enum: AdjustmentType, example: 'ADD' })
    @IsEnum(AdjustmentType)
    type: AdjustmentType;

    @ApiProperty({ example: 10, description: 'Amount to adjust' })
    @IsNumber()
    amount: number;

    @ApiPropertyOptional({ example: 'Arrived from supplier order #123' })
    @IsOptional()
    @IsString()
    reason?: string;
}
