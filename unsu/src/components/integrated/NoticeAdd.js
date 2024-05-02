import { useCallback, useState } from "react";
import axios from "../utils/CustomAxios";
import Jumbotron from "../../Jumbotron";

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
        const resp = await axios.post("/notice/", input);
    }, [input]);

 

    return(

        <>
            <Jumbotron title="공지사항 등록페이지" />

            <div className="row">
                <div className="col">
                    <label>제목</label>
                    <input type="text" name="noticeTitle"
                        value={input.noticeTitle}
                        onChange={e => changeInput(e)}
                        className="form-control"/>
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <label>내용</label>
                    <textarea type="text" name="noticeContent"
                        value={input.noticeContent}
                        onChange={e => changeInput(e)}
                        className="form-control">
                    </textarea>
                </div>
            </div>


            

            <div className="modal-footer">
                <button className='btn btn-success' onClick={e=>saveInput()}>
                    등록
                </button>
            </div>

        </>
    );
};

export default NoticeAdd;