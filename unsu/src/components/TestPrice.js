import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';


function TestPrice() {

    //state
    const [pointItems, setpointItems] = useState({
        memberId:"",
        pointAmount:""
    });
    const [result, setResult] = useState({ 
        memberId : null,
        pointAmount : null
      });

    const chargePoint = e =>{
        setpointItems({
            ...pointItems,
            [e.target.name]:e.target.value
        });
    };

    // const chargeResult = e=>{
    //     const name = e.target.name;
    //     if(name === pointItems.pointAmount){
    //         const regex = /^[0-9]+$/;
    //         setResult({
    //             ...result,
    //             pointAmount : regex.test(pointItems.pointAmount)
    //         });
    //     }
    // };


    useEffect(()=>{
        loadTokenData();
    },[]);

    //토큰 받아오기
    const loadTokenData = useCallback(async()=>{
        const token = axios.defaults.headers.common['Authorization'];
        if (!token) return;
        const resp = await axios.get(`/member/${token}`);
        setpointItems(prevState => ({
            ...prevState,
            memberId: token(resp.data)
        }));
        console.log("token:",token.data);
    },[]);

    //보내기
    const waitPoint = async()=>{
        

        // if (!chargeResult()) {
        //     console.error('폼에 유효하지 않거나 누락된 데이터가 있습니다.');
        //     return;
        // }
        console.log('pointItems:', pointItems);

        try {
            // 비동기로 백엔드에 POST 요청을 보냅니다.
            const response = await axios.post('/point/', pointItems, {
                headers: {
                    Authorization: axios.defaults.headers.common['Authorization']}
                });

            // 회원가입 성공 후 처리
            console.log('성공:', response.data);
            // 성공적으로 가입했을 경우 리다이렉트하거나 폼 데이터를 초기화할 수 있습니다.

        } catch (error) {
            // 회원가입 중 오류 발생 시 처리
            console.error('오류 발생:', error.response ? error.response.data : error.message);
        }
    };

    // const waitPoint = async () => {
    //     try {
    //         const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 가져오기
    //         if (!token) {
    //             console.error('Token not found');
    //             return;
    //         }

    //         // 사용자의 토큰과 충전할 포인트를 서버에 전달합니다.
    //         const resp = await axios.post(`/point/${token}/${pointItems.pointAmount}`);
    //         console.log('Response:', resp.data);
    //     } catch (error) {
    //         console.error('Error while waiting point:', error);
    //     }
    // };


    return (
        <form onSubmit={waitPoint}>
            <h1>포인트 테스트할게요~</h1>
            
            <div className='row mt-4'>
                <div className='col'>
                    <label>충전금액</label>
                    <input type="text" name="pointAmount"
                        className={`form-control ${result.pointAmount === true ? 'is-valid' : ''} 
                                            ${result.pointAmount === false ? 'is-invalid' : ''}`}
                                            value={pointItems.pointAmount}
                                            onChange={chargePoint}
                        />
                </div>
            </div>
            <button type="submit" className="btn btn-primary mt-3">포인트 충전</button>
        </form>
    );
}

export default TestPrice;
