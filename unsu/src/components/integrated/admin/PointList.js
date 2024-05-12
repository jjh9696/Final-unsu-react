import { useCallback, useEffect, useState } from "react";
import axios from "../../utils/CustomAxios";
import Jumbotron from "../../../Jumbotron";


const PointList = () => {
    //state
    const [points, setPoints] = useState([]);


    //
    useEffect(()=>{
        loadData();
    },[]);
    // //토큰 받아오기
    // const loadTokenData = useCallback(async()=>{
    //     const token = axios.defaults.headers.common['Authorization'];
    //     if (!token) return;
    //     const resp = await axios.get(`/member/${token}`);
    //     setPoints(resp.data);
    // },[]);

    //등록 된 목록 불러오기
    const loadData = useCallback(async()=>{
        const resp = await axios.get("/point/");
        setPoints(resp.data);
    },[points]);



    return (
        <>
            <Jumbotron title="포인트 충전 관리"/>

            <div className="row mt-4">
                <div className="col">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>회원 ID</th>
                                <th>충전 금액</th>
                                <th>충전 일시</th>
                                <th>충전 상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            {points.map(point=>(
                                <tr>
                                    <td>{point.pointNo}</td>
                                    <td>{point.memberId}</td>
                                    <td>{point.pointAmount}</td>
                                    <td>{point.pointTime}</td>
                                    <td>{point.pointState}</td>
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