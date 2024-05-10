import { useCallback, useEffect, useState } from "react";
import Jumbotron from "../../../Jumbotron";
import axios from "../../utils/CustomAxios";
import { useNavigate } from 'react-router';
import moment from "moment";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { GrFormPrevious } from "react-icons/gr";
import { GrFormNext } from "react-icons/gr";

const Notice = () => {

    //state
    const [notices, setNotices] = useState([]);
    //목록 페이징
    const [page, setPage] = useState(1);//현재 페이지 번호
    const [size, setSize] = useState(5);//목록 개수
    const [count, setCount] = useState(0);    
    // 검색 기준과 검색어를 저장할 state
    const [defaultColumn, setDefaultColumn] = useState("notice_title");//기본값
    const [keyword, setKeyword] = useState(""); // 검색어는 빈 문자열로 초기화
    const [column, setColumn] = useState("");
    const [searched, setSearched] = useState(false); //검색 여부 상태 추가
    const [fetchType, setFetchType] = useState(1);
    
    //effect
    useEffect(() => {
        if (!searched) {
            console.log("searced: " + searched);
            if (fetchType === 1) {
                loadData(); // 최신순 조회
            } else if (fetchType === 2) {
                mostView(); // 조회순 조회
            } else if (fetchType === 3) {
                handleSearch(); // 검색어 조회
            }
        }
    }, [page, size, searched, fetchType]); // 상태값 fetchType도 감시
    //목록 불러오기
    const loadData = useCallback(async () => {
        const resp = await axios.get(`/notice/page/${page}/size/${size}`);
        //setNotices([...notices, ...resp.data.list]);
        setNotices(resp.data.list);
        setCount(resp.data.pageVO.totalPage);//페이지 숫자 표시
    }, [page, size]);

    //조회수 목록 불러오기
    const mostView = useCallback(async () => {
        const resp = await axios.get(`/notice/viewPage/${page}/viewSize/${size}`);
        //setNotices([...notices, ...resp.data.list]);
        setNotices(resp.data.list);
        setCount(resp.data.pageVO.totalPage);//페이지 숫자 표시
    }, [page, size]);

    //navigator
    const navigator = useNavigate();

    //상세정보 바로가기
    const redirectDetail = useCallback((noticeNo) => {
        //강제 페이지 이동 - useNavigate()
        navigator("/NoticeDetail/" + noticeNo);
    }, []);

    //신규 등록페이지 바로가기
    const redirectAdd = useCallback(() => {
        navigator("/NoticeAdd");
    }, []);

    //페이지네이션
    const previousPage = () => {
        setPage(prevPage => Math.max(prevPage - 1, 1)); // 이전 페이지로 이동하는 함수
    };

    const nextPage = () => {
        setPage(prevPage => Math.min(prevPage + 1, count)); // 다음 페이지로 이동하는 함수
    };

    const pageChange = (pageNumber) => {
        setPage(pageNumber); // 페이지 번호를 직접 선택하여 이동하는 함수
    };

    //키워드 검색
    const handleSearch = useCallback(async () => {
        setPage(1);

        console.log("searched2 : " + searched)
        // console.log("search : " + handleSearch)
        // console.log("column : " + defaultColumn);
        // console.log("keyword : " + keyword);
        const resp = await axios.get(`/notice/search/column/${defaultColumn}/keyword/${keyword}`,{
             params: { page: page, size: size }
        });
        setNotices(resp.data.list);
        setCount(resp.data.pageVO.totalPage); // 페이지 숫자 업데이트
        setSearched(true);
    }, [keyword, defaultColumn, size]);
    
    const keywordChange = (e) => {
        setKeyword(e.target.value);
    };
    const columnChange = (e) => {
        setDefaultColumn(e.target.value);
    };

    //화면 출력
    return (
        <>
            <div className="row mt-4">
                <div className="col">
                    <h2>공지사항</h2>
                </div>
            </div>
            <hr />

            <div className="row mt-5">
                <div className="col d-flex justify-content-between">
                    <div className="text-center">
                        <select className="me-1" onChange={columnChange}>
                            {/* <option value="">선택</option> */}
                            <option value="notice_title">제목</option>
                            <option value="notice_content">내용</option>
                        </select>
                        <input className="me-1" onChange={keywordChange}/>
                        <button className="btn btn-warning btn-sm" onClick={handleSearch}><FaMagnifyingGlass /></button>
                    </div>

                    <div>
                        <button className="btn btn-sm" onClick={e => mostView()}>
                            조회순
                        </button>
                        <button className="btn btn-sm" onClick={e => loadData()}>
                            최신순
                        </button>
                    </div>
                </div>
            </div>

            <div className="text-end">
                <select value={size} onChange={e => setSize(parseInt(e.target.value))} className="me-1">
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                </select>
                개씩 보기
            </div>

            <div className="row mt-4">
                <div className="col">
                    <table className="table table-hover">
                        <thead className="text-center">
                            <tr>
                                <th style={{ width: '1%' }}>No</th>
                                <th style={{ width: '15%' }}>번호</th>
                                <th style={{ width: '45%' }}>제목</th>
                                <th style={{ width: '25%' }}>등록일</th>
                                <th style={{ width: '15%' }}>조회</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {/* index 임시 구현 삭제必 */}
                            {notices.map((notice, index) => (
                                <tr key={notice.noticeNo} onClick={e => redirectDetail(notice.noticeNo)}>
                                    <td>{index + 1}</td>
                                    <td>{notice.noticeNo}</td>
                                    <td className="text-start" style={{ maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{notice.noticeTitle}</td>
                                    <td>{moment(notice.noticeWdate).format("YYYY-MM-DD HH:mm")}</td>
                                    <td>{notice.noticeViewCount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>


            {/* 페이지네이션 UI */}
            <div className="row mt-2">
                <div className="col">
                    <nav aria-label="...">
                        <ul className="pagination justify-content-center">
                            {/* <li className="page-item disabled">
                                <a className="page-link" href="#" tabindex="-1" aria-disabled="true">
                                    <GrFormPrevious/>
                                </a>
                            </li>
                            <li className="page-item"><a className="page-link" href="#">1</a></li>
                            <li className="page-item active" aria-current="page">
                                <a className="page-link" href="#">2</a>
                            </li>
                            <li className="page-item"><a className="page-link" href="#">3</a></li>
                            <li className="page-item">
                                <a className="page-link" href="#">
                                    <GrFormNext />
                                </a>
                            </li> */}
                            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={previousPage}>
                                    <GrFormPrevious />
                                </button>
                            </li>
                            {[...Array(count).keys()].map(pageNumber => (
                                <li key={pageNumber + 1} className={`page-item ${page === pageNumber + 1 ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => pageChange(pageNumber + 1)}>{pageNumber + 1}</button>
                                </li>
                            ))}
                            <li className={`page-item ${page === count ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={nextPage}>
                                    <GrFormNext />
                                </button>
                            </li>

                        </ul>
                    </nav>
                </div>
            </div>
            {/* 페이지네이션 UI 끝 */}

            <div className="row mt-2">
                <div className="col">

                    <div className="text-end">
                        <button className="btn btn-primary" onClick={e => redirectAdd()}>
                            새 공지사항
                        </button>
                    </div>
                </div>
            </div>
        </>

    );
};
export default Notice;