import { useCallback, useEffect, useState } from "react";
import axios from "../../utils/CustomAxios";
import Jumbotron from "../../../Jumbotron";
import { MdPublishedWithChanges } from "react-icons/md";
import { MdCancel } from "react-icons/md";
import Pagination from '../../utils/Pagination';


const PointList = () => {
    //state
    const [points, setPoints] = useState([]);
    //포인트상태
    const [pointState, setPointState] = useState('결제대기'); //결제대기를 기본창으로 띄어줌
    //state
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPages, setPostsPerPages] = useState(5);

    //
    useEffect(() => {
        loadData();
    }, []);

    //유즈이펙트
    useEffect(() => {
        setPostsPerPages(5);
    }, [points]);

    // //토큰 받아오기
    // const loadTokenData = useCallback(async()=>{
    //     const token = axios.defaults.headers.common['Authorization'];
    //     if (!token) return;
    //     const resp = await axios.get(`/member/${token}`);
    //     setPoints(resp.data);
    // },[]);

    // const waitPoint = async (token, pointAmount) => {
    //     try {
    //         const resp = await axios.post(`member/${token}/${pointAmount}`, {}, {
    //             headers: {
    //                 'Authorization': token
    //             }
    //         });
    //         if (resp.data) {
    //             // 서버로부터 받은 응답 데이터 처리
    //         }
    //     } catch (error) {
    //         console.error('Error:', error);
    //     }
    // };

    //등록 된 목록 불러오기
    const loadData = useCallback(async () => {
        const resp = await axios.get("/point/");
        setPoints(resp.data);
    }, [points]);

    //금액 단위 포맷하기
    const formatCurrency = (value) => {
        return value.toLocaleString('ko-KR', { currency: 'KRW' });
    };


    //승인버튼
    const pointStateOk = async (pointNo, newState) => {
        const choice = window.confirm("해당 구매 건을 승인하시겠습니까?");
        if (choice === false) return;

        try {
            const resp = await axios.patch("/point/", { pointNo, pointState: newState });
            if (resp.status === 200) {
                const respPlusMemberPoint = await axios.get("/member/points/" + pointNo);
                if (respPlusMemberPoint.status === 200) {
                    alert("승인하셨습니다.");
                    loadData();
                    console.log("아싸 ㅠㅠ! 성공!!!!!!!!!!");
                }
                else {
                    console.error("안됨.포인트안올라감.", respPlusMemberPoint.data);
                }
            }
            else { console.error("상태업데이트 오류", resp.data); }
        } catch (error) {
            console.error("Error updating point state:", error);
        }
    };

    //반려버튼
    const pointStateNo = async (pointNo, newState) => {
        const choice = window.confirm("해당 구매 건을 반려하시겠습니까?");
        if (choice === false) return;

        try {
            const resp = await axios.patch("/point/", { pointNo, pointState: newState });
            if (resp.status === 200) {
                // 업데이트가 성공하면 포인트 목록 다시 불러오기
                alert("거절되었습니다.");
                loadData();
            }
        } catch (error) {
            console.error("Error updating point state:", error);
        }
    };

    // //결제대기로 가기 버튼
    // const pointStateBack = async (pointNo, newState) => {
    //     const choice = window.confirm("실행을 취소하시겠습니까?");
    //     if (choice === false) return;

    //     try {
    //         const resp = await axios.patch("/point/", { pointNo, pointState: newState });
    //         if (resp.status === 200) {
    //             // 업데이트가 성공하면 포인트 목록 다시 불러오기
    //             loadData();
    //         }
    //     } catch (error) {
    //         console.error("Error updating point state:", error);
    //     }
    // };


    // 필터링된 데이터를 상태에 따라 내림차순으로 정렬합니다.
    const sortedPoints = points
        .filter(point => point.pointState === pointState) // 선택한 상태에 따라 필터링
        .sort((a, b) => {
            // 승인 또는 반려 상태인 경우 내림차순으로 정렬
            if (pointState === '승인' || pointState === '반려') {
                return new Date(b.pointTime) - new Date(a.pointTime);
            }
            // 다른 상태인 경우는 정렬하지 않음
            return 0;
        });

    // 메뉴를 클릭하여 선택된 메뉴 변경
    const handleStateClick = (pointState) => {
        setPointState(pointState);
        setCurrentPage(1); //상태메뉴 바꿀 때마다 페이징 1로 초기화
    };

    //상태에 따른 목록 필터링
    const filteredData = sortedPoints.filter(point => point.pointState === pointState); 
    // 현재 페이지에 해당하는 데이터의 시작 인덱스 계산
    const startIndex = (currentPage - 1) * postsPerPages;
    // 현재 페이지에 해당하는 데이터의 끝 인덱스 계산
    const endIndex = startIndex + postsPerPages;
    // 현재 페이지에 해당하는 데이터만 반환
    const currentPost = filteredData.slice(startIndex, endIndex);


    return (
        <>
            <Jumbotron title="포인트 충전 관리" />

            <div className="row mt-4">
                <div className="col text-end">
                    <button className="btn btn-outline-secondary me-1" onClick={() => handleStateClick('결제대기')}>결제대기</button>
                    <button className="btn btn-outline-success me-1" onClick={() => handleStateClick('승인')}>승인</button>
                    <button className="btn btn-outline-danger" onClick={() => handleStateClick('반려')}>반려</button>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <table className="text-center table table-hover">
                        <thead className="table-primary">
                            <tr>
                                <th style={{ width: '12%' }}>번호</th>
                                <th>충전 일시</th>
                                <th>회원 ID</th>
                                <th>충전 금액</th>
                                <th>충전 상태</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {currentPost.filter(point => point.pointState === pointState).map(point => (
                                <tr key={point.pointNo}>
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
                                    {point.pointState === '결제대기' && (
                                        <>
                                            <td>
                                                <MdPublishedWithChanges className="text-success me-4"
                                                    onClick={() => pointStateOk(point.pointNo, "승인")}
                                                    title="승인" style={{ cursor: 'pointer' }} />
                                                <MdCancel className="text-danger me-3"
                                                    onClick={() => pointStateNo(point.pointNo, "반려")}
                                                    title="반려" style={{ cursor: 'pointer' }} />
                                            </td>
                                        </>
                                    )}
                                    {/* 여기서부터는 백엔드 구현 안되면 지워도 될듯 */}
                                    {/* {point.pointState === '승인' && (
                                        <>
                                            <td>
                                                <RiArrowGoBackFill
                                                    onClick={() => pointStateBack(point.pointNo, "결제대기")}
                                                    title="되돌리기" style={{ cursor: 'pointer' }} />
                                            </td>
                                        </>
                                    )}
                                    {point.pointState === '반려' && (
                                        <>
                                            <td>
                                                <RiArrowGoBackFill
                                                    onClick={() => pointStateBack(point.pointNo, "결제대기")}
                                                    title="되돌리기" style={{ cursor: 'pointer' }} />
                                            </td>
                                        </>
                                    )} */}
                                    {/* 여기까지 */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <Pagination
                postsPerPage={postsPerPages}
                totalPages={Math.ceil(filteredData.length / postsPerPages)}
                paginate={setCurrentPage}
                currentPage={currentPage}
            />
        </>
    );
};

export default PointList;