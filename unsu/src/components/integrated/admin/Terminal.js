import { useCallback, useEffect, useRef, useState } from "react";
import axios from "../../utils/CustomAxios";
import Jumbotron from "../../../Jumbotron";
import { Modal } from "bootstrap";
import { FaWarehouse } from "react-icons/fa";
import { FaHouseCircleExclamation } from "react-icons/fa6";
import { FaHouseCircleXmark } from "react-icons/fa6";
import { FaHouseCircleCheck } from "react-icons/fa6";
import { MdBackspace } from "react-icons/md";
import Pagination from "../../utils/Pagination";


const Terminal = () => {

    //state
    const [terminals, setTerminals] = useState([]);
    const [input, setInput] = useState({
        terminalName: "",
        terminalRegion: ""
    });
    const [backup, setBackup] = useState(null); //백업
    const [currentPages, setCurrentPages] = useState(1);
    const [postPerPages, setPostPerPages] = useState(10);


    useEffect(() => {
        loadData();
    }, []);
    useEffect(() => {
        setPostPerPages(10);
    }, [terminals]);

    //터미널정보 불러오기
    const loadData = useCallback(async () => {
        const resp = await axios.get("/terminal/");
        setTerminals(resp.data);
    }, [terminals]);


    //데이터 삭제
    const deleteTerminal = useCallback(async (target) => {
        //확인창
        const choice = window.confirm("해당 터미널을 삭제하시겠습니까?");
        if (choice === false) return;

        const resp = await axios.delete("/terminal/" + target.terminalId);
        loadData();
    }, [terminals]);


    //데이터 등록
    const saveInput = useCallback(async () => {
        const resp = await axios.post("/terminal/", input);
        loadData();
        clearInput();
        closeModalCreate();
    }, [input]);
    //등록 취소
    const cancelInput = useCallback(() => {
        const choice = window.confirm("취소하시겠습니까?");
        if (choice === false) return;
        clearInput();
        closeModalCreate();
    }, [input]);
    //입력값 초기화
    const clearInput = useCallback(() => {
        setInput({
            terminalName: "",
            terminalRegion: ""
        });
    }, [input]);
    //등록 입력값 변경
    const changeInput = useCallback((e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        });
    }, [input]);


    //수정하기
    const editTerminal = useCallback((target) => {
        const copy = [...terminals];

        const recover = copy.map(terminal => {
            if (terminal.edit === true) {
                return { ...backup, edit: false };
            }
            else { return { ...terminal }; }
        });
        setBackup({ ...target });

        const copy2 = recover.map(terminal => {
            if (target.terminalId === terminal.terminalId) {
                return { ...terminal, edit: true, };
            }
            else {
                return { ...terminal };
            }
        });
        setTerminals(copy2);
    }, [terminals]);
    //수정취소
    const cancelEditTerminal = useCallback((target) => {
        const copy = [...terminals];
        const copy2 = copy.map(terminal => {
            if (target.terminalId === terminal.terminalId) {
                return { ...backup, edit: false, };
            }
            else { return { ...terminal }; }
        });
        setTerminals(copy2);
    }, [terminals]);
    //입력창 실행 함수
    const changeTerminal = useCallback((e, target) => {
        const copy = [...terminals];
        const copy2 = copy.map(terminal => {
            if (target.terminalId === terminal.terminalId) {
                return {
                    ...terminal,
                    [e.target.name]: e.target.value
                };
            }
            else { return { ...terminal }; }
        });
        setTerminals(copy2);
    }, [terminals]);
    //수정 저장, 목록
    const saveEditTerminal = useCallback(async (target) => {
        const resp = await axios.patch("/terminal/", target);
        loadData();
    }, [terminals]);




    //ref+Modal
    const bsModal1 = useRef(); //등록

    //등록모달 열기
    const openModalCreate = useCallback(() => {
        const modal = new Modal(bsModal1.current);
        modal.show();
    }, [bsModal1]);
    //등록모달 닫기
    const closeModalCreate = useCallback(() => {
        const modal = Modal.getInstance(bsModal1.current);
        modal.hide();
    }, [bsModal1]);

    //페이징
    const indexOfLastPost = currentPages * postPerPages;
    const indexOfFirstPost = indexOfLastPost - postPerPages;
    const currentPost = terminals.slice(indexOfFirstPost, indexOfLastPost);

    return (
        <>
            <Jumbotron title="터미널 관리" />


            {/*  신규 생성 버튼 */}
            <div className="row mt-4">
                <div className="col text-end">
                    <button className="btn btn-outline-secondary"
                        onClick={e => openModalCreate()}>
                        <FaWarehouse /> &nbsp;
                        터미널 추가
                    </button>
                </div>
            </div>


            {/* 목록 */}
            <div className="row mt-4">
                <div className="col text-center">
                    <table className="table table-hover">
                        <thead className="table-primary">
                            <tr>
                                <th>터미널ID</th>
                                <th>터미널명</th>
                                <th>지역</th>
                                <th style={{ width: '25%' }}>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPost.map(terminal => (
                                <tr key={terminal.terminalId}>
                                    {terminal.edit === true ? (
                                        <>
                                            <td>{terminal.terminalId}</td>
                                            <td>
                                                <input type="text" className="form-control rounded"
                                                    name="terminalName"
                                                    value={terminal.terminalName}
                                                    onChange={e => changeTerminal(e, terminal)} />
                                            </td>
                                            <td>
                                                <input type="text" className="form-control rounded"
                                                    name="terminalRegion"
                                                    value={terminal.terminalRegion}
                                                    onChange={e => changeTerminal(e, terminal)} />
                                            </td>
                                            <td>
                                                <FaHouseCircleCheck className="text-success"
                                                    onClick={e => saveEditTerminal(terminal)}
                                                    style={{ cursor: 'pointer' }} />
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                <MdBackspace className="text-warning"
                                                    onClick={e => cancelEditTerminal(terminal)}
                                                    style={{ cursor: 'pointer' }} />
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>{terminal.terminalId}</td>
                                            <td>{terminal.terminalName}</td>
                                            <td>{terminal.terminalRegion}</td>
                                            <td>
                                                <FaHouseCircleExclamation className="text-primary"
                                                    onClick={e => editTerminal(terminal)}
                                                    style={{ cursor: 'pointer' }}
                                                    title="수정" />
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                <FaHouseCircleXmark className="text-danger"
                                                    onClick={e => deleteTerminal(terminal)}
                                                    style={{ cursor: 'pointer' }}
                                                    title="삭제" />
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>



            {/* 페이지네이션 */}
            <div className="pagination-container">
                <div className="pagination d-flex justify-content-center">
                    <nav aria-label="Page navigation">
                        <ul className="pagination">
                            <li className={`page-item ${currentPages === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => setCurrentPages(prev => Math.max(prev - 1, 1))}>
                                    이전
                                </button>
                            </li>
                            {Array.from({ length: Math.ceil(terminals.length / postPerPages) }, (_, index) => {
                                const totalPages = Math.ceil(terminals.length / postPerPages);
                                const startPage = Math.floor((currentPages - 1) / 10) * 10 + 1;
                                const endPage = Math.min(startPage + 9, totalPages);
                                return (
                                    (index + 1 >= startPage && index + 1 <= endPage) && (
                                        <li key={index} className={`page-item ${currentPages === index + 1 ? 'active' : ''}`}>
                                            <button className="page-link" onClick={() => setCurrentPages(index + 1)}>
                                                {index + 1}
                                            </button>
                                        </li>
                                    )
                                );
                            })}
                            <li className={`page-item ${currentPages === Math.ceil(terminals.length / postPerPages) ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => setCurrentPages(prev => Math.min(prev + 1),Math.ceil(terminals.length / postPerPages))}>
                                    다음
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>






            {/* 등록 모달 */}
            <div ref={bsModal1} className="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">신규 터미널 추가</h1>
                            <button type="button" className="btn-close" aria-label="Close" onClick={e => cancelInput()}></button>
                        </div>
                        <div className="modal-body">
                            {/* 등록 */}
                            <div className="row mt-4">
                                <div className="col">
                                    <label>터미널명</label>
                                    <input type="text" name="terminalName"
                                        value={input.terminalName}
                                        onChange={e => changeInput(e)}
                                        className="form-control rounded" />
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col">
                                    <label>지역</label>
                                    <input type="text" name="terminalRegion"
                                        value={input.terminalRegion}
                                        onChange={e => changeInput(e)}
                                        className="form-control rounded" />
                                </div>
                            </div>


                            <div className="mt-4 text-end">
                                <button className="btn btn-outline-success me-2"
                                    onClick={e => saveInput()}>
                                    등록
                                </button>
                                <button className="btn btn-outline-danger"
                                    onClick={e => cancelInput()}>
                                    취소
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};




export default Terminal;