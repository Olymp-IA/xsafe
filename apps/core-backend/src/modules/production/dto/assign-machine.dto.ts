import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AssignMachineDto {
    @ApiProperty({ example: 'clxyz123...' })
    @IsString()
    machineId: string;

    @ApiPropertyOptional({ example: 'clxyz456...' })
    @IsOptional()
    @IsString()
    operatorId?: string;
}
