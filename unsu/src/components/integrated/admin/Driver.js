import { useCallback, useState, useEffect, useRef } from "react";
import axios from "../../utils/CustomAxios";
import Jumbotron from "../../../Jumbotron";
import { FaClipboardUser } from "react-icons/fa6";
import { Modal } from 'bootstrap';
import { TiUserDelete } from "react-icons/ti";
import { FaUserEdit } from "react-icons/fa";
import { selector } from 'recoil';


const Driver = () => {

    //state
    const [drivers, setDrivers] = useState([]);
    const [input, setInput] = useState({
        driverName: "",
        driverContact: "",
        driverAge: "",
        driverLicense: "",
        driverDate: ""
    });
    const [backup, setBackup] = useState(null); //백업
    //개인 상세정보 불러오기
    const [selectedDriver, setSelectedDriver] = useState({
        driverName: "",
        driverContact: "",
        driverAge: "",
        driverLicense: "",
        driverDate: "",
        edit: false
    });
    //state
    const [currentPages, setCurrentPages] = useState(1);
    const [postPerPages, setPostPerPages] = useState(5);


    //통신해서 목록불러오기 effect
    useEffect(() => {
        loadData();
        // loadDetailData();
    }, []);
    //유즈이펙트
    useEffect(() => {
        setPostPerPages(5);
    }, [drivers]);

    //목록 부르기 callback
    const loadData = useCallback(async () => {
        const resp = await axios.get("/driver/");
        setDrivers(resp.data);
    }, [drivers]);



    //삭제하기
    const deleteDriver = useCallback(async (target) => {
        //확인창
        const choice = window.confirm("해당 기사님을 해고하시겠습니까?");
        if (choice === false) return;

        const resp = await axios.delete("/driver/" + target.driverNo);
        loadData();
    }, [drivers]);


    //신규 등록 화면 입력값 변경
    const changeInput = useCallback((e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        });
    }, [input]);
    //데이터 등록
    const saveInput = useCallback(async () => {
        const resp = await axios.post("/driver/", input);
        loadData();
        clearInput();
        closeModalCreate();
    }, [input]);
    //등록 취소
    const cancelInput = useCallback(() => {
        const choice = window.confirm("등록을 취소하시겠습니까?");
        if (choice === false) return;
        clearInput();
        closeModalCreate();
    }, [input]);
    //입력값 초기화
    const clearInput = useCallback(() => {
        setInput({
            driverName: "",
            driverContact: "",
            driverAge: "",
            driverLicense: "",
            driverDate: ""
        });
    }, [input]);

    //수정상태로 바꾸기
    const editDriver = useCallback((target) => {
        const copy = { ...selectedDriver };
        if (copy.edit === true) { //수정중인 항목이 있다면
            copy.edit = false; //백업으로 갱신 + 수정모드 취소
        }

        setBackup({ ...selectedDriver }); //백업해두기 나중을 위해

        //카피 고치기
        if (target.driverNo === copy.driverNo) { //둘이 같다면
            copy.edit = true; //정보유지하고 수정처리
        }

        //덮어쓰게 세팅
        setSelectedDriver(copy);
    }, [selectedDriver]);

    //입력한 내용 수정
    const changeDriver = useCallback((e, target) => {
        const copy = { ...selectedDriver };

        //target과 동일한 정보 가진 항목 찾아 수정
        if (target.driverNo === copy.driverNo) {
            copy[e.target.name] = e.target.value;
        }
        setSelectedDriver(copy);
    }, [selectedDriver]);

    //수정된 결과 저장하고 목록 갱신하기
    const saveEditDriver = useCallback(async (target) => {
        //서버에 타겟 전달하고 수정처리
        const resp = await axios.patch("/driver/", target);
        //목록갱신
        window.alert("수정이 완료되었습니다.");
        loadData();
        closeModalInfo();
    }, [selectedDriver]);

    //수정 취소하기
    const cancelEditDriver = useCallback(() => {
        //취소 확인창
        const choice = window.confirm("수정을 취소하시겠습니까?");
        if (choice === false) return;

        // 이전에 백업된 운전자 정보가 없으면 아무것도 수행하지 않습니다.
        if (!backup) return;

        // 백업된 운전자 정보를 선택된 운전자 정보로 복구합니다.
        setSelectedDriver({ ...backup, edit: false });
    }, [backup, setSelectedDriver]);



    //ref+bsModal
    const bsModal1 = useRef(); //등록
    const bsModal2 = useRef(); //상세

    //등록 모달 열기
    const openModalCreate = useCallback(() => {
        const modal = new Modal(bsModal1.current);
        modal.show();
    }, [bsModal1]);
    //등록 모달 닫기
    const closeModalCreate = useCallback(() => {
        const modal = Modal.getInstance(bsModal1.current);
        modal.hide();
    }, [bsModal1]);

    //상세보기 모달 열기
    const openModalInfo = useCallback((driver) => {
        setSelectedDriver(driver); // 클릭한 기사 정보 설정
        const modal = new Modal(bsModal2.current);
        modal.show();
    }, [bsModal2]);
    //상세보기 모달 닫기
    const closeModalInfo = useCallback(() => {
        const modal = Modal.getInstance(bsModal2.current);
        modal.hide();
    }, [bsModal2]);

    //페이징 계산
    const indexOfLastPost = currentPages * postPerPages;
    const indexOfFirstPost = indexOfLastPost - postPerPages;
    const currentPost = drivers.slice(indexOfFirstPost, indexOfLastPost);


    return (
        <>
            <Jumbotron title="기사님 관리" />

            <div className="row mt-4">
                <div className="col text-end">
                    <button className="btn btn-outline-secondary" onClick={e => openModalCreate()}>
                        <FaClipboardUser /> &nbsp;
                        기사님 등록
                    </button>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <table className="table table-hover">
                        <thead className="text-center table-primary">
                            <tr>
                                <th className="w-10">번호</th>
                                <th>이름</th>
                                <th>관리</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {currentPost.map(driver => (
                                <tr key={driver.driverNo}>
                                    <td style={{ width: '15%' }}>{driver.driverNo}</td>
                                    <td style={{ cursor: 'pointer' }}
                                        onClick={e => openModalInfo(driver)}>
                                        {driver.driverName}
                                    </td>
                                    <td style={{ width: '35%' }}>
                                        {/* 삭제버튼 */}
                                        <TiUserDelete className="text-danger"
                                            style={{ cursor: 'pointer' }}
                                            onClick={e => deleteDriver(driver)}
                                            title="해고" />
                                    </td>
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
                            {Array.from({ length: Math.ceil(drivers.length / postPerPages) }, (_, index) => (
                                <li key={index} className={`page-item ${currentPages === index + 1 ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => setCurrentPages(index + 1)}>
                                        {index + 1}
                                    </button>
                                </li>
                            ))}
                            <li className={`page-item ${currentPages === Math.ceil(drivers.length / postPerPages) ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => setCurrentPages(prev => Math.min(prev + 1, Math.ceil(drivers.length / postPerPages)))}>
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
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">신규 기사님 등록</h1>
                            <button type="button" className="btn-close" aria-label="Close" onClick={e => cancelInput()}></button>
                        </div>
                        <div className="modal-body">
                            {/* 등록 */}
                            <div className="row mt-4">
                                <div className="col">
                                    <label>기사이름</label>
                                    <input type="text" name="driverName"
                                        value={input.driverName}
                                        onChange={e => changeInput(e)}
                                        className="form-control rounded" />
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col">
                                    <label>연락처</label>
                                    <input type="text" name="driverContact"
                                        value={input.driverContact}
                                        placeholder="'-' 없이 입력"
                                        onChange={e => changeInput(e)}
                                        className="form-control rounded" />
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col">
                                    <label>생년월일</label>
                                    <input type="date" name="driverAge"
                                        value={input.driverAge}
                                        onChange={e => changeInput(e)}
                                        className="form-control rounded" />
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col">
                                    <label>면허증번호</label>
                                    <input type="text" name="driverLicense"
                                        value={input.driverLicense}
                                        onChange={e => changeInput(e)}
                                        placeholder="0-00-000000"
                                        className="form-control rounded" />
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col">
                                    <label>면허증 취득일</label>
                                    <input type="date" name="driverDate"
                                        value={input.driverDate}
                                        onChange={e => changeInput(e)}
                                        className="form-control rounded" />
                                </div>
                            </div>
                        </div>


                        <div className="modal-footer">
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



            {/* 상세보기 모달 */}
            <div ref={bsModal2} className="modal fade" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">기사님 상세정보</h1>
                            <button type="button" className="btn-close" aria-label="Close" onClick={e => closeModalInfo()}></button>
                        </div>
                        <div className="modal-body" key={drivers.driverNo}>
                            {selectedDriver && selectedDriver.edit === true ? (
                                <>
                                    <div className="row mt-4">
                                        <div className="col">
                                            <label>기사이름</label><br />
                                            <input type="text" name="driverName"
                                                className="form-control rounded"
                                                onChange={e => changeDriver(e, selectedDriver)}
                                                value={selectedDriver.driverName} />
                                        </div>
                                    </div>

                                    <div className="row mt-4">
                                        <div className="col">
                                            <label>연락처</label><br />
                                            <input type="text" name="driverContact"
                                                className="form-control rounded"
                                                onChange={e => changeDriver(e, selectedDriver)}
                                                value={selectedDriver.driverContact} />
                                        </div>
                                    </div>

                                    <div className="row mt-4">
                                        <div className="col">
                                            <label>생년월일</label><br />
                                            <input type="date" name="driverAge"
                                                className="form-control rounded"
                                                onChange={e => changeDriver(e, selectedDriver)}
                                                value={selectedDriver.driverAge} />
                                        </div>
                                    </div>

                                    <div className="row mt-4">
                                        <div className="col">
                                            <label>면허증번호</label><br />
                                            <input type="text" name="driverLicense"
                                                className="form-control rounded"
                                                onChange={e => changeDriver(e, selectedDriver)}
                                                value={selectedDriver.driverLicense} />
                                        </div>
                                    </div>

                                    <div className="row mt-4">
                                        <div className="col">
                                            <label>면허증 취득일</label><br />
                                            <input type="date" name="driverDate"
                                                className="form-control rounded"
                                                onChange={e => changeDriver(e, selectedDriver)}
                                                value={selectedDriver.driverDate} />
                                        </div>
                                    </div>

                                    <div className="row mt-4">
                                        <div className="col text-end">
                                            <button className="btn btn-outline-success me-2"
                                                onClick={e => saveEditDriver(selectedDriver)}>
                                                저장
                                            </button>
                                            <button className="btn btn-outline-danger"
                                                onClick={e => cancelEditDriver(selectedDriver)}>
                                                취소
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="row mt-4">
                                        <div className="col">
                                            <label>기사이름</label>
                                            <h3>{selectedDriver.driverName}</h3>
                                        </div>
                                    </div>

                                    <div className="row mt-4">
                                        <div className="col">
                                            <label>연락처</label>
                                            <h3>{selectedDriver.driverContact}</h3>
                                        </div>
                                    </div>

                                    <div className="row mt-4">
                                        <div className="col">
                                            <label>생년월일</label>
                                            <h3>{selectedDriver.driverAge}</h3>
                                        </div>
                                    </div>

                                    <div className="row mt-4">
                                        <div className="col">
                                            <label>면허증번호</label>
                                            <h3>{selectedDriver.driverLicense}</h3>
                                        </div>
                                    </div>

                                    <div className="row mt-4">
                                        <div className="col">
                                            <label>면허증 취득일</label>
                                            <h3>{selectedDriver.driverDate}</h3>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row mt-3">
                                        <div className="col text-end">
                                            <button className="btn btn-outline-primary me-2"
                                                onClick={e => editDriver(selectedDriver)}>
                                                수정
                                            </button>
                                            <button className="btn btn-outline-secondary"
                                                onClick={e => closeModalInfo()}>
                                                닫기
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};


export default Driver;