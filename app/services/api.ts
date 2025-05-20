import axios from 'axios';
import { Order } from '../types/order';

const API_URL = 'https://n8n-automation.io.vn/webhook/79161801-3ca5-4134-b412-480c8ef880d1';

export const getOrdersAPI = async ( customerName?: string, userName?: string): Promise<Order[]> => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        customerName,
        userName,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

export const updateOrderStatusAPI = async (orderId: string, newStatus: string) => {
  try {
    const response = await axios.post(API_URL, {
      'Mã đơn hàng': orderId,
      'Trạng thái đơn hàng': newStatus,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};