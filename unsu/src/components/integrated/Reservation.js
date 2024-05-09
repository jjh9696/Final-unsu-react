import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import axios from '../utils/CustomAxios';
import { useNavigate } from "react-router";
import { Modal } from 'bootstrap';
import Draggable from "react-draggable";
import {SeatGroup} from "hacademy-cinema-seat";

const Reservation = () => {
    const [startRegion, setStartRegion] = useState('');
    const [endRegion, setEndRegion] = useState('');
    const [selectedId, setSelectedId] = useState('');
    const [startTerminals, setStartTerminals] = useState([]);
    const [endTerminals, setEndTerminals] = useState([]);
    const [selectedStartTerminal, setSelectedStartTerminal] = useState('');
    const [selectedEndTerminal, setSelectedEndTerminal] = useState('');
    const [formData, setFormData] = useState({
        routeStart: "",
        routeEnd: "",
        routeStartTime: "",
        gradeType: ""
    });
    const [selectedStartTerminalName, setSelectedStartTerminalName] = useState('');
    const [selectedEndTerminalName, setSelectedEndTerminalName] = useState('');
    const [busResults, setBusResults] = useState([]);
    // 좌석띄우는 부분 
    const [seats, setSeats] = useState([]); // 좌석 정보를 담을 state
    const [selectedSeat, setSelectedSeat] = useState(null); // 선택된 좌석 번호를 담을 state
    // 버스번호를 좌석정보가져오는 비동기에 넣을거
    const [seatBusNo, setSeatBusNo] = useState('');
    // qjtm 클릭 이벤트 핸들러
    const handleBusClick = (e) => {
        setSeatBusNo(e.target.value); 
        console.log(seatBusNo);
    };
    // const handleCombinedClick = (bus) => {
    //     openModalCreate();
    //     console.log(bus.busNo);
    //     setSeatBusNo(bus.busNo);
    // };
    const handleCombinedClick = async (bus) => {
        console.log(bus.busNo);
        setSeatBusNo(bus.busNo);
        // 데이터를 불러온 후에 모달을 열도록 선택
        await loadSeatData();
        openModalCreate();
        setTimeout(()=>{
            window.dispatchEvent(new Event('resize'));
        }, 500);
    };

    // 좌석 정보를 가져오는 함수
    const loadSeatData = async () => {
        try {
            const resp = await axios.get(`/seat/${seatBusNo}/seat`);
            setSeats(resp.data); // 가져온 좌석 정보를 state에 설정
        } catch (error) {
            console.error("Error fetching seats:", error);
        }
    };

    // 좌석 클릭 이벤트 핸들러
    const handleSeatClick = (seatNumber) => {
        setSelectedSeat(seatNumber); // 선택한 좌석 번호를 state에 설정
    };


    useEffect(() => {
        if(seatBusNo) {
            loadSeatData();
        }
    }, [seatBusNo]); 

    useEffect(() => {
        loadSeatData();
    }, []);



    // 지역은 미리 지정해둠 아래에 regions에 셀렉트로 보이게 설정해둠
    const regions = [
        { key: "2", value: "광주/전남", name: "광주/전남" },
        { key: "3", value: "전북", name: "전북" },
        { key: "4", value: "부산/경남", name: "부산/경남" },
        { key: "5", value: "대구/경북", name: "대구/경북" },
        { key: "6", value: "인천/경기", name: "인천/경기" },
        { key: "7", value: "서울", name: "서울" }
    ];
    const [submissionSuccess, setSubmissionSuccess] = useState(false); // 버스조회가 정상적으로 이루어 지면 사용자가 조회한 내용을 바탕으로 다른 컴포넌트를 보여주기 위한 상태
    const navigate = useNavigate(); // 폼이 전송되면 페이지 리다이렉트
    // 출발 터미널을 보여주기 위한 통신
    useEffect(() => {
        const fetchData = async () => {
            if (startRegion) {
                try {
                    const response = await axios.post("/reservation/", { terminalRegion: startRegion });
                    setStartTerminals(response.data);
                    if (response.data.length > 0) {
                        setSelectedStartTerminal(response.data[0].id);
                    } else {
                        setSelectedStartTerminal('');
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            } else {
                setStartTerminals([]);
                setSelectedStartTerminal('');
            }
        };
        fetchData();

    }, [startRegion]);

 // 출발 터미널 변경하는거 관리
 const handleStartTerminalChange = (e) => {
    const selectedId = parseInt(e.target.value, 10);  // 선택된 터미널 ID를 숫자로 변환
    const selectedTerminal = startTerminals.find(terminal => terminal.terminalId === selectedId);
    // console.log(selectedId);
    setSelectedStartTerminal(selectedId);
    if (selectedTerminal) {
        setSelectedStartTerminalName(selectedTerminal.terminalName);
        // 출발 터미널 선택 시 도착 터미널도 같은 터미널로 설정
        setSelectedEndTerminal(selectedId);
        setSelectedEndTerminalName(selectedTerminal.terminalName);
        setFormData({ ...formData, routeStart: selectedId, routeEnd: selectedId });
    } else {
        setSelectedStartTerminalName('터미널 선택');
        setSelectedEndTerminal('');
        setSelectedEndTerminalName('');
    }
};

    // 도착 터미널을 보여주기 위한 통신
    useEffect(() => {
        const fetchData = async () => {
            if (endRegion) {
                try {
                    // console.log("선택됐나?",selectedStartTerminal);
                    const response = await axios.post("/reservation/end", { 
                        terminalId: selectedStartTerminal ,
                        terminalRegion : endRegion
                    });
                    setEndTerminals(response.data);
                    if (response.data.length > 0) {
                        setSelectedEndTerminal(response.data[0].id);
                    } else {
                        setSelectedEndTerminal('');
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            } else {
                setEndTerminals([]);
                setSelectedEndTerminal('');
            }
        };
        fetchData();
    }, [endRegion]);

    // 출발 지역 선택
    const handleStartRegionChange = (e) => {
        setStartRegion(e.target.value);
    };  

    // 도착 지역선택
    const handleEndRegionChange = (e) => {
        setEndRegion(e.target.value);
    };

   

    // 도착 터미널 변경하는거 관리
    const handleEndTerminalChange = (e) => {
        const selectedId = parseInt(e.target.value, 10);  // 선택된 터미널 ID를 숫자로 변환
        const selectedTerminal = endTerminals.find(terminal => terminal.terminalId === selectedId);

        setSelectedEndTerminal(selectedId);
        if (selectedTerminal) {
            setSelectedEndTerminalName(selectedTerminal.terminalName);
        } else {
            setSelectedEndTerminalName('터미널 선택');
        }
        setFormData({ ...formData, routeEnd: selectedId });
    };
    useEffect(() => {
        if (selectedStartTerminal) {
            setSelectedEndTerminal(selectedStartTerminal);  // 출발 터미널이 선택되면 도착 터미널도 해당 터미널로 설정
        }
    }, [selectedStartTerminal]);
    // 시간을 폼데이터에 넣기 사용자가 맨첨에 달력에서 선택한 데이터를 저장해서 아래에 창에 보여주려고 만들었음
    const handleStartDateChange = (e) => {
        setFormData({ ...formData, routeStartTime: e.target.value });
    };

    // 등급을 폼데이터에 넣기 전체라는 컬럼은 없기때문에 등급 선택바에서 전체를 선택하면 전송할때 아예 제거하고 보냄
    const handleGradeTypeChange = (e) => {
        if (e.target.value !== "전체") {
            setFormData({ ...formData, gradeType: e.target.value });
        } else {
            // 'gradeType' 필드를 폼 데이터에서 완전히 제거
            const { gradeType, ...newFormData } = formData;
            setFormData(newFormData);
        }
    };

    // 원래 form 에서 submit으로 했다가 onClick 으로 바꿈. 원코드는 살려서 냅둠
    // const searchBus = async (e) => {
    //     e.preventDefault();

    //     // 폼 데이터에서 gradeType이 빈 문자열이면 제거
    //     const filteredData = formData.gradeType === "" ? (({ gradeType, ...rest }) => rest)(formData) : formData;
    //     console.log('전송되는정보:', filteredData); // 이것을 통해 등급을 전체로 하면 디비 전송될때 등급이 빠지고 백엔드에서 where절에 등급 조건이 빠지게 함
    //     try {
    //         const response = await axios.post('/search/', filteredData);
    //         console.log('Server Response:', response.data);
    //         setBusResults(response.data);
    //         setSubmissionSuccess(true);  // 제출 성공 상태를 true로 설정
    //     } catch (error) {
    //         console.error('전송오류:', error.response ? error.response.data : error.message);
    //         setSubmissionSuccess(false);  // 에러 발생 시 제출 성공 상태를 false로 설정
    //     }
    // };

    // 사용자가 원하는 버스노선 정보를 얻기 위한 백엔드로 정보 전달
    const handleSubmit = async () => {
        // 폼 데이터에서 gradeType이 "전체" 또는 빈 문자열인 경우 제거
        const dataToSend = formData.gradeType === "" || formData.gradeType === "전체" ?
            (({ gradeType, ...rest }) => rest)(formData) : formData; // 이것을 통해 등급을 전체로 하면 디비 전송될때 등급이 빠지고 백엔드에서 where절에 등급 조건이 빠지게 함

        console.log('전송되는 정보:', dataToSend);

        try {
            const response = await axios.post('/search/', dataToSend);
            console.log('Server Response:', response.data);
            setBusResults(response.data);
            setSubmissionSuccess(true);  // 제출 성공 상태를 true로 설정
        } catch (error) {
            console.error('전송 오류:', error.response ? error.response.data : error.message);
            setSubmissionSuccess(false);  // 에러 발생 시 제출 성공 상태를 false로 설정
        }
    };


    ///////////////////////////////////////////// 버스 눌러서 예약 하는 모달 ////////////////////////////////////////////
    const [input, setInput] = useState({
        // 버스 예약 인서트 할것 넣기
    });
    const bsModal = useRef(); //등록

    // 예약 모달 열기
    const openModalCreate = useCallback(() => {
        const modal = new Modal(bsModal.current);
        modal.show();
    }, [bsModal]);

    // 예약 모달 닫기
    const closeModalCreate = useCallback(() => {
        const modal = Modal.getInstance(bsModal.current);
        modal.hide();
    }, [bsModal]);

    // 데이터 등록
    const saveInput = useCallback(async () => {
        try {
            console.log('Sending input:', input); // 입력 값 로깅
            const resp = await axios.post("/reservation/", input);
            clearInput();
            closeModalCreate();
        } catch (error) {
            console.error('Error saving input:', error); // 에러 발생 시 콘솔에 에러 메시지 출력
        }
    }, [input]);

    // 예약창 닫기
    const cancelInput = useCallback(() => {
        const choice = window.confirm("예약을 취소하시겠습니까?");
        if (choice === false) return;
        clearInput();
        closeModalCreate();
    }, [input]);
    const changeInput = useCallback((e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        });
    }, [input]);

    //입력값 초기화
    const clearInput = useCallback(() => {
        setInput({
            // 버스 예약 인서트 할것 넣기
        });
    }, [input]);



    //좌석을 선택했을 때 선택된 좌석만 추출
    const checkSeats = useMemo(()=>{
        return seats.filter(seat=>seat.seatChecked === true);
    }, [seats]);


    ///////////////////////////////////////////////// 아래부터 리턴 화면 /////////////////////////////////////////////////////
    return (
        <>
            <>
                <h1>버스조회</h1>
                <hr />
                <div className="container w-100 mt-4">
                    <div className="row">
                        <div className="col">
                            <label>출발 지역 :</label>
                            <select onChange={handleStartRegionChange} value={startRegion}>
                                <option value="">지역을 선택하세요</option>
                                {regions.map(region => (
                                    <option key={region.key} value={region.value}>{region.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col">
                            <label>출발터미널 : </label>
                            <select onChange={handleStartTerminalChange} value={selectedStartTerminal}>
                                <option value="">터미널 선택</option>
                                {startTerminals.map(terminal => (
                                    <option key={terminal.terminalId} value={terminal.terminalId}>{terminal.terminalName}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col">
                            <label>도착 지역 : </label>
                            <select onChange={handleEndRegionChange} value={endRegion}>
                                <option value="">지역을 선택하세요</option>
                                {/* 출발지 값 regions 배열에서 출발 지역과 같지 않은 지역만 필터링하여 보여줌 */}
                                {/* {regions.filter(region => region.value !== startRegion).map(region => (
                                    <option key={region.key} value={region.value}>{region.name}</option>
                                ))} */}
                                {regions.map(region => (
                                    <option key={region.key} value={region.value}>{region.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col">
                            <label>도착터미널 :</label>
                            <select onChange={handleEndTerminalChange} value={selectedEndTerminal}>
                                <option value="">터미널 선택</option>
                                {endTerminals.map(terminal => (
                                    <option key={terminal.terminalId} value={terminal.terminalId}>{terminal.terminalName}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className='row mt-4 text-center'>
                        <div className='col'>
                            <select onChange={handleGradeTypeChange}>
                                <option value="">전체</option>
                                <option value="일반">일반</option>
                                <option value="우등">우등</option>
                                <option value="프리미엄">프리미엄</option>
                            </select>
                        </div>
                    </div>
                    <div className='row mt-4 text-center'>
                        <div className='col'>
                            <input type='date' onChange={handleStartDateChange} />
                        </div>
                    </div>
                    <div className='row mt-4 text-center'>
                        <div className='col'>
                            <button className='btn btn-primary' onClick={handleSubmit}>조회</button>
                        </div>
                    </div>
                </div>
            </>
            {submissionSuccess && (
                <>
                    <div className="container d-flex justify-content-end">
                        <div className="row mt-5 w-25 text-center me-5">
                            <div className="col">
                                <label>출발터미널</label><div><strong>{selectedStartTerminalName || '선택되지 않음'}</strong></div><br /><br />
                                <label>도착터미널</label><div><strong>{selectedEndTerminalName || '선택되지 않음'}</strong></div>
                                {busResults.length > 0 && (
                                    <div key={busResults[0].routeNo}>
                                        <div><label>소요시간</label>{busResults[0].routeTime}</div>
                                        <div><label>킬로미터</label>{busResults[0].routeKm}</div>
                                    </div>
                                )}
                                <div className="col mt-4">
                                    요금
                                </div>
                                <div className="col">
                                    <label>일반</label> xxxx원
                                </div>
                                <div className="col">
                                    <label>우등</label> xxxx원
                                </div>
                                <div className="col">
                                    <label>프리미엄</label> xxxx원
                                </div>
                            </div>
                        </div>
                        <div className="row mt-2 w-75 text-center">
                            <div className="col">
                                <h3>{formData.routeStartTime || "날짜를 선택하세요"}</h3>
                                <hr />
                                <div className="row mt-4">
                                    <div className="col col-3">출발시각</div>
                                    <div className="col col-3">등급</div>
                                    <div className="col col-3">잔여석</div>
                                    <div className="col col-3">선택</div>
                                </div>
                                {busResults.map((bus, index) => (
                                    <div key={index} className="row mt-4">
                                        <div className="col col-3">{new Date(bus.routeStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        {/* YYYY-MM-DD HH24:MI 형식에서 시간만 출력하게 설정함 */}
                                        <div className="col col-3">{bus.gradeType}</div>
                                        <div className="col col-3">{bus.busSeat}석</div>
                                        <div className="col col-3"><button className="btn btn-primary"  onClick={e => handleCombinedClick(bus)}>선택{bus.busNo}</button></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                    {/* <div className='row mt-5'>
                        <div className='col'>
                            <SeatGroup map={seats} setMap={setSeats}
                                                            fields={{
                                                            no:'seatNo', 
                                                            row:'seatColumn', 
                                                            col:'seatRow', 
                                                            price:'seatPrice', 
                                                            grade:'seatGrade',
                                                            reserved:'seatReserved', 
                                                            disabled:'seatDisabled',
                                                            checked:'seatChecked',
                                                            }}
                                                            rows={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                                                            cols={[1, 2, ' ', 3, 4]}
                                                            showNames
                                                        />
                        </div>
                    </div> */}
                    {/* 등록 모달 */}

                    <div ref={bsModal} className="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" >
                        <Draggable>
                            <div className="modal-dialog modal-xl" >
                                <div className="modal-content modal-xl" style={{ height: "1200px" }}> 
                                    <div className="modal-header">
                                        <h1 className="modal-title fs-5" id="staticBackdropLabel">고속버스예약</h1>
                                        <button type="button" className="btn-close" aria-label="Close" onClick={e => cancelInput()}></button>
                                    </div>
                                    <div className="modal-body">
                                        {/* 등록 */}
                                        <div className="container d-flex justify-content-end">
                                            <div className="row mt-5 w-25 text-center me-5">
                                                <div className="col">
                                                    <label>출발터미널</label><div><strong>{selectedStartTerminalName || '선택되지 않음'}</strong></div><br /><br />
                                                    <label>도착터미널</label><div><strong>{selectedEndTerminalName || '선택되지 않음'}</strong></div>
                                                    <div className="col mt-4">
                                                        요금
                                                    </div>
                                                    <div className="col">
                                                        <label>일반</label> xxxx원
                                                    </div>
                                                    <div className="col">
                                                        <label>우등</label> xxxx원
                                                    </div>
                                                    <div className="col">
                                                        <label>프리미엄</label> xxxx원
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row mt-2 w-75 text-center">
                                                <div className="col">
                                                    <h3>{formData.routeStartTime || "날짜를 선택하세요"}</h3>
                                                    <hr />
                                                    <div className="row mt-4">
                                                        <div className="col off-set"> 
                                                        {/* {seats.map((seat) => (
                                                            <button
                                                                key={seat.seatNo}
                                                                onClick={() => handleSeatClick(seat.seatNo)}
                                                                style={{
                                                                    backgroundColor:
                                                                        selectedSeat === seat.seatNo ? "green" : "lightgray",
                                                                    margin: "5px",
                                                                    padding: "10px",
                                                                    border: "1px solid black",
                                                                    cursor: "pointer",
                                                                }}
                                                            >
                                                                <p>{seat.seatRow}행</p>
                                                                <p>{seat.seatColumn}열</p>
                                                                <p>버스번호:{seat.busNo}</p>
                                                            </button>
                                                        ))} */}
                                                        
                                                        {/* 좌석 라이브러리 */}
                                                        <SeatGroup map={seats} setMap={setSeats}
                                                            fields={{
                                                            no:'seatNo', 
                                                            row:'seatColumn', 
                                                            col:'seatRow', 
                                                            reserved:'seatReserved', 
                                                            disabled:'seatDisabled',
                                                            checked:'seatChecked',
                                                            }}
                                                            rows={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                                                            cols={[1, 2, '통로', 3, 4]} 
                                                            showNames
                                                        />
                                                        </div>
                                                    </div>
                                                    <div className="row mt-4">
                                                    </div>
                                                </div>
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
                        </Draggable>
                    </div>
                </>
            )}
        </>
    );
};

export default Reservation;
