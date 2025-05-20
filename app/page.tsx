"use client"

import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { ORDER_STATUS } from "./constants/orderStatuses";
import { toast } from 'react-toastify';
import { getOrdersAPI, updateOrderStatusAPI } from './services/api';
import { Order } from "./types/order";

export default function Home() {

  const [orders, setOrders] = useState<Order[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [filterCustomerName, setFilterCustomerName] = useState('');
  const [filterEmployeeName, setFilterEmployeeName] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrdersAPI(filterCustomerName, filterEmployeeName);
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [filterCustomerName, filterEmployeeName]);

  useEffect(() => {
    // Initial fetch when the component mounts
    const initialFetch = async () => {
      try {
        const data = await getOrdersAPI();
        setOrders(data); // Set initial orders
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    }
  }, []); // Empty dependency array means this effect runs once after the initial render

  const handleStatusChange = (index: number, newStatus: string) => {
    const updatedOrders = [...orders];
    updatedOrders[index]["Trạng thái đơn hàng"] = newStatus;
    setOrders(updatedOrders);
    const orderId = updatedOrders[index]["Mã đơn hàng"]; // Assuming "Mã đơn hàng" is the unique ID
    if (orderId) {
      // Call API to update status
      updateOrderStatusAPI(orderId, newStatus)
        .then(() => {
          toast.success(`Cập nhật trạng thái đơn hàng ${orderId} thành công!`);
        })
        .catch(error => {
          toast.error(`Cập nhật trạng thái đơn hàng ${orderId} thất bại: ${error.message}`);
        });
    }
  };

  const handleFilter = () => {
    setFilterCustomerName(customerName);
    setFilterEmployeeName(employeeName);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleFilter();
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Đơn hàng</h1>
      <div className="row mb-3">
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="customerName">Lọc theo Tên khách hàng:</label>
            <div className="input-group">
              <input
                id="customerName"
                type="text"
                className="form-control"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button className="btn btn-primary" onClick={handleFilter}>
                Tìm
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="employeeName">Lọc theo Nhân viên:</label>
            <div className="input-group">
              <input
                id="employeeName"
                type="text"
                className="form-control"
                placeholder="Nhập tên nhân viên"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button className="btn btn-primary" onClick={handleFilter}>
                Tìm
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Mã vận đơn</th>
              <th>Họ tên</th>
              <th>Số tiền</th>
              <th>Ngành hàng</th>
              <th>Tình trạng thanh toán</th>
              <th>Trạng thái đơn hàng</th>
              <th>Nhân viên</th>
              <th>Kênh nhắn tin</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index}>
                <td>{order["Mã vận đơn"]}</td>
                <td>{order["Họ tên"]}</td>
                <td>{order["Số tiền"]}</td>
                <td>{order["Ngành hàng"]}</td>
                <td>{order["Tình trạng thanh toán"]}</td>
                <td>
                  <select
                    className="form-select"
                    value={order["Trạng thái đơn hàng"]}
                    onChange={(e) => handleStatusChange(index, e.target.value)}
                  >
                    {ORDER_STATUS.map((status, statusIndex) => (
                      <option key={statusIndex} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
                <td>{order["Nhân viên"]}</td>
                <td>{order["Kênh nhắn tin"]}</td>
                <td>{order["Note"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
