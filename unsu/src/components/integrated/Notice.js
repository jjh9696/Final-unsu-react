import { useCallback, useEffect, useState } from "react";
import Jumbotron from "../../Jumbotron";
import axios from "../utils/CustomAxios";

const Notice = ()=>{

    //state
    const [notices, setNotices] = useState([]);
    
    //effect
    useEffect(()=>{
        loadData();
    }, []);

    //목록 불러오기
    const loadData = useCallback(async () =>{
        const resp = await axios.get("/notice/");
        setNotices(resp.data);
    }, [notices]);
    

    //화면 출력
    return (
        <>
            <Jumbotron title="공지사항"/>

            <div className="row mt-4">
                <div className="col">
                    <table className="table table-striped table-hover">
                        <thead className="text-center">
                            <tr>
                                <th>
                                    <td>제목</td>
                                    <td>내용</td>
                                    <td>작성날짜</td>
                                    <td>조회수</td>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {notices.map(notice =>(
                                <tr key={notice.noticeNo}>
                                    <td>{notice.noticeTitle}</td>
                                    <td>{notice.noticeContent}</td>
                                    <td>{notice.noticeWdate}</td>
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