import { IsString, IsArray, ValidateNested, IsNumber, IsDateString, IsEnum, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PriorityLevel } from '@prisma/client';

class OrderItemDto {
    @ApiProperty({ example: 'clxyz123...' })
    @IsString()
    productId: string;

    @ApiProperty({ example: 2 })
    @IsNumber()
    @Min(1)
    quantity: number;
}

export class CreateOrderDto {
    @ApiProperty({ example: 'clxyz123...' })
    @IsString()
    customerId: string;

    @ApiProperty({ type: [OrderItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];

    @ApiProperty({ example: '2024-12-31T23:59:59Z' })
    @IsDateString()
    dueDate: string;

    @ApiPropertyOptional({ enum: PriorityLevel, example: 'MEDIUM' })
    @IsOptional()
    @IsEnum(PriorityLevel)
    priority?: PriorityLevel;

    @ApiPropertyOptional({ example: 'Cliente prefiere color negro mate' })
    @IsOptional()
    @IsString()
    notes?: string;
}
