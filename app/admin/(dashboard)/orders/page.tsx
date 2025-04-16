'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import React from 'react';

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  productType: string;
  config: {
    material?: string;
    finish?: string;
  };
}

interface Order {
  id: number;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  customer: {
    firstName: string;
    lastName: string;
    email: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  trackingNumber: string | null;
  notes: string | null;
  createdAt: string;
}

const STATUS_COLORS = {
  pending: 'bg-yellow-500/10 text-yellow-500',
  processing: 'bg-blue-500/10 text-blue-500',
  shipped: 'bg-green-500/10 text-green-500',
  delivered: 'bg-green-700/10 text-green-700',
  cancelled: 'bg-red-500/10 text-red-500',
};

const STATUS_LABELS = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<Order['status']>('pending');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, status: Order['status']) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Failed to update order status');
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const formatConfig = (config: OrderItem['config']) => {
    const parts = [];
    if (config.material) parts.push(`Material: ${config.material}`);
    if (config.finish) parts.push(`Finish: ${config.finish}`);
    return parts.join(', ') || 'No configuration';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-blue-500/10 rounded w-1/4" />
          <div className="h-64 bg-blue-500/10 rounded" />
        </div>
      </div>
    );
  }

  const filteredOrders = orders.filter(order => order.status === activeTab);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Orders</h1>
        <div className="flex space-x-2">
          {(Object.keys(STATUS_LABELS) as Array<keyof typeof STATUS_LABELS>).map((status) => (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                activeTab === status
                  ? STATUS_COLORS[status]
                  : 'bg-[#111111] text-gray-400 hover:text-white'
              }`}
            >
              {STATUS_LABELS[status]} ({orders.filter(o => o.status === status).length})
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#111111] border border-blue-500/10 rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-blue-500/10">
                <th className="text-left p-4 text-gray-400 font-medium">Order #</th>
                <th className="text-left p-4 text-gray-400 font-medium">Customer</th>
                <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                <th className="text-right p-4 text-gray-400 font-medium">Total</th>
                <th className="text-right p-4 text-gray-400 font-medium">Date</th>
                <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr className="border-b border-blue-500/10">
                    <td className="p-4">
                      <span className="text-white font-medium">{order.orderNumber}</span>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="text-white">
                          {order.customer.firstName} {order.customer.lastName}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {order.customer.email}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                        className={`px-3 py-1 rounded-lg text-sm ${STATUS_COLORS[order.status]}`}
                      >
                        {Object.entries(STATUS_LABELS).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-white">£{order.total.toFixed(2)}</span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-gray-400">
                        {format(new Date(order.createdAt), 'MMM d, yyyy')}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                        className="bg-[#1a1a1a] hover:bg-[#222] text-gray-300 px-3 py-1 rounded-lg text-sm transition-colors duration-200"
                      >
                        {expandedOrder === order.id ? 'Hide Details' : 'View Details'}
                      </button>
                    </td>
                  </tr>
                  {expandedOrder === order.id && (
                    <tr>
                      <td colSpan={6} className="p-4 bg-[#0A0A0A]">
                        <div className="space-y-6">
                          {/* Order Items */}
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-4">Order Items</h3>
                            <table className="w-full">
                              <thead>
                                <tr className="border-b border-blue-500/10">
                                  <th className="text-left py-2 text-gray-400">Product Type</th>
                                  <th className="text-left py-2 text-gray-400">Configuration</th>
                                  <th className="text-right py-2 text-gray-400">Quantity</th>
                                  <th className="text-right py-2 text-gray-400">Price</th>
                                  <th className="text-right py-2 text-gray-400">Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.items.map((item) => (
                                  <tr key={item.id} className="border-b border-blue-500/10">
                                    <td className="py-2 text-white">{item.productType}</td>
                                    <td className="py-2 text-gray-400">{formatConfig(item.config)}</td>
                                    <td className="py-2 text-gray-400 text-right">{item.quantity}</td>
                                    <td className="py-2 text-gray-400 text-right">£{item.price.toFixed(2)}</td>
                                    <td className="py-2 text-gray-400 text-right">£{(item.price * item.quantity).toFixed(2)}</td>
                                  </tr>
                                ))}
                              </tbody>
                              <tfoot>
                                <tr className="border-t border-blue-500/10">
                                  <td colSpan={4} className="py-2 text-right text-gray-400">Subtotal:</td>
                                  <td className="py-2 text-right text-white">£{order.subtotal.toFixed(2)}</td>
                                </tr>
                                <tr>
                                  <td colSpan={4} className="py-2 text-right text-gray-400">Tax:</td>
                                  <td className="py-2 text-right text-white">£{order.tax.toFixed(2)}</td>
                                </tr>
                                <tr>
                                  <td colSpan={4} className="py-2 text-right text-gray-400">Shipping:</td>
                                  <td className="py-2 text-right text-white">£{order.shipping.toFixed(2)}</td>
                                </tr>
                                <tr className="border-t border-blue-500/10">
                                  <td colSpan={4} className="py-2 text-right font-semibold text-white">Total:</td>
                                  <td className="py-2 text-right font-semibold text-white">£{order.total.toFixed(2)}</td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>

                          {/* Shipping Address */}
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-2">Shipping Address</h3>
                            <div className="text-gray-400">
                              <p>{order.shippingAddress.street}</p>
                              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                              <p>{order.shippingAddress.country}</p>
                            </div>
                          </div>

                          {/* Tracking Number */}
                          {order.trackingNumber && (
                            <div>
                              <h3 className="text-lg font-semibold text-white mb-2">Tracking Number</h3>
                              <p className="text-gray-400">{order.trackingNumber}</p>
                            </div>
                          )}

                          {/* Notes */}
                          {order.notes && (
                            <div>
                              <h3 className="text-lg font-semibold text-white mb-2">Notes</h3>
                              <p className="text-gray-400">{order.notes}</p>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    No orders found in this status.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 