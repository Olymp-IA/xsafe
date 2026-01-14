import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';

@ApiTags('Ecommerce - Reviews')
@Controller('ecommerce/reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a review' })
    async createReview(@Body() data: any) {
        return this.reviewsService.createReview(data);
    }

    @Get('product/:productId')
    @ApiOperation({ summary: 'Get product reviews' })
    async getProductReviews(@Param('productId') productId: string) {
        return this.reviewsService.getProductReviews(productId);
    }

    @Get('product/:productId/stats')
    @ApiOperation({ summary: 'Get review stats for product' })
    async getStats(@Param('productId') productId: string) {
        return this.reviewsService.getReviewStats(productId);
    }

    @Put(':reviewId/moderate')
    @ApiOperation({ summary: 'Moderate a review' })
    async moderate(
        @Param('reviewId') reviewId: string,
        @Body() data: { action: 'APPROVED' | 'REJECTED'; moderatorId: string; note?: string },
    ) {
        return this.reviewsService.moderateReview(reviewId, data.action, data.moderatorId, data.note);
    }

    @Put(':reviewId/reply')
    @ApiOperation({ summary: 'Reply to a review' })
    async reply(@Param('reviewId') reviewId: string, @Body() data: { reply: string }) {
        return this.reviewsService.replyToReview(reviewId, data.reply);
    }

    @Post(':reviewId/helpful')
    @ApiOperation({ summary: 'Mark review as helpful' })
    async markHelpful(@Param('reviewId') reviewId: string) {
        return this.reviewsService.markHelpful(reviewId);
    }
}
