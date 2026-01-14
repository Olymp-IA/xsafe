import { IsString, IsEnum, IsOptional, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { QualityStatus } from '@prisma/client';

export class CreateInspectionDto {
    @ApiProperty({ example: 'clxyz123...', description: 'Production Stage ID' })
    @IsString()
    stageId: string;

    @ApiPropertyOptional({ example: 'All welds passed visual inspection' })
    @IsOptional()
    @IsString()
    notes?: string;

    @ApiProperty({
        example: { welds: 12, dimensions: [{ name: 'width', value: 25, tolerance: 0.5 }], finish: 'good' },
        description: 'Measurement data',
    })
    measurements: Record<string, any>;

    @ApiPropertyOptional({ type: [String], example: ['https://storage.example.com/photo1.jpg'] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    photos?: string[];
}

export class CompleteInspectionDto {
    @ApiProperty({ enum: QualityStatus, example: 'PASSED' })
    @IsEnum(QualityStatus)
    status: QualityStatus;

    @ApiProperty({ example: true })
    @IsBoolean()
    passed: boolean;

    @ApiPropertyOptional({ example: 'Minor scratches on left tube, acceptable' })
    @IsOptional()
    @IsString()
    notes?: string;
}
