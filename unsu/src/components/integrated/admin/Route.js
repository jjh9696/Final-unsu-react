import { useCallback, useEffect, useRef, useState } from "react";
import axios from "../../utils/CustomAxios";
import Jumbotron from "../../../Jumbotron";
import { Modal } from "bootstrap";
import { FaRoad } from "react-icons/fa";



const Route = () => {

    //state
    const [routes, setRoutes] = useState([]);
    //터미널
    const [terminals, setTerminals] = useState([]);
    //등록인풋
    const [input, setInput] = useState({
        routeTime: "",
        routeKm: "",
        routeStartTime: "",
        routeEndTime: "",
        routeStart: "",
        routeEnd: "",
        busNo: "",
        routeWay: ""
    });

    //effect
    useEffect(() => {
        loadData();
        loadDetailData();
    }, []);
    //노선 목록
    const loadData = useCallback(async () => {
        const resp = await axios.get("/route/");

        //터미널 이름 뽑아오기
        const respData = await Promise.all(
            resp.data.map(async (route) => {
                const startTerminal = await axios.get("/terminal/" + route.routeStart);
                const endTerminal = await axios.get("/terminal/" + route.routeEnd);
                return {
                    ...route,
                    startTerminal: startTerminal.data.terminalName,
                    endTerminal: endTerminal.data.terminalName,
                };
            })
        );

        setRoutes(respData);
    }, [routes]);
    //터미널 find 뽑아오기
    const loadDetailData = useCallback(async(terminalId)=>{
        const resp = await axios.get("/terminal/"+terminals.terminalId);
        return resp.data.terminalName;
    },[terminals]);

    //데이터 등록
    const saveInput = useCallback(async () => {
        const resp = await axios.post("/route/", input);
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
            routeTime: "",
            routeKm: "",
            routeStartTime: "",
            routeEndTime: "",
            routeStart: "",
            routeEnd: "",
            busNo: "",
            routeWay: ""
        });
    }, [input]);
    //등록 입력값 변경
    const changeInput = useCallback((e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        });
    }, [input]);



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

    return (
        <>
            <Jumbotron title="노선 관리" />

            {/* 신규 생성 버튼 */}
            <div className="row mt-4">
                <div className="col text-end">
                    <button className="btn btn-secondary"
                        onClick={e => openModalCreate()}>
                        <FaRoad /> &nbsp;
                        노선 등록
                    </button>
                </div>
            </div>


            <div className="row mt-4">
                <div className="col">
                    <table className="table table-bordered">
                        <thead className="table-warning">
                            <tr>
                                <th>출발지</th>
                                <th>도착지</th>
                                <th>운행거리</th>
                                <th>소요시간</th>
                            </tr>
                        </thead>
                        <tbody>
                            {routes.map(route => (
                                <tr key={route.routeNo}>
                                    <td >{route.startTerminal}</td>
                                    <td>{route.endTerminal}</td>
                                    <td>{route.routeKm} km</td>
                                    <td>{route.routeTime}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>



            {/* 등록 모달 */}
            <div ref={bsModal1} className="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">신규 노선 등록</h1>
                            <button type="button" className="btn-close" aria-label="Close" onClick={e=>cancelInput()}></button>
                        </div>
                        <div className="modal-body">
                            {/* 등록 */}
                            <div className="row mt-4">
                                <div className="col">
                                    <label>출발지</label>
                                    <select type="text" name="startTerminal"
                                        value={input.startTerminal}
                                        onChange={e => changeInput(e)}
                                        className="form-select rounded">
                                            {terminals.map(terminal=>(
                                                <>
                                                    <option key={terminal.terminalId} value={terminal.terminalId.toString()}>{loadDetailData(terminal.terminalId)}</option>
                                                </>
                                            ))}
                                    </select>
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col">
                                    <label>도착지</label>
                                    <select type="text" name="endTerminal"
                                        value={input.endTerminal}
                                        onChange={e => changeInput(e)}
                                        className="form-select rounded">
                                    </select>
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col">
                                    <label>출발시간</label>
                                    <input type="date" name="driverAge"
                                        value={input.driverAge}
                                        onChange={e => changeInput(e)}
                                        className="form-control rounded" />
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col">
                                    <label>도착시간</label>
                                    <input type="text" name="driverLicense"
                                        value={input.driverLicense}
                                        onChange={e => changeInput(e)}
                                        placeholder="0-00-000000"
                                        className="form-control rounded" />
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col">
                                    <label>소요시간</label>
                                    <input type="date" name="driverDate"
                                        value={input.driverDate}
                                        onChange={e => changeInput(e)}
                                        className="form-control rounded" />
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col">
                                    <label>운행거리</label>
                                    <input type="date" name="driverDate"
                                        value={input.driverDate}
                                        onChange={e => changeInput(e)}
                                        className="form-control rounded" />
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col">
                                    <label>버스 배정</label>
                                    <input type="date" name="driverDate"
                                        value={input.driverDate}
                                        onChange={e => changeInput(e)}
                                        className="form-control rounded" />
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col">
                                    <label>편도or왕복</label>
                                    <input type="date" name="driverDate"
                                        value={input.driverDate}
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





export default Route;