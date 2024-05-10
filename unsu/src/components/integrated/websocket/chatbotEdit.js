import { useCallback, useEffect, useRef, useState } from 'react';
import axios from "../../utils/CustomAxios";
import { MdDelete } from "react-icons/md";
import { FaPlus, FaEdit } from "react-icons/fa";
import { Modal } from 'bootstrap';
import { FaCheck } from "react-icons/fa";
import { TbPencilCancel } from "react-icons/tb";

const ChatbotEdit = () => {
    // state
    const [chatbots, setChatbots] = useState([]);
    const [input, setInput] = useState({
        chatbotNo: "",
        chatbotQuestion: "",
        chatbotAnswer: ""
    });
    const [backup, setBackup] = useState(null);//수정 시 복원을 위한 백업

    // effect
    useEffect(() => {
        loadData();
    }, []);

    // callback
    const loadData = useCallback(async () => {
        const resp = await axios.get("/chatbotEdit/");
        setChatbots(resp.data);
    }, [chatbots]);

    const deleteChatbot = useCallback(async (target) => {
        const choice = window.confirm("정말 삭제하시겠습니까?");
        if (choice === false) return;
        const resp = await axios.delete("/chatbotEdit/" + target.chatbotNo);
        loadData();
    }, [chatbots]);

    //신규 등록 화면 입력값 변경
    const changeInput = useCallback((e) => {
        const name = e.target.name;
        const value = e.target.value;
        setInput({
            ...input,
            [name]: value
        });
    }, [input]);

    //등록
    const saveInput = useCallback(async () => {
        const resp = await axios.post("/chatbotEdit/", input);
        loadData();
        clearInput();
        closeModal();
    }, [input]);

    //등록 취소
    const cancelInput = useCallback(() => {
        const choice = window.confirm("작성을 취소하시겠습니까?");
        if (choice === false) return;
        clearInput();
        closeModal();
    }, [input]);

    //입력값 초기화
    const clearInput = useCallback(() => {
        setInput({
            chatbotNo: "", chatbotQuestion: "", chatbotAnswer: ""
        });
    }, [input]);

    //해당 줄을 수정상태(edit===true)로 만드는 함수
    //target은 수정을 누른 줄의 정보
    const editChatbot = useCallback((target) => {
        //1. chatbots를 복제한다
        const copy = [...chatbots];

        //(+추가) 이미 수정중인 항목이 있을 수 있으므로 해당 항목은 취소 처리가 필요
        const recover = copy.map(chatbot => {
            if (chatbot.edit === true) {//수정중인 항목을 발견하면
                return { ...backup, edit: false };//백업으로 갱신 + 수정모드 취소
            }
            else {
                return { ...chatbot };//그대로
            }
        });

        //(+추가) 나중을 위해 target을 백업해둔다 (target은 수정버튼 누른항목)
        setBackup({ ...target });

        //2. recover를 고친다
        //- recover 중에서 target과 동일한 정보를 가진 항목을 찾아서 edit : true로 만든다
        //- 배열을 변환시켜야 하므로 map 함수를 사용한다
        const copy2 = recover.map(chatbot => {
            //target : 수정버튼을 누른 챗봇정보, chatbot : 현재 회차의 챗봇정보
            if (target.chatbotNo === chatbot.chatbotNo) {//원하는 정보일 경우
                return {
                    ...chatbot,//나머지 정보는 유지하되
                    edit: true,//edit 관련된 처리를 추가하여 반환
                };
            }
            else {//원하는 정보가 아닐 경우
                return { ...chatbot };//데이터를 그대로 복제하여 반환
            }
        });

        //3. copy2를 chatbots에 덮어쓰기한다
        setChatbots(copy2);
    }, [chatbots]);

    const cancelEditChatbot = useCallback((target) => {
        //1. chatbots 복제한다
        const copy = [...chatbots];

        //2. copy를 고친다
        //- copy 중에서 target과 동일한 정보를 가진 항목을 찾아서 edit : true로 만든다
        //- 배열을 변환시켜야 하므로 map 함수를 사용한다
        const copy2 = copy.map(chatbot => {
            //target : 수정버튼을 누른 챗봇정보, chatbot : 현재 회차의 챗봇정보
            if (target.chatbotNo === chatbot.chatbotNo) {//원하는 정보일 경우
                return {
                    ...backup,//백업 정보를 전달
                    edit: false,//edit 관련된 처리를 추가하여 반환
                };
            }
            else {//원하는 정보가 아닐 경우
                return { ...chatbot };//데이터를 그대로 복제하여 반환
            }
        });

        //3. copy2를 chatbots에 덮어쓰기한다
        setChatbots(copy2);
    }, [chatbots]);

    //수정 입력창에서 입력이 발생할 경우 실행할 함수
    //-chatbots 중에서 대상을 찾아 해당 필드를 교체하여 재설정
    //e는 입력이 발생한 창의 이벤트 정보
    //- target은 입력이 발생한 창이 있는 줄의 챗봇정보
    const changeChatbot = useCallback((e, target) => {
        const copy = [...chatbots];
        const copy2 = copy.map(chatbot => {
            if (target.chatbotNo === chatbot.chatbotNo) {////이벤트 발생한 챗봇이라면
                return {
                    ...chatbot,//나머지 정보는 유지
                    [e.target.name]: e.target.value//단, 입력 항목만 교체
                };
            }
            else {//다른 챗봇이면
                return { ...chatbot };//현상유지
            }
        });
        setChatbots(copy2);
    }, [chatbots]);

    //수정된 결과를 저장 + 목록갱신 + 수정모드 해제
    const saveEditChatbot = useCallback(async (target) => {
        //서버에 target을 전달하여 수정 처리
        const resp = await axios.patch("/chatbotEdit/", target);
        //목록 갱신
        loadData();
    }, [chatbots]);

    //ref + modal
    const bsModal = useRef();

    const openModal = useCallback(() => {
        const modal = new Modal(bsModal.current);
        modal.show();
    }, [bsModal]);

    const closeModal = useCallback(() => {
        const modal = Modal.getInstance(bsModal.current);
        modal.hide();
    }, [bsModal]);

    return (
        <>

            {/* 신규 등록 버튼 */}
            <div className='row mt-4'>
                <div className='col text-end'>
                    <button className='btn btn-primary'
                        onClick={e => openModal()}>
                        <FaPlus />
                        신규 등록
                    </button>
                </div>
            </div>

            {/* 목록 출력 */}
            <div className='row mt-4'>
                <div className='col'>
                    <table className='table'>
                        <thead className='text-center'>
                            <tr>
                                <th>번호</th>
                                <th style={{ width: "30%" }}>질문</th>
                                <th style={{ width: "30%" }}>답변</th>
                                <th>동작</th>
                            </tr>
                        </thead>
                        <tbody className='text-center'>
                            {chatbots.map(chatbot => (
                                <tr key={chatbot.chatbotNo}>
                                    {chatbot.edit === true ? (
                                        <>
                                            <td>{chatbot.chatbotNo}</td>
                                            <td>
                                                <input type="text" className="form-control"
                                                    value={chatbot.chatbotQuestion} name="chatbotQuestion"
                                                    onChange={e => changeChatbot(e, chatbot)} />
                                            </td>
                                            <td>
                                                <input type="text" className="form-control"
                                                    value={chatbot.chatbotAnswer} name="chatbotAnswer"
                                                    onChange={e => changeChatbot(e, chatbot)} />
                                            </td>
                                            <td>
                                                <button className='btn btn-warning me-2'
                                                    onClick={e => saveEditChatbot(chatbot)}>
                                                    <FaCheck />
                                                    확인
                                                </button>
                                                <button className='btn btn-danger'
                                                onClick={e => cancelEditChatbot(chatbot)}>
                                                    <TbPencilCancel />
                                                    취소
                                                </button>
                                                
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>{chatbot.chatbotNo}</td>
                                            <td>{chatbot.chatbotQuestion}</td>
                                            <td>{chatbot.chatbotAnswer}</td>
                                            <td>
                                                <button className='btn btn-warning me-2'
                                                    onClick={e => editChatbot(chatbot)}>
                                                    <FaEdit />
                                                    수정
                                                </button>
                                                <button className='btn btn-danger'
                                                    onClick={e => deleteChatbot(chatbot)}>
                                                    <MdDelete />
                                                    삭제
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <div ref={bsModal} className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">신규 등록</h1>
                            <button type="button" className="btn-close" aria-label="Close"
                                onClick={e => cancelInput()}></button>
                        </div>
                        <div className="modal-body">

                            {/* 등록 화면 */}
                            <div className='row mt-4'>
                                <div className='col'>
                                    <label>번호</label>
                                    <input type="text" name="chatbotNo"
                                        value={input.chatbotNo}
                                        onChange={e => changeInput(e)}
                                        className='form-control' 
                                        placeholder='번호 겹치지 않게 입력'/>
                                </div>
                            </div>

                            <div className='row mt-4'>
                                <div className='col'>
                                    <label>질문</label>
                                    <input type="text" name="chatbotQuestion"
                                        value={input.chatbotQuestion}
                                        onChange={e => changeInput(e)}
                                        className='form-control' 
                                        placeholder='질문 입력'/>
                                </div>
                            </div>

                            <div className='row mt-4'>
                                <div className='col'>
                                    <label>답변</label>
                                    <input type="text" name="chatbotAnswer"
                                        value={input.chatbotAnswer}
                                        onChange={e => changeInput(e)}
                                        className='form-control' 
                                        placeholder='답변 입력'/>
                                </div>
                            </div>

                        </div>
                        <div className="modal-footer">
                            <button className='btn btn-success me-2' onClick={e => saveInput()}>
                                등록
                            </button>
                            <button className='btn btn-danger' onClick={e => cancelInput()}>
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChatbotEdit;
