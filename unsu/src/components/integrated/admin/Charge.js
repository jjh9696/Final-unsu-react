import { Modal } from "bootstrap";
import Jumbotron from "../../../Jumbotron";
import axios from "../../utils/CustomAxios";
import { useCallback, useEffect, useRef, useState } from "react";
import { FcMoneyTransfer } from "react-icons/fc";
import { MdEdit } from "react-icons/md";
import { MdOutlineCreditCardOff } from "react-icons/md";
import { FaCoins } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";


const Charge = () => {
    //state
    const [charges, setCharges] = useState([]);
    const [input, setInput] = useState({
        chargeType: "",
        chargePassenger: "",
        gradeType: "",
        chargePrice: ""
    });
    const [backup, setBackup] = useState(null); //백업

    //불러와
    useEffect(() => {
        loadData();
    }, []);
    //콜백해
    const loadData = useCallback(async () => {
        const resp = await axios.get("/charge/");
        setCharges(resp.data);
    }, [charges]);
    //삭제
    const deleteCharge = useCallback(async (target) => {
        //확인창
        const choice = window.confirm("요금 정보를 삭제하시겠습니까?");
        if (choice === false) return;

        const resp = await axios.delete("/charge/" + target.chargeNo);
        loadData();
    }, [charges]);
    //등록
    //신규 등록 화면 입력값 변경
    const changeInput = useCallback((e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        });
    }, [input]);
    //데이터 등록
    const saveInput = useCallback(async () => {
        const resp = await axios.post("/charge/", input);
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
            chargeType: "",
            chargePassenger: "",
            gradeType: "",
            chargePrice: ""
        });
    }, [input]);

    //수정하기
    const editCharge = useCallback((target) => {
        const copy = [...charges];

        const recover = copy.map(charge => {
            if (charge.edit === true) {
                return { ...backup, edit: false };
            }
            else { return { ...charge }; }
        });
        setBackup({ ...target });

        const copy2 = recover.map(charge => {
            if (target.chargeNo === charge.chargeNo) {
                return { ...charge, edit: true, };
            }
            else {
                return { ...charge };
            }
        });
        setCharges(copy2);
    }, [charges]);
    //수정취소
    const cancelEditCharge = useCallback((target) => {
        const copy = [...charges];
        const copy2 = copy.map(charge => {
            if (target.chargeNo === charge.chargeNo) {
                return { ...backup, edit: false, };
            }
            else { return { ...charge }; }
        });
        setCharges(copy2);
    }, [charges]);
    //입력창 실행 함수
    const changeCharge = useCallback((e, target) => {
        const copy = [...charges];
        const copy2 = copy.map(charge => {
            if (target.chargeNo === charge.chargeNo) {
                return {
                    ...charge,
                    [e.target.name]: e.target.value
                };
            }
            else { return { ...charge }; }
        });
        setCharges(copy2);
    }, [charges]);
    //수정 저장, 목록
    const saveEditCharge = useCallback(async (target) => {
        const resp = await axios.patch("/charge/", target);
        loadData();
    }, [charges]);

    //원화로 포맷하기
    const formatCurrency = (value) => {
        return value.toLocaleString('ko-KR', { currency: 'KRW' });
      };


    //모달
    const bsModal = useRef(); //등록
    //등록 모달 열기
    const openModalCreate = useCallback(() => {
        const modal = new Modal(bsModal.current);
        modal.show();
    }, [bsModal]);
    //등록 모달 닫기
    const closeModalCreate = useCallback(() => {
        const modal = Modal.getInstance(bsModal.current);
        modal.hide();
    }, [bsModal]);

    return (
        <>
            <Jumbotron title="요금 관리" />

            <div className="row mt-4">
                <div className="col text-end">
                    <button className="btn btn-light" onClick={e => openModalCreate()}>
                        <FcMoneyTransfer /> &nbsp;
                        요금 등록
                    </button>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <table className="table table-striped table-hover">
                        <thead className="text-center">
                            <tr>
                                <th style={{ width: '12%' }}>번호</th>
                                <th>승객</th>
                                <th>등급</th>
                                <th>가격</th>
                                <th>관리</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {charges.map(charge => (
                                <tr key={charge.chargeNo}>
                                    {charge.edit === true ? (
                                        <>
                                            <td>{charge.chargeNo}</td>
                                            <td>
                                                <input type="text" name="chargeType"
                                                    className="form-control"
                                                    value={charge.chargeType}
                                                    onChange={e =>changeCharge(e,charge)} />
                                            </td>
                                            <td>
                                                <select type="text" name="gradeType"
                                                    className="form-select rounded"
                                                    value={charge.gradeType}
                                                    onChange={e => changeCharge(e, charge)}>
                                                    <option value={"전체"}>전체</option>
                                                    <option value={"프리미엄"}>프리미엄</option>
                                                    <option value={"우등"}>우등</option>
                                                    <option value={"일반"}>일반</option>
                                                </select>
                                            </td>
                                            <td>
                                                <input type="text" name="chargePrice"
                                                    className="form-control"
                                                    value={charge.chargePrice}
                                                    onChange={e =>changeCharge(e,charge)} />
                                            </td>
                                            <td>
                                                <FaCoins className="text-warning"
                                                    onClick={e => saveEditCharge(charge)}
                                                    style={{ cursor: 'pointer' }} />
                                                &nbsp; &nbsp; &nbsp;
                                                <MdOutlineCancel className="text-danger"
                                                    onClick={e => cancelEditCharge(charge)}
                                                    style={{ cursor: 'pointer' }} />
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>{charge.chargeNo}</td>
                                            <td>{charge.chargeType}</td>
                                            <td>{charge.gradeType}</td>
                                            <td>{formatCurrency(charge.chargePrice)}원</td>
                                            <td>
                                                <MdEdit className="text-primary"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={e=>editCharge(charge)}
                                                    title="수정" />
                                                &nbsp;&nbsp;&nbsp;
                                                <MdOutlineCreditCardOff className="text-danger"
                                                    onClick={e => deleteCharge(charge)}
                                                    style={{ cursor: 'pointer' }} 
                                                    title="삭제"/>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>


            {/* 등록 모달 */}
            <div ref={bsModal} className="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">요금 정보 추가 등록</h1>
                            <button type="button" className="btn-close" aria-label="Close" onClick={e => cancelInput()}></button>
                        </div>
                        <div className="modal-body">
                            {/* 등록 */}
                            <div className="row mt-4">
                                <div className="col">
                                    <label>승객타입</label>
                                    <input type="text" name="chargeType"
                                        value={input.chargeType}
                                        onChange={e => changeInput(e)}
                                        className="form-control rounded" />
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col">
                                    <label>승객 수</label>
                                    <input type="text" name="chargePassenger"
                                        value={input.chargePassenger}
                                        placeholder="숫자만 입력"
                                        onChange={e => changeInput(e)}
                                        className="form-control rounded" />
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col">
                                    <label>등급타입</label>
                                    <select type="date" name="gradeType"
                                        value={input.gradeType}
                                        onChange={e => changeInput(e)}
                                        className="form-select rounded">
                                        <option value={"전체"}>전체</option>
                                        <option value={"프리미엄"}>프리미엄</option>
                                        <option value={"우등"}>우등</option>
                                        <option value={"일반"}>일반</option>
                                    </select>
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col">
                                    <label>가격</label>
                                    <input type="text" name="chargePrice"
                                        value={input.chargePrice}
                                        placeholder="숫자만 입력"
                                        onChange={e => changeInput(e)}
                                        className="form-control rounded" />
                                </div>
                            </div>
                        </div>


                        <div className="modal-footer">
                            <button className="btn btn-success me-2"
                                onClick={e => saveInput()}>
                                등록
                            </button>
                            <button className="btn btn-danger"
                                onClick={e => cancelInput()}>
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Charge;