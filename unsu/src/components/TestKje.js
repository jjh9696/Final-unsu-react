
import axios from "./utils/CustomAxios";
import React, { useState } from "react";


const TestPrice = ()=>{

    const [formData, setFormData] = useState({
        routeNo: '',
        chargeNo: ''
    });
    const [fare, setFare] = useState(null); // 계산된 요금을 저장할 상태
    const [error, setError] = useState(null); // 에러 메시지를 저장할 상태

    // 입력 값 변경 시 상태 업데이트
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`charge/${formData.routeNo}/${formData.chargeNo}`);
            setFare(response.data); // 요금 데이터를 상태에 저장
            setError(null); // 에러 상태 초기화
        } catch (error) {
            console.error('에러입니다:', error);
            setFare(null); // 요금 상태 초기화
            setError('예기치 못한 에러가 발생했습니다.'); // 에러 메시지 설정
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="routeNo">노선</label>
            <input
                type="text"
                id="routeNo"
                name="routeNo"
                value={formData.routeNo}
                onChange={handleChange}
            /><br />

            <label htmlFor="chargeNo">요금</label>
            <input
                type="text"
                id="chargeNo"
                name="chargeNo"
                value={formData.chargeNo}
                onChange={handleChange}
            /><br />

            <input type="submit" value="계산하기" />
            {fare !== null && <p>요금계산: {fare}</p>} {/* 요금 표시 */}
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* 에러 메시지 표시 */}
        </form>
    );
}
export default TestPrice;