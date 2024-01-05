import axios from 'axios';
import { useEffect, useState } from 'react';
import avatar from "./21-avatar-flat (1).gif";
import product from "./324523833_1383239042222408_8590968072928708208_n.gif";
import blogs from "./336820258_2355571661283833_6264624024996388187_n.png";
import orders from "./336676214_606604907677715_5966479179866449110_n.png";

import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Rectangle,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { getData } from '../../api/api';
import { Select } from 'antd';
import ComHeaderManager from '../Components/ComHeaderManager/ComHeaderManager';
export default function Dashboard() {
    const [data, setData] = useState([]);
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState([]);
    const [blog, setBlog] = useState([]);
    const [order, setOrder] = useState([]);
    const [year, setYear] = useState(new Date().getFullYear());
    const { Option } = Select;
    useEffect(() => {
        getData(`/order/manager/dashboard?year=${year}`)
            .then((response) => {
                const serverData = response.data;
                const updatedMonths = months.map(month => {
                    const matchingMonthData = serverData.find(item => item._id.month === month._id.month);
                    if (matchingMonthData) {
                        return {
                            ...month,
                            totalAmount: matchingMonthData.totalAmount,
                            totalQuantity: matchingMonthData.totalQuantity,
                        };
                    }
                    return month;
                });
                setData(updatedMonths);
            })
    }, [year]);

    useEffect(() => {
        getData(`/user/countByRole/user`)
            .then((response) => {
                setUser(response?.data[0])
            })
    }, []);

    useEffect(() => {
        getData(`/product/countByProduct`)
            .then((response) => {
                setProducts(response?.data[0])
            })
    }, []);
    const months = Array.from({ length: 12 }, (_, index) => ({
        _id: { month: index + 1 },
        totalAmount: 0,
        totalQuantity: 0,
    }));


    return (
        <>
            <ComHeaderManager />
            <div className='p-10'>

                <div >
                    <div className='grid grid-cols-1 gap-4  md:grid-cols-2 sm:grid-cols-1 ' >
                        <div className='flex flex-col justify-center  items-center text-center ' >
                            <img className='w-44' src={avatar} alt="img" />
                            <div >
                                <span>{user.totalUsers}</span>
                                <p>Người dùng</p>
                            </div>
                        </div>
                        <div className='flex flex-col justify-center items-center text-center' >
                            <img className='w-44' src={product} alt="img" />
                            <div >
                                <span>{products?.totalProducts}</span>
                                <p>Sản phẩm</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-1 items-center my-4">

                    <h1 className="control-label col-md-2 col-md-offset-2" htmlFor="id_accomodation">
                        Chọn năm
                    </h1>
                    <Select
                        className="form-control"
                        onChange={(value) => setYear(value)}
                        defaultValue={new Date().getFullYear()} // Giá trị mặc định cho Select
                    >
                        {Array.from({ length: new Date().getFullYear() - 1999 }, (_, index) => {
                            const year = new Date().getFullYear() - index;
                            return <Option key={year} value={year}>{year}</Option>;
                        })}
                    </Select>
                </div>
                {/* <div style={{ width: '100%', marginTop: 100 }}>
                    <h1>Thống kê doanh thu đơn hàng</h1>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart
                            width={500}
                            height={200}
                            data={data}
                            syncId="anyId"
                            margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="_id.month" />
                            <YAxis />
                            <Legend />
    
                            <Tooltip />
                            <Area type="monotone" dataKey="totalAmount" stackId="1" stroke="#8884d8" fill="#8884d8" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div> */}



                {/* <div>
                    <h1>Số đơn hàng đã thuê</h1>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart
                            width={500}
                            height={200}
                            data={data}
                            syncId="anyIds"
                            margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="totalOrders" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
    
    
                </div> */}
                <div>
                    <h1>Thống kê doanh thu đơn hàng</h1>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart
                            width={100}
                            height={300}
                            data={data}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 0,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="_id.month" />
                            <YAxis />
                            <Tooltip
                                formatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'VND' }).format(value)}
                            />
                            <Legend />
                            <Bar dataKey="totalAmount" name="Tổng thu nhập" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div>
                    <h1>Thống kê số lượng đã bán</h1>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart
                            width={100}
                            height={300}
                            data={data}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 0,
                                bottom: 5,
                            }}

                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="_id.month" />
                            <YAxis dataKey="totalQuantity" />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="totalQuantity" name="Số lượng đơn hàng đã bán" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </>
    );
}
