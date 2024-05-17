import { useCallback, useState, useEffect } from "react";
import axios from "../../utils/CustomAxios";

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);

    const loadData = useCallback(async () => {
        try {
            const resp = await axios.get(`/payment/list`, {
                headers: {
                    Authorization: axios.defaults.headers.common['Authorization']
                }
            });
            setOrders(resp.data); // 가져온 데이터로 orders 상태 업데이트
        } catch (error) {
            console.error("데이터읽기실패:", error); 
            setError(error.response ? error.response.data : "서버 오류");
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return (
        <>
            <h1>예매내역</h1>
            <hr />
            {error ? (
                <p>{error}</p>
            ) : orders.length > 0 ? (
                <ul>
                    {orders.map((order) => (
                        <li key={order.paymentNo}>
                            <p><strong>결제 번호:</strong> {order.paymentNo}</p>
                            <p><strong>결제 금액:</strong> {order.paymentFare}원</p>
                            <p><strong>결제 날짜:</strong> {order.paymentDate}</p>
                            <p><strong>결제 상태:</strong> {order.paymentState}</p>
                            <p><strong>회원 ID:</strong> {order.memberId}</p>
                            <hr />
                        </li>
                    ))}
                </ul>
            ) : (
                <p>예매 내역이 없습니다.</p>
            )}
        </>
    );
};

export default OrderList;
