import { IsString, IsNumber, IsEnum, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MaterialType, MaterialUnit } from '@prisma/client';

export class CreateMaterialDto {
    @ApiProperty({ example: 'MAT-ACERO-001' })
    @IsString()
    code: string;

    @ApiProperty({ example: 'Tubo Acero 4130 25mm' })
    @IsString()
    name: string;

    @ApiProperty({ enum: MaterialType, example: 'ACERO_4130' })
    @IsEnum(MaterialType)
    type: MaterialType;

    @ApiProperty({ example: 2.5, description: 'Thickness in mm' })
    @IsNumber()
    @Min(0)
    thickness: number;

    @ApiProperty({ example: 25, description: 'Width in mm' })
    @IsNumber()
    @Min(0)
    width: number;

    @ApiProperty({ example: 6000, description: 'Length in mm' })
    @IsNumber()
    @Min(0)
    length: number;

    @ApiProperty({ example: 100, description: 'Quantity in specified unit' })
    @IsNumber()
    @Min(0)
    quantity: number;

    @ApiProperty({ enum: MaterialUnit, example: 'METER' })
    @IsEnum(MaterialUnit)
    unit: MaterialUnit;

    @ApiPropertyOptional({ example: 20, description: 'Minimum stock level' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    minStock?: number;

    @ApiPropertyOptional({ example: 200, description: 'Maximum stock level' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    maxStock?: number;

    @ApiPropertyOptional({ example: 'clxyz123...' })
    @IsOptional()
    @IsString()
    supplierId?: string;
}
