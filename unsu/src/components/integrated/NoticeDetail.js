import { useLocation, useParams } from "react-router";
import Jumbotron from "../../Jumbotron";
import { useEffect } from "react";
import axios from "../utils/CustomAxios";

const NoticeDetail = (props) => {
    // const location = useLocation();
    // //원하는 곳에서 location.pathname 쓰면 현재 페이지 주소가 나옴
    // useEffect(()=>{
    //     console.log(location.pathname);
    // }, []);

    const { noticeNo } = useParams();
    useEffect(() => {
        console.log('공지사항번호:', noticeNo);
    }, []);

    2


    return (
        <>
            <Jumbotron title="공지사항" content="상세정보" />

            <div className='text-center'>
                
            </div>
        </>
    );

};
export default NoticeDetail;