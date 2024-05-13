import axios from "./utils/CustomAxios";
import React, { useCallback, useState } from 'react';


function TestPrice() {

    const [pointTest, setPointTest] = useState({
        pointNo:'',
        memberId:'',
        pointAmount:''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPointTest(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const saveInput = useCallback(async () => {
        try {
            const response = await axios.post("/point/", pointTest, {
                headers: {
                    Authorization: axios.defaults.headers.common['Authorization'] // 기본 헤더에서 토큰을 가져옴
                }
            });
            console.log('ㅇ:', response.data);
            alert('됨');
        } catch (error) {
            console.error('ㄹ:', error);
            alert('안됨');
        }
    }, [pointTest]); // 의존성 배열에 추가

    return (
        <>
            <h1>포인트 테스트할게요~</h1>
            
            <div className='row mt-4'>
                <div className='col'>
                    <label>충전금액</label>
                    <input type="text" name="pointAmount"
                        className="form-control"
                        value={pointTest.pointAmount}
                        onChange={handleInputChange}
                        />
                </div>
            </div>
            <button onClick={saveInput}>포인트 충전</button>
        </>
    );
}

export default TestPrice;
