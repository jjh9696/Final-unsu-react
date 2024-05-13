import axios from "../../utils/CustomAxios";
import React, { useCallback, useState } from 'react';


const Point = ()=>{

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
            console.log('오예:', response.data);
            alert('등록되었습니다. 관리자 승인 후 포인트 충전이 완료됩니다.');
        } catch (error) {
            console.error('ㅡㅡ:', error);
            alert('오류가 발생하였습니다. 다시 시도해주십시오.');
        }
    }, [pointTest]); // 의존성 배열에 추가

    return (
        <>
            <h1>포인트 충전</h1>
            
            <div className='row mt-4'>
                <div className='col'>
                    <label class="col-form-label mt-4" for="inputDefault">충전금액</label>
                    <input type="text" name="pointAmount"
                        className="form-control rounded"
                        value={pointTest.pointAmount}
                        onChange={handleInputChange}
                        placeholder="숫자로 입력"
                        />
                </div>
            </div>
            <div className="row mt-2">
                <div className="col text-end">
                    <button className="btn btn-primary" onClick={saveInput}>포인트 충전</button>
                </div>
            </div>
        </>
    );
};

export default Point;