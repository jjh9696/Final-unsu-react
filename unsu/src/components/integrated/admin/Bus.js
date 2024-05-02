import { useCallback, useEffect, useRef, useState } from "react";
import Jumbotron from "../../../Jumbotron";
import { FaBus } from "react-icons/fa";
import axios from "../../utils/CustomAxios";
import { Modal } from "bootstrap";



const Bus = () => {

    //state
    const [buses, setBuses] = useState([]);
    //등록인풋
    const [input, setInput] = useState({
        busModel:"",
        busNum:"",
        gradeType:"",
        busSeat:"",
        busStatus:"",
        driverNo:""
    });
    //기사목록
    const [drivers, setDrivers] = useState([]);

    //버스목록 + 기사목록
    useEffect(()=>{
        loadData();
        loadDriverData();
    },[]);
    //버스목록
    const loadData = useCallback(async()=>{
        const resp = await axios.get("/bus/");

        //기사님이름 뽑아오기 비동기로
        const driverName = resp.data.map(async(bus)=>{
            const driverResp = await axios.get("/driver/"+bus.driverNo);
            return{
                ...bus,
                driverName : driverResp.data.driverName
            };
        });
        // 모든 비동기 작업이 완료될 때까지 기다린 후 버스 데이터를 설정
        const busData = await Promise.all(driverName);

        setBuses(busData);
    },[buses]);
    //기사님 목록
    const loadDriverData = useCallback(async()=>{
        const resp = await axios.get("/driver/");
        setDrivers(resp.data);
    },[drivers]);

    //데이터 등록
    const saveInput = useCallback(async()=>{
        const resp = await axios.post("/bus/",input);
        loadData();
        clearInput();
        closeModalCreate();
    },[input]);
    //등록 취소
    const cancelInput = useCallback(()=>{
        const choice = window.confirm("등록을 취소하시겠습니까?");
        if(choice === false) return;
        clearInput();
        closeModalCreate();
    },[input]);
    //입력값 초기화
    const clearInput = useCallback(()=>{
        setInput({
            busModel:"",
            busNum:"",
            gradeType:"",
            busSeat:"",
            busStatus:"",
            driverNo:""
        });
    },[input]);
    //등록 입력값 변경
    const changeInput = useCallback((e)=>{
        setInput({
            ...input,
            [e.target.name] : e.target.value
        });
    },[input]);

    //삭제하기




    //ref+modal
    const bsModal = useRef(); //등록

    //등록모달 열기
    const openModalCreate = useCallback(()=>{
        const modal = new Modal(bsModal.current);
        modal.show();
    },[bsModal]);
    //등록모달 닫기
    const closeModalCreate = useCallback(()=>{
        const modal = Modal.getInstance(bsModal.current);
        modal.hide();
    },[bsModal]);

    return(
        <>
            <Jumbotron title="버스 관리"/>

            {/* 신규 생성 버튼 */}
            <div className="row mt-4">
                <div className="col text-end">
                    <button className="btn btn-warning"
                        onClick={e=>openModalCreate()}>
                        <FaBus/> &nbsp;
                        차량 등록
                    </button>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <table className="table table-striped">
                        <thead className="text-center">
                            <tr className="table-primary">
                                <th>번호</th>
                                <th>모델명</th>
                                <th>차량번호</th>
                                <th>버스타입</th>
                                <th>좌석수</th>
                                <th>기사님</th>
                                <th>상태</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                        {buses.map(bus=>(
                            <tr key={bus.busNo}>
                                <td>{bus.busNo}</td>
                                <td>{bus.busModel}</td>
                                <td>{bus.busNum}</td>
                                <td>{bus.gradeType}</td>
                                <td>{bus.busSeat}</td>
                                <td>{bus.driverName}</td>
                                <td>{bus.busStatus}</td>
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
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">신규 차량 등록</h1>
                            <button type="button" className="btn-close" aria-label="Close" onClick={e=>cancelInput()}></button>
                        </div>
                        <div className="modal-body">
                            {/* 등록 */}
                            <div className="row mt-4">
                                <div className="col">
                                    <label>차량 모델</label>
                                    <input type="text" name="busModel"
                                        value={input.busModel}
                                        onChange={e=>changeInput(e)}
                                        className="form-control rounded" />
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col">
                                    <label>차량번호</label>
                                    <input type="text" name="busNum"
                                        value={input.busNum}
                                        onChange={e=>changeInput(e)}
                                        className="form-control rounded" />
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col">
                                    <label>버스타입</label>
                                    <select type="text" name="gradeType"
                                        onChange={e=>changeInput(e)}
                                        value={input.gradeType}
                                        className="form-select rounded">
                                            <option value={""}>선택하세요</option>
                                            <option value={"프리미엄"}>프리미엄</option>
                                            <option value={"우등"}>우등</option>
                                            <option value={"일반"}>일반</option>
                                            <option value={"전체"}>전체</option>
                                    </select>
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col">
                                    <label>좌석수</label>
                                    <input type="text" name="busSeat"
                                        value={input.busSeat}
                                        onChange={e=>changeInput(e)}
                                        className="form-control rounded" />
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col">
                                    <label>상태</label>
                                    <select type="text" name="busStatus"
                                        onChange={e=>changeInput(e)}
                                        value={input.busStatus}
                                        className="form-select rounded">
                                            <option value={""}>선택하세요</option>
                                            <option value={"운행중"}>운행중</option>
                                            <option value={"운행종료"}>운행종료</option>
                                            <option value={"수리중"}>수리중</option>
                                    </select>
                                </div>
                            </div>

                                <div className="row mt-4">
                                    <div className="col">
                                        <label>기사님 배정하기</label>
                                        <select name="driverNo"
                                            onChange={e=>changeInput(e)}
                                            value={input.driverNo}
                                            className="form-select rounded">
                                                <option value={""}>선택하세요</option>
                                                {drivers.map(driver=>(
                                                <option key={driver.driverNo} value={driver.driverNo}>{driver.driverName}</option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                        </div>
                        


                        <div className="modal-footer">
                            <button className="btn btn-success me-2"
                                onClick={e=>saveInput()}>
                                등록
                            </button>
                            <button className="btn btn-danger"
                                onClick={e=>cancelInput()}>
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};



export default Bus;