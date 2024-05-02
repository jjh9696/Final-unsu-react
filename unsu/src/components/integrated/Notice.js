import { useCallback, useEffect, useState } from "react";
import Jumbotron from "../../Jumbotron";
import axios from "../utils/CustomAxios";
import { useNavigate } from 'react-router';


const Notice = () => {

    //state
    const [notices, setNotices] = useState([]);
    //effect
    useEffect(() => {
        loadData();
    }, []);

    //목록 불러오기
    const loadData = useCallback(async () => {
        const resp = await axios.get("/notice/");
        setNotices(resp.data);
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
            <Jumbotron title="공지사항" />

            <div className="row mt-4">
                <div className="col text-end">
                    <select>
                            <option>제목</option>
                    </select>
                    <button className="btn btn-primary" onClick={e => redirectAdd()}>
                        새 공지사항
                    </button>

                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <table className="table table-striped table-hover">
                        <thead className="text-center">
                            <tr>
                                <th>글 번호</th>
                                <th>제목</th>
                                
                                <th>작성날짜</th>
                                <th>조회수</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {notices.map(notice => (
                                <tr key={notice.noticeNo} onClick={e => redirectDetail(notice.noticeNo)}>
                                    <td>{notice.noticeNo}</td>
                                    <td style={{ maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{notice.noticeTitle}</td>
                                    <td>{notice.noticeWdate.slice(0, 10)}</td>
                                    <td>{notice.noticeViewCount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </>

    );
};
export default Notice;