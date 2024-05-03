import { useCallback, useEffect, useState } from "react";
import Jumbotron from "../../../Jumbotron";
import axios from "../../utils/CustomAxios";
import { useNavigate } from 'react-router';
import moment from "moment";
import { FaMagnifyingGlass } from "react-icons/fa6";


const Notice = () => {

    //state
    const [notices, setNotices] = useState([]);
    //목록 페이징
    const [page, setPage] = useState(1);//현재 페이지 번호
    const [size, setSize] = useState(10);//목록 개수
    const [count, setCount] = useState(0);
    //effect
    useEffect(() => {
        loadData();
    }, []);

    //목록 불러오기
    const loadData = useCallback(async () => {
        const resp = await axios.get(`/notice/page/${page}/size/${size}`);
        setNotices([...notices, ...resp.data.list]);
        setNotices(resp.data.list);
        setCount(resp.data.count);

    }, [notices]);

    //조회수 목록 불러오기
    const mostView = useCallback(async () => {
        const resp = await axios.get(`/notice/viewPage/${page}/viewSize/${size}`);
        setNotices([...notices, ...resp.data.list]);
        setNotices(resp.data.list);
        setCount(resp.data.count);
    }, [notices]);

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
                        <select className="me-1">
                            <option>선택</option>
                            <option>제목</option>
                            <option>내용</option>
                        </select>
                        <input className="me-1" />
                        <button className="btn btn-warning btn-sm"><FaMagnifyingGlass /></button>
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