import { useNavigate } from "react-router";
import axios from "../../utils/CustomAxios";
import React, { useCallback, useState } from 'react';
import { FaMoneyBillWave } from "react-icons/fa"
import { SiKakao } from "react-icons/si";


const Point = () => {

    const [pointTest, setPointTest] = useState({
        pointNo: '',
        memberId: '',
        pointAmount: ''
    });
    //충전버튼 락 걸기
    const [buttonSelected, setButtonSelected] = useState(false);
    //피드백 메세지
    const [feedbackMessage, setFeedbackMessage] = useState('');
    //입력창 이벤트
    const [isValidInput, setIsValidInput] = useState('');

    //포인트 입력창 이벤트
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const regex = /^[0-9]{1,8}$/;
        if(regex.test(value) || value === ''){
            setPointTest(prevState => ({
                ...prevState,
                [name]: value
            }));
            setIsValidInput(true);
            setFeedbackMessage('');
        }
        else{
            setIsValidInput(false);
            setFeedbackMessage('숫자만 입력하세요.');
            
        }
    };

    //버튼 선택시 충전 가능
    const handleAccountClick = () => {
        setButtonSelected(!buttonSelected);
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
        navigator("/mypage");
    }, [pointTest]); // 의존성 배열에 추가

    const navigator = useNavigate();

    return (
        <>
            <div className="row mt-4 mb-4">
                <h2>포인트 충전</h2>
                <hr/>
            </div>

            <div className='row border'>

                <div className='col border-end'>
                    <label className="mt-3 ms-2">충전금액</label>
                    <hr/>
                    <input type="text" name="pointAmount"
                        className={`form-control rounded mt-2 ${isValidInput === true ? 'is-valid' : '' } ${isValidInput === false ? 'is-invalid' : ''}`}
                        value={pointTest.pointAmount}
                        onChange={handleInputChange}
                        placeholder="원 단위의 숫자만 입력"
                    />
                    {feedbackMessage && <div className="ms-2" style={{color:'#eb4d4b'}}>{feedbackMessage}</div>}
                </div>

                <div className="col mb-3">
                    <label className="mt-3 ms-2">결제수단</label>
                    <hr/>
                    <div className="ms-2 mb-4">
                        <button className="btn btn-light"
                                data-bs-toggle="button"
                                onClick={handleAccountClick}
                                 ><FaMoneyBillWave className="text-success"/>&nbsp;계좌이체</button>
                        {/* <button className="ms-3 btn btn-light"><SiKakao/>&nbsp;카카오페이</button> */}
                    </div>
                    <div className="col text-end">
                        <button className="btn btn-primary"
                                onClick={saveInput}
                                disabled={!buttonSelected}>포인트 충전</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Point;