import { useCallback, useState } from "react";
import axios from "../../utils/CustomAxios";
import Jumbotron from "../../../Jumbotron";
import Notice from './Notice';
import { Navigate, useNavigate } from "react-router";

const NoticeAdd = ()=>{

    const [input, setInput] = useState({
        noticeTitle:"",
        noticeContent:""
    });

    //등록
    const changeInput = useCallback((e) => {
        const name = e.target.name;
        const value = e.target.value;

        //등록창 입력 변경
        setInput({
            ...input,
            [name]: value
        });
    }, [input]);

    //등록 버튼
    const saveInput = useCallback(async ()=>{
        try {
            const resp = await axios.post("/notice/", input);
            clearInput();
            //등록시 알림창
            alert("등록이 완료되었습니다."); 
            redirectList(); //목록 페이지 이동
        }
        catch (error){
            console.error("등록 중 오류가 발생했습니다:", error);
        }
    }, [input]);

    //navigator
    const navigator = useNavigate();
    //목록 바로가기
    const redirectList = useCallback(() => {
        navigator("/Notice");
    }, []);

    //취소 버튼
    const cancelInput = useCallback(() => {
        //취소시 알림창
        const choice = window.confirm("작성을 취소하시겠습니까?");
        if(choice === false) return;

        setInput({
            noticeTitle: "",
            noticeContent: ""
        });
        navigator("/Notice");
    }, [input]);

    //입력값 초기화
    const clearInput = useCallback(()=>{
        setInput({
            noticeTitle: "",
            noticeContent: ""
        });
    }, [input]);

    return(

        <>
            <Jumbotron title="공지사항 등록페이지" />

            <div className="row mt-5">
                <div className="col">
                    
                    <input type="text" name="noticeTitle"
                        placeholder="제목을 입력하세요"
                        value={input.noticeTitle}
                        onChange={e => changeInput(e)}
                        className="form-control"/>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    
                    <textarea type="text" name="noticeContent"
                        placeholder="내용을 입력하세요"
                        value={input.noticeContent}
                        onChange={e => changeInput(e)}
                        className="form-control">
                    </textarea>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <button className='btn btn-success ' onClick={e=>saveInput()}>
                        등록
                    </button>
                    <button className="btn btn-danger" onClick={e => cancelInput()}>
                        취소
                    </button>
                </div>
            </div>

        </>
    );
};

export default NoticeAdd;