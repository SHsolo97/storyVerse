import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { PaymentService, type PurchaseDto } from './payment.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Public()
  @Get('products')
  getProducts() {
    return { products: this.paymentService.getAvailableProducts() };
  }

  @UseGuards(JwtAuthGuard)
  @Post('purchase')
  async processPurchase(@Request() req: any, @Body() purchaseDto: PurchaseDto) {
    return this.paymentService.processPurchase(req.user.sub, purchaseDto);
  }
}
