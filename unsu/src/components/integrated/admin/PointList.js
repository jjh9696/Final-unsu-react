import { useCallback, useEffect, useState } from "react";
import axios from "../../utils/CustomAxios";
import Jumbotron from "../../../Jumbotron";
import { MdOutlineCurrencyExchange } from "react-icons/md";
import { MdPublishedWithChanges } from "react-icons/md";
import { ImCancelCircle } from "react-icons/im";



const PointList = () => {
    //state
    const [points, setPoints] = useState([]);
    //수정을 위한 백업
    const [backup, setBackup] = useState(null);
    //상태 목록
    const [states, setStates] = useState([]);

    //
    useEffect(() => {
        loadData();
    }, []);

    // //토큰 받아오기
    // const loadTokenData = useCallback(async()=>{
    //     const token = axios.defaults.headers.common['Authorization'];
    //     if (!token) return;
    //     const resp = await axios.get(`/member/${token}`);
    //     setPoints(resp.data);
    // },[]);

    const waitPoint = async (token, pointAmount) => {
        try {
            const resp = await axios.post(`member/${token}/${pointAmount}`, {}, {
                headers: {
                    'Authorization': token
                }
            });
            if (resp.data) {
                // 서버로부터 받은 응답 데이터 처리
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    //등록 된 목록 불러오기
    const loadData = useCallback(async () => {
        const resp = await axios.get("/point/");
        setPoints(resp.data);
    }, [points]);

    //금액 포맷하기
    const formatCurrency = (value) => {
        return value.toLocaleString('ko-KR', { currency: 'KRW' });
    };

    //수정하기
    const editPoint = useCallback((target) => {
        const copy = [...points];

        const recover = copy.map(point => {
            if (point.edit === true) {
                return { ...backup, edit: false };
            }
            else { return { ...point }; }
        });
        setBackup({ ...target });

        const copy2 = recover.map(point => {
            if (target.pointNo === point.pointNo) {
                return { ...point, edit: true, };
            }
            else {
                return { ...point };
            }
        });
        setPoints(copy2);
    }, [points]);
    //수정취소
    const cancelEditPoint = useCallback((target) => {
        const copy = [...points];
        const copy2 = copy.map(point => {
            if (target.pointNo === point.pointNo) {
                return { ...backup, edit: false, };
            }
            else { return { ...point }; }
        });
        setPoints(copy2);
    }, [points]);
    //입력창 실행 함수
    const changePoint = useCallback((e, target) => {
        const copy = [...points];
        const copy2 = copy.map(point => {
            if (target.pointNo === point.pointNo) {
                return {
                    ...point,
                    pointState: e.target.value // 수정된 부분
                };
            }
            else { return { ...point }; }
        });
        setPoints(copy2);
    }, [points]);
    //수정 저장, 목록
    const saveEditPoint = useCallback(async (target) => {
        const resp = await axios.patch("/point/", target);
        loadData();
    }, [points]);

    // 메뉴를 클릭하여 선택된 메뉴 변경
    const handleStateClick = (states) => {
        setStates(states);
    };


    return (
        <>
            <Jumbotron title="포인트 충전 관리" />

            <div className="row mt-4">
                <div className="col text-end">
                    <button className="btn btn-warning me-1" onClick={()=>handleStateClick('결제대기')}>결제대기</button>
                    <button className="btn btn-success me-1" onClick={()=>handleStateClick('승인')}>승인</button>
                    <button className="btn btn-danger" onClick={()=>handleStateClick('반려')}>반려</button>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <table className="text-center table">
                        <thead>
                            <tr>
                                <th style={{width:'12%'}}>번호</th>
                                <th>충전 일시</th>
                                <th>회원 ID</th>
                                <th>충전 금액</th>
                                <th>충전 상태</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                        {points.filter(point => point.pointState === states).map(point => (
                                <tr key={point.pointNo}>
                                    {point.edit === true ? (
                                        <>
                                            <td>{point.pointNo}</td>
                                            <td>{point.pointTime}</td>
                                            <td>{point.memberId}</td>
                                            <td>{formatCurrency(point.pointAmount)} Point</td>
                                            <td>
                                                <select type="text" name="pointState"
                                                        value={point.pointState}
                                                        className="form-select rounded"
                                                        onChange={e => changePoint(e, point)}>
                                                        <option value={"결제대기"}>결제대기</option>
                                                        <option value={"승인"}>승인</option>
                                                        <option value={"반려"}>반려</option>
                                                </select>
                                            </td>
                                            <td>
                                                <MdPublishedWithChanges className="text-success"
                                                    onClick={e=>saveEditPoint(point)}
                                                    style={{ cursor: 'pointer' }}/>
                                                    &nbsp; &nbsp; &nbsp;
                                                <ImCancelCircle className="text-danger"
                                                    onClick={e=>cancelEditPoint(point)}
                                                    style={{ cursor: 'pointer' }}/>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>{point.pointNo}</td>
                                            <td>{point.pointTime}</td>
                                            <td>{point.memberId}</td>
                                            <td>{formatCurrency(point.pointAmount)} Point</td>
                                            <td style={{
                                                color: point.pointState === "승인" ? "green" :
                                                    point.pointState === "반려" ? "red" :
                                                        point.pointState === "결제대기" ? "orange" : "black"
                                            }}>
                                                {point.pointState}
                                            </td>
                                            <td>
                                                <MdOutlineCurrencyExchange className="text-info"
                                                    onClick={e => editPoint(point)}
                                                    style={{ cursor: 'pointer' }} />
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default PointList;