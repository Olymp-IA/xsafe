import { Controller, Post, Body, Get, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterWorkshopDto, LoginDto, ChangePasswordDto } from './dto';
import { JwtAuthGuard } from './guards';
import { CurrentUser } from './decorators';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new workshop with admin user' })
    @ApiResponse({ status: 201, description: 'Workshop registered successfully' })
    @ApiResponse({ status: 409, description: 'Email or Tax ID already exists' })
    async register(@Body() registerDto: RegisterWorkshopDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login with email and password' })
    @ApiResponse({ status: 200, description: 'Login successful' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('refresh')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Refresh access token' })
    @ApiResponse({ status: 200, description: 'Tokens refreshed' })
    async refresh(@CurrentUser() user: { userId: string }) {
        return this.authService.refreshToken(user.userId);
    }

    @Post('change-password')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Change current user password' })
    @ApiResponse({ status: 200, description: 'Password changed successfully' })
    @ApiResponse({ status: 401, description: 'Current password is incorrect' })
    async changePassword(
        @CurrentUser() user: { userId: string },
        @Body() changePasswordDto: ChangePasswordDto,
    ) {
        return this.authService.changePassword(user.userId, changePasswordDto);
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ status: 200, description: 'User profile' })
    async getProfile(@CurrentUser() user: { userId: string }) {
        return this.authService.getProfile(user.userId);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Logout (client-side token invalidation)' })
    @ApiResponse({ status: 200, description: 'Logged out successfully' })
    async logout() {
        // JWT tokens are stateless, so logout is handled client-side
        // For a more robust solution, implement token blacklisting with Redis
        return { message: 'Logged out successfully' };
    }
}
