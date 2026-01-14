import { IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
    @ApiProperty({ example: 'OldPassword123!' })
    @IsString()
    currentPassword: string;

    @ApiProperty({ example: 'NewPassword456!' })
    @IsString()
    @MinLength(8)
    @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/, {
        message: 'Password must contain at least one uppercase, one lowercase, and one number',
    })
    newPassword: string;
}
