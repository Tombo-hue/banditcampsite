import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ProductType } from '@prisma/client';

interface OrderItem {
  productType: string;
  quantity: number;
  price: number;
}

// Get all products
export async function GET() {
  try {
    // Get all order items to calculate sales
    const orderItems = await prisma.orderItem.findMany({
      select: {
        productType: true,
        quantity: true,
        price: true,
      },
    });

    // Calculate stats for each product type
    const productStats = Object.values(ProductType).map(type => {
      const items = orderItems.filter((item: OrderItem) => item.productType === type);
      const totalSold = items.reduce((sum: number, item: OrderItem) => sum + item.quantity, 0);
      const totalRevenue = items.reduce((sum: number, item: OrderItem) => sum + (item.price * item.quantity), 0);

      return {
        type,
        name: type === 'REINFORCED_DIFFERENTIALS' ? 'Reinforced Differentials' : 'NAFL Bumper',
        description: type === 'REINFORCED_DIFFERENTIALS' 
          ? 'Professional Grade Reinforced Diffs for MX-5 Mk1 & Mk2'
          : 'Custom NAFL Bumper inspired by Sinbin\'s Mk1',
        basePrice: type === 'REINFORCED_DIFFERENTIALS' ? 250 : 200,
        totalSold,
        totalRevenue,
        status: 'IN_STOCK', // You might want to add this to your schema later
        variants: type === 'REINFORCED_DIFFERENTIALS' 
          ? [
              { name: 'Open Diff (1.6/1.8)', price: 250 },
              { name: 'Welded Diff (1.6/1.8)', price: 300 },
              { name: 'Torsen LSD (4:1)', price: 650 },
              { name: 'Casing Reinforcement Service', price: 150 },
            ]
          : [
              { name: 'Full Fiberglass Copy', price: 200 },
              { name: 'Fabricated Version', price: 200 },
              { name: 'Sanded Finish', price: 0 },
              { name: 'Primed Finish', price: 20 },
              { name: 'Fully Painted', price: 50 },
            ],
      };
    });

    return NextResponse.json(productStats);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// Update product status (for future use)
export async function PATCH(request: Request) {
  try {
    const { type, status } = await request.json();

    // For now, just return success since we don't store status in the DB yet
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
} 