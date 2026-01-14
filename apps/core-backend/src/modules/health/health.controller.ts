import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
    @Get()
    @ApiOperation({ summary: 'Health check endpoint' })
    check() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            version: process.env.npm_package_version || '0.0.1',
        };
    }

    @Get('ready')
    @ApiOperation({ summary: 'Readiness check' })
    ready() {
        return { status: 'ready' };
    }

    @Get('live')
    @ApiOperation({ summary: 'Liveness check' })
    live() {
        return { status: 'live' };
    }
}
