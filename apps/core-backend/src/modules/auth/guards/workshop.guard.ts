import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class WorkshopGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const workshopIdParam = request.params.workshopId;

        // If no workshopId in params, allow (will use user's workshopId)
        if (!workshopIdParam) {
            return true;
        }

        // Check if user belongs to the workshop they're trying to access
        if (user.workshopId !== workshopIdParam) {
            throw new ForbiddenException('You do not have access to this workshop');
        }

        return true;
    }
}
