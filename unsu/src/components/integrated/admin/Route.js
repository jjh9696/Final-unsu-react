import { useCallback, useEffect, useRef, useState } from "react";
import axios from "../../utils/CustomAxios";
import Jumbotron from "../../../Jumbotron";
import { Modal } from "bootstrap";
import { FaRoad } from "react-icons/fa";
import { FaRightLong } from "react-icons/fa6";



const Route = () => {

    //state
    const [routes, setRoutes] = useState([]);
    //터미널
    const [terminals, setTerminals] = useState([]);
    //버스
    const [buses, setBuses] = useState([]);
    const [backup, setBackup] = useState(null); //백업
    //등록 인풋
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
    //선택 노선 상세 및 수정
    const [selectRoute, setSelectRoute] = useState({
        routeTime: "",
        routeKm: "",
        routeStartTime: "",
        routeEndTime: "",
        routeStart: "",
        routeEnd: "",
        busNo: "",
        routeWay: "",
        edit: false
    });
    //시간 담기
    const [routeTimes, setRouteTimes] = useState([]);


    //effect
    useEffect(() => {
        loadData();
        loadTerminalData();
        loadBusData();
        loadTimeData();
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

    //터미널....
    const loadTerminalData = useCallback(async () => {
        const resp = await axios.get("/terminal/");
        setTerminals(resp.data);
    }, [terminals]);
    //버스
    const loadBusData = useCallback(async () => {
        const resp = await axios.get("/bus/");
        setBuses(resp.data);
    }, [buses]);
    //시간 조회
    const loadTimeData = useCallback(async () => {
        const resp = await axios.get("/route/time");
        setRouteTimes(resp.data);
    }, [routeTimes]);



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

    //수정상태로 바꾸기
    const editRoute = useCallback((target) => {
        const copy = { ...selectRoute };
        if (copy.edit === true) { //수정중인 항목이 있다면
            copy.edit = false; //백업으로 갱신 + 수정모드 취소
        }

        setBackup({ ...selectRoute }); //백업해두기 나중을 위해

        //카피 고치기
        if (target.RouteNo === copy.RouteNo) { //둘이 같다면
            copy.edit = true; //정보유지하고 수정처리
        }

        //덮어쓰게 세팅
        setSelectRoute(copy);
    }, [selectRoute]);

    //입력한 내용 수정
    const changeRoute = useCallback((e, target) => {
        const copy = { ...selectRoute };

        //target과 동일한 정보 가진 항목 찾아 수정
        if (target.RouteNo === copy.RouteNo) {
            copy[e.target.name] = e.target.value;
        }
        setSelectRoute(copy);
    }, [selectRoute]);

    //수정된 결과 저장하고 목록 갱신하기
    const saveEditRoute = useCallback(async (target) => {
        //서버에 타겟 전달하고 수정처리
        const resp = await axios.patch("/route/", target);
        //목록갱신
        window.alert("수정이 완료되었습니다.");
        loadData();
        closeModalInfo();
    }, [selectRoute]);

    //수정 취소하기
    const cancelEditRoute = useCallback(() => {
        //취소 확인창
        const choice = window.confirm("수정을 취소하시겠습니까?");
        if (choice === false) return;

        // 이전에 백업된 정보가 없으면 아무것도 수행하지 않습니다.
        if (!backup) return;

        // 백업된 정보를 선택된 정보로 복구합니다.
        setSelectRoute({ ...backup, edit: false });
    }, [backup, setSelectRoute]);

    //삭제
    const deleteRoute = useCallback(async(target)=>{
        //확인창
        const choice = window.confirm("노선 정보를 삭제하시겠습니까?");
        if (choice === false) return;

        const resp = await axios.delete("/route/" + target.routeNo);
        loadData();
    },[routes]);




    const formatTime = (timeString) => {
        // 주어진 시간 문자열을 Date 객체로 변환
        const date = new Date(timeString);
        // Date 객체에서 시간과 분을 추출
        const HH24 = date.getHours();
        const MI = date.getMinutes();
        // 추출된 시간과 분을 문자열로 포맷팅하여 반환
        const formattedTime = `${padZero(HH24)}:${padZero(MI)}`;
        return formattedTime;
    };
    //시간 앞에 0 붙이기
    const padZero = (num) => {
        return num < 10 ? `0${num}` : num;
    };



    //ref+Modal
    const bsModal1 = useRef(); //등록
    const bsModal2 = useRef(); //상세

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

    //상세보기 모달 열기
    const openModalInfo = useCallback((route) => {
        setSelectRoute(route); // 클릭한 노선 정보
        const modal = new Modal(bsModal2.current);
        modal.show();
    }, [bsModal2]);
    //상세보기 모달 닫기
    const closeModalInfo = useCallback(() => {
        const modal = Modal.getInstance(bsModal2.current);
        modal.hide();
    }, [bsModal2]);

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

            {/* 목록 */}
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
                            {/* 출발지,도착지 같으면 한 번만 출력되게 */}
                            {routes.map((route, index) => (
                                (index === 0 || routes[index - 1].startTerminal !== route.startTerminal || routes[index - 1].endTerminal !== route.endTerminal) && (
                                    <tr key={route.routeNo}>
                                        <td onClick={e => openModalInfo(route)}
                                            style={{ cursor: 'pointer' }}>
                                            {route.startTerminal}
                                        </td>
                                        <td onClick={e => openModalInfo(route)}
                                            style={{ cursor: 'pointer' }}>
                                            {route.endTerminal}
                                        </td>
                                        <td onClick={e => openModalInfo(route)}
                                            style={{ cursor: 'pointer' }}>
                                            {route.routeKm} km
                                        </td>
                                        <td onClick={e => openModalInfo(route)}
                                            style={{ cursor: 'pointer' }}>
                                            {route.routeTime}
                                        </td>
                                    </tr>
                                )
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
                            <button type="button" className="btn-close" aria-label="Close" onClick={e => cancelInput()}></button>
                        </div>
                        <div className="modal-body">
                            {/* 등록 */}
                            <div className="row mt-4">
                                <div className="col">
                                    <label>출발지</label>
                                    <select type="text" name="routeStart"
                                        value={input.routeStart}
                                        onChange={e => changeInput(e)}
                                        className="form-select rounded">
                                        <option value={""}>출발지</option>
                                        {terminals.map(terminal => (
                                            <option key={terminal.terminalId} value={terminal.terminalId}>{terminal.terminalName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col">
                                    <label>도착지</label>
                                    <select type="text" name="routeEnd"
                                        value={input.routeEnd}
                                        onChange={e => changeInput(e)}
                                        className="form-select rounded">
                                        <option value={""}>도착지</option>
                                        {terminals.map(terminal => (
                                            <option key={terminal.terminalId} value={terminal.terminalId}>{terminal.terminalName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col">
                                    <label>출발시간</label>
                                    <input type="text" name="routeStartTime"
                                        value={input.routeStartTime}
                                        placeholder="YYYY-MM-DD HH24:MI"
                                        onChange={e => changeInput(e)}
                                        className="form-control rounded" />
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col">
                                    <label>도착시간</label>
                                    <input type="text" name="routeEndTime"
                                        value={input.routeEndTime}
                                        placeholder="YYYY-MM-DD HH24:MI"
                                        onChange={e => changeInput(e)}
                                        className="form-control rounded" />
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col">
                                    <label>소요시간</label>
                                    <input type="text" name="routeTime"
                                        value={input.routeTime}
                                        placeholder="00시간 00분"
                                        onChange={e => changeInput(e)}
                                        className="form-control rounded" />
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col">
                                    <label>운행거리</label>
                                    <input type="text" name="routeKm"
                                        value={input.routeKm}
                                        onChange={e => changeInput(e)}
                                        placeholder="km"
                                        className="form-control rounded" />
                                </div>
                            </div>


                            <div className="row mt-4">
                                <div className="col">
                                    <label>편도or왕복</label>
                                    <select type="text" name="routeWay"
                                        value={input.routeWay}
                                        onChange={e => changeInput(e)}
                                        className="form-select rounded">
                                        <option value={"편도"}>편도</option>
                                        <option value={"왕복"}>왕복</option>
                                    </select>
                                </div>
                            </div>


                            <div className="row mt-4">
                                <div className="col">
                                    <label>버스 배정</label>
                                    <select type="text" name="busNo"
                                        value={input.busNo}
                                        onChange={e => changeInput(e)}
                                        className="form-select rounded">
                                        <option value="">버스 선택</option>
                                        {buses.map(bus => (
                                            <option value={bus.busNo}>{bus.busNum}</option>
                                        ))}
                                    </select>
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



            {/* 상세보기 모달 */}
            <div ref={bsModal2} className="modal fade" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">노선 상세정보</h1>
                            <button type="button" className="btn-close" aria-label="Close" onClick={e => closeModalInfo()}></button>
                        </div>
                        <div className="modal-body" key={routes.routeNo}>
                            {selectRoute && selectRoute.edit === true ? (
                                <>
                                    <div className="row mt-4">
                                        <div className="col">
                                            <label>출발지</label><br />
                                            <select type="text" name="routeStart"
                                                value={selectRoute.routeStart}
                                                onChange={e => changeRoute(e, selectRoute)}
                                                className="form-select rounded">
                                                <option value={""}>출발지</option>
                                                {terminals.map(terminal => (
                                                    <option key={terminal.terminalId} value={terminal.terminalId}>{terminal.terminalName}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="row mt-4">
                                        <div className="col">
                                            <label>도착지</label><br />
                                            <select type="text" name="routeEnd"
                                                value={selectRoute.routeEnd}
                                                onChange={e => changeRoute(e, selectRoute)}
                                                className="form-select rounded">
                                                <option value={""}>도착지</option>
                                                {terminals.map(terminal => (
                                                    <option key={terminal.terminalId} value={terminal.terminalId}>{terminal.terminalName}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="row mt-4">
                                        <div className="col">
                                            <label>출발시간</label>
                                            <input type="text" name="routeStartTime"
                                                value={selectRoute.routeStartTime}
                                                onChange={e => changeRoute(e, selectRoute)}
                                                className="form-control rounded" />
                                        </div>
                                    </div>

                                    <div className="row mt-4">
                                        <div className="col">
                                            <label>도착시간</label>
                                            <input type="text" name="routeEndTime"
                                                value={selectRoute.routeEndTime}
                                                onChange={e => changeRoute(e, selectRoute)}
                                                className="form-control rounded" />
                                        </div>
                                    </div>

                                    <div className="row mt-4">
                                        <div className="col">
                                            <label>소요시간</label>
                                            <input type="text" name="routeTime"
                                                value={selectRoute.routeTime}
                                                onChange={e => changeRoute(e, selectRoute)}
                                                className="form-control rounded" />
                                        </div>
                                    </div>

                                    <div className="row mt-4">
                                        <div className="col">
                                            <label>운행거리</label>
                                            <input type="text" name="routeKm"
                                                value={selectRoute.routeKm}
                                                onChange={e => changeRoute(e, selectRoute)}
                                                className="form-control rounded" />
                                        </div>
                                    </div>


                                    <div className="row mt-4">
                                        <div className="col">
                                            <label>편도or왕복</label>
                                            <select type="text" name="routeWay"
                                                value={selectRoute.routeWay}
                                                onChange={e => changeRoute(e, selectRoute)}
                                                className="form-select rounded">
                                                <option value={"편도"}>편도</option>
                                                <option value={"왕복"}>왕복</option>
                                            </select>
                                        </div>
                                    </div>


                                    <div className="row mt-4">
                                        <div className="col">
                                            <label>버스 배정</label>
                                            <select type="text" name="busNo"
                                                value={selectRoute.busNo}
                                                onChange={e => changeRoute(e, selectRoute)}
                                                className="form-select rounded">
                                                <option value="">버스 선택</option>
                                                {buses.map(bus => (
                                                    <option value={bus.busNo}>{bus.busNum}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="row mt-4">
                                        <div className="col text-end">
                                            <button className="btn btn-success me-3"
                                                onClick={e => saveEditRoute(selectRoute)}>
                                                저장
                                            </button>
                                            <button className="btn btn-warning"
                                                onClick={e => cancelEditRoute(selectRoute)}>
                                                취소
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="row mt-4 text-center">
                                        <div className="col-5">
                                            <label>출발지</label>
                                            <h3>{selectRoute.startTerminal}</h3>
                                        </div>
                                        <div className="col-2 mt-3">
                                            <h5><FaRightLong /></h5>
                                        </div>
                                        <div className="col-5">
                                            <label>도착지</label>
                                            <h3>{selectRoute.endTerminal}</h3>
                                        </div>
                                    </div>

                                    <div className="row mt-4 text-center">
                                        <div className="col">
                                            <label>출발시간</label><br />
                                            <select>
                                            {routeTimes.map(routeTime => (
                                                    (routeTime.routeStart === selectRoute.startTerminal && routeTime.routeEnd === selectRoute.endTerminal) && (
                                                        <option key={routes.routeNo} value={routeTime.routeStartTime}>
                                                            {formatTime(routeTime.routeStartTime)}
                                                        </option>
                                                    )
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-2">
                                        </div>
                                        <div className="col">
                                            <label>도착시간</label><br />
                                            <h5>{routeTimes.routeEndTime}</h5>
                                        </div>
                                    </div>

                                    <div className="row mt-4 text-center">
                                        <div className="col">
                                            <label>소요시간</label>
                                            <h5>{selectRoute.routeTime}</h5>
                                        </div>
                                        <div className="col">
                                            <label>운행거리</label>
                                            <h5>{selectRoute.routeKm}km</h5>
                                        </div>
                                        <div className="col">
                                            <label>타입</label>
                                            <h5>{selectRoute.routeWay}</h5>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row mt-3">
                                        <div className="col">
                                            <button className="btn btn-danger"
                                                onClick={e=>deleteRoute(selectRoute)}>
                                                삭제
                                            </button>
                                        </div>
                                        <div className="col text-end">
                                            <button className="btn btn-primary me-3"
                                                onClick={e => editRoute(selectRoute)}>
                                                수정
                                            </button>
                                            <button className="btn btn-light"
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





export default Route;