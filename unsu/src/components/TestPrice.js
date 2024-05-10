import axios from "./utils/CustomAxios";
import React, { useState, useEffect } from "react";

const TestPrice = () => {
    const [priceData, setPriceData] = useState({
        routeNo: '35',  // 예시 초기 값
        chargeNo: '62'  // 예시 초기 값
    });
    const [fare, setFare] = useState(null); // 계산된 요금을 저장할 상태
    const [error, setError] = useState(null); // 에러 메시지를 저장할 상태

    useEffect(() => {
        fetchFare();  // 페이지 로드 시 요금 계산 실행
    }, []);  // 의존성 배열을 빈 배열로 설정하여 컴포넌트 마운트 시 1회 실행

    const fetchFare = async () => {
        try {
            const response = await axios.get(`charge/${priceData.routeNo}/${priceData.chargeNo}`);
            setFare(response.data); // 요금 데이터를 상태에 저장
            setError(null); // 에러 상태 초기화
        } catch (error) {
            console.error('에러입니다:', error);
            setFare(null); // 요금 상태 초기화
            setError('예기치 못한 에러가 발생했습니다.'); // 에러 메시지 설정
        }
    };

    return (
        <div>
            <label htmlFor="routeNo">노선 번호:</label>
            <input
                type="text"
                id="routeNo"
                name="routeNo"
                value={priceData.routeNo}
                onChange={e => setPriceData({ ...priceData, routeNo: e.target.value })}
            /><br />

            <label htmlFor="chargeNo">요금 번호:</label>
            <input
                type="text"
                id="chargeNo"
                name="chargeNo"
                value={priceData.chargeNo}
                onChange={e => setPriceData({ ...priceData, chargeNo: e.target.value })}
            /><br />

            <button onClick={fetchFare}>요금 계산하기</button>
            {fare !== null && <p>계산된 요금: {fare}</p>} {/* 요금 표시 */}
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* 에러 메시지 표시 */}
        </div>
    );
}

export default TestPrice;
