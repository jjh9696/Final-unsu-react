import { useCallback, useState, useEffect } from "react";
import axios from "../../utils/CustomAxios";
import  Pagination  from "../../utils/Pagination";

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    //페이징
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10);

    //페이징계산
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = orders.slice(indexOfFirstPost, indexOfLastPost);
    const loadData = useCallback(async () => {
        try {
            const resp = await axios.get(`/payment/list`, {
                headers: {
                    Authorization: axios.defaults.headers.common['Authorization']
                }
            });
            setOrders(resp.data); // 가져온 데이터로 orders 상태 업데이트
        } catch (error) {
            console.error("데이터 읽기 실패:", error);
            setError(error.response ? error.response.data : "서버 오류");
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return (
        <>
            <h1>예매 내역</h1>
            <hr />
            {error ? (
                <p>{error}</p>
            ) : orders.length > 0 ? (
                <table className="table">
                    <thead>
                        <tr>
                            <th>결제 번호</th>
                            <th>결제 금액</th>
                            <th>결제 날짜</th>
                            <th>결제 상태</th>
                            <th>회원 ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPosts.map((order) => (
                            <tr key={order.paymentNo}>
                                <td>{order.paymentNo}</td>
                                <td>{order.paymentFare}원</td>
                                <td>{order.paymentDate}</td>
                                <td>{order.paymentState}</td>
                                <td>{order.memberId}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
            ) : (
                <p>예매 내역이 없습니다.</p>
            )}
            {/* Pagination */}
            <Pagination
                postsPerPage={postsPerPage}
                totalPages={Math.ceil(orders.length / postsPerPage)}
                paginate={setCurrentPage}
                currentPage={currentPage}
            />
        </>
    );
};

export default OrderList;
