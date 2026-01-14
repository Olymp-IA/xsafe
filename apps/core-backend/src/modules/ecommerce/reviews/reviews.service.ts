import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma';

@Injectable()
export class ReviewsService {
    constructor(private readonly prisma: PrismaService) { }

    async createReview(data: {
        workshopId: string;
        productId: string;
        customerId: string;
        rating: number;
        title?: string;
        comment: string;
        photos?: string[];
    }) {
        // Check if customer already reviewed this product
        const existing = await this.prisma.productReview.findFirst({
            where: { customerId: data.customerId, productId: data.productId },
        });

        if (existing) {
            throw new BadRequestException('You have already reviewed this product');
        }

        return this.prisma.productReview.create({
            data: {
                workshopId: data.workshopId,
                productId: data.productId,
                customerId: data.customerId,
                rating: data.rating,
                title: data.title,
                comment: data.comment,
                photos: data.photos || [],
            },
            include: {
                customer: { select: { firstName: true, lastName: true } },
            },
        });
    }

    async getProductReviews(productId: string) {
        const reviews = await this.prisma.productReview.findMany({
            where: { productId, status: 'APPROVED' },
            include: {
                customer: { select: { firstName: true, lastName: true, avatarUrl: true } },
            },
            orderBy: { createdAt: 'desc' },
        });

        const stats = await this.getReviewStats(productId);

        return { reviews, stats };
    }

    async getReviewStats(productId: string) {
        const reviews = await this.prisma.productReview.findMany({
            where: { productId, status: 'APPROVED' },
            select: { rating: true },
        });

        if (!reviews.length) {
            return { avgRating: 0, totalReviews: 0, distribution: {} };
        }

        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        const distribution = reviews.reduce((acc, r) => {
            acc[r.rating] = (acc[r.rating] || 0) + 1;
            return acc;
        }, {} as Record<number, number>);

        return { avgRating: avgRating.toFixed(1), totalReviews: reviews.length, distribution };
    }

    async moderateReview(reviewId: string, action: 'APPROVED' | 'REJECTED', moderatorId: string, note?: string) {
        return this.prisma.productReview.update({
            where: { id: reviewId },
            data: {
                status: action,
                moderatedBy: moderatorId,
                moderatedAt: new Date(),
                moderationNote: note,
            },
        });
    }

    async replyToReview(reviewId: string, reply: string) {
        return this.prisma.productReview.update({
            where: { id: reviewId },
            data: {
                sellerReply: reply,
                repliedAt: new Date(),
            },
        });
    }

    async markHelpful(reviewId: string) {
        return this.prisma.productReview.update({
            where: { id: reviewId },
            data: { helpfulCount: { increment: 1 } },
        });
    }
}
