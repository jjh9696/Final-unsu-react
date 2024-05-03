import React, { useState, useRef, useCallback, useEffect } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ko from 'date-fns/locale/ko';
import { Modal } from "bootstrap";
import axios from "./utils/CustomAxios";
import { useParams } from "react-router";


import { FaArrowsAltH } from "react-icons/fa";
import { SiRollsroyce } from "react-icons/si";
import { MdOutlineAirlineSeatReclineExtra } from "react-icons/md";
import { BiFont } from "react-icons/bi";
import { MdOutlineAirlineSeatReclineNormal } from "react-icons/md";


const RoundTrip = () => {
  // state
  const [terminals, setTerminals] = useState([]); // terminal 상태를 객체로 초기화
  const [searchs,setSearches] = useState([]); // 

  // 선택된 지역 상태
  const [selectedRegion, setSelectedRegion] = useState("1");
  const [selectedTerminal, setSelectedTerminal] = useState(null); // 선택된 터미널 상태 추가





  // 선택된 지역 변경 시 호출될 함수
  const handleSelectChange = (event) => {
    setSelectedRegion(event.target.value);
  };

  useEffect(() => {
    loadData();
  }, [selectedRegion]); // selectedRegion이 변경될 때마다 loadData 호출

  const loadData = useCallback(async () => {

    const resp = await axios.get("/terminal/");
    setTerminals(resp.data);

  }, [selectedRegion]); // selectedRegion 상태가 변경될 때마다 loadData 호출

  const loadSearchData = useCallback(async ()=>{
    const resp = await axios.get("/search/");
    setSearches(resp.data);
  },[searchs]);

  useEffect(()=>{
    loadSearchData();
  },[]);

  useEffect(() => {
    switch (selectedRegion) {

      case "2":
        handleSeoulClick();
        break;
      case "4":
        handleIncheonGyeonggiClick();
        break;
      case "8":
        handleGwangjuJeonnamClick();
        break;
      case "9":
        handleJeonbukClick();
        break;
      case "10":
        handleBusanGyeongnamClick();
        break;
      case "11":
        handleDaeguGyeongbukClick();
        break;

    }
  }, [selectedRegion]); // selectedRegion이 변경될 때마다 실행





  const handleSeoulClick = () => {
    const seoulTerminals = terminals.filter(terminal => terminal.terminalRegion === '서울');
    setTerminals(seoulTerminals); // setTerminals 호출 후에
    setSelectedTerminal(seoulTerminals.length > 0 ? seoulTerminals[0].terminalName : ""); // setSelectedTerminal 호출
  };
  
  const handleIncheonGyeonggiClick = () => {
    const incheonGyeonggiTerminals = terminals.filter(terminal => terminal.terminalRegion === '인천/경기');
    setTerminals(incheonGyeonggiTerminals); // setTerminals 호출 후에
    setSelectedTerminal(incheonGyeonggiTerminals.length > 0 ? incheonGyeonggiTerminals[0].terminalName : ""); // setSelectedTerminal 호출
  };



  const handleGwangjuJeonnamClick = () => {
    const gwangjuJeonnamTerminals = terminals.filter(terminal => terminal.terminalRegion === '광주/전남');
    setTerminals(gwangjuJeonnamTerminals);
  };

  const handleJeonbukClick = () => {
    const jeonbukTerminals = terminals.filter(terminal => terminal.terminalRegion === '전북');
    setTerminals(jeonbukTerminals);
  };

  const handleBusanGyeongnamClick = () => {
    const busanGyeongnamTerminals = terminals.filter(terminal => terminal.terminalRegion === '부산/경남');
    setTerminals(busanGyeongnamTerminals);
  };

  const handleDaeguGyeongbukClick = () => {
    const daeguGyeongbukTerminals = terminals.filter(terminal => terminal.terminalRegion === '대구/경북');
    setTerminals(daeguGyeongbukTerminals);
  };




  const [startDate, setStartDate] = useState(null); // 가는날 상태 추가
  const [endDate, setEndDate] = useState(null); // 오는날 상태 추가
  const [tripType, setTripType] = useState('oneway'); // 편도와 왕복을 구분하기 위한 상태 추가


  // 편도를 선택할 때 가는날 DatePicker만 보이도록 설정
  const handleOneWayClick = () => {
    setTripType('oneway');
  };

  // 왕복을 선택할 때 가는날과 오는날 DatePicker 모두 보이도록 설정
  const handleRoundTripClick = () => {
    setTripType('roundtrip');
  };
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


  //등록 취소
  const cancelInput = useCallback(() => {
    const choice = window.confirm("작성을 취소하시겠습니까?");
    if (choice === false) return;
    closeModal();
  }, []);

  //Jason은 get방식으로는 보낼수 없음 Post나 , patch사용
  const [input, setInput] = useState({
    routeWay: "",
    routeStart: "",
    routeEnd: "",
    routeStartTime: "",
    routeEndTime: "",
    gradeType: "",
    seatNo:""
  });


  //등록(예약항목,터미널항목,노선항목,버스번호 필요)
  const saveInput = useCallback(async () => {
    try {
      // 입력값에 대한 검사 코드가 필요하다면 이 자리에 추가하고 차단!
      // if (검사 결과 이상한 데이터가 입력되어 있다면) return;

      // input에 들어있는 내용을 서버로 전송하여 등록한 뒤 목록 갱신 + 모달 닫기
      const resp = await axios.post("/search/", input);
      // 서버 요청이 성공한 경우에만 상태 업데이트와 모달 닫기를 수행
      if (resp.status === 200) {
        setInput({
          routeWay: "",
          routeStart: "",
          routeEnd: "",
          routeStartTime: "",
          routeEndTime: "",
          gradeType: "",
          seatNo:""
         
        });
        closeModal();
        loadData(); // 서버로부터 데이터 다시 불러오기
      }
    } catch (error) {
      // 서버 요청이 실패한 경우에 대한 예외 처리
      console.error("Error while saving input:", error);
    }
  }, [input]);

  //입력값 초기화
  const clearInput = useCallback(() => {
    setInput({
      routeWay: "",
      routeStart: "",
      routeEnd: "",
      routeStartTime: "",
      routeEndTime: "",
      gradeType: "",
      seatNo:""
    });
  }, []);
  //신규 등록 화면 입력값 변경
  const changeInput = useCallback((e) => {
    setInput({
        ...input,
        [e.target.name]: e.target.value
    });
}, [input]);

  return (
    <>
      <h3 className="">운수좋은날</h3>

      <div className="container-sm border border-5 rounded p-3 mb-3">
        {/* 편도와 왕복 */}
        <div className="row align-items-center ">
          <div className="col text-center border-end border-primary smooth-hover " onClick={handleOneWayClick}>
            
            {/* <input type="text" name="routeWay" value={input.routeWay} className="form-control">편도</input> */}
          </div>
          <div className="col text-center smooth-hover  " onClick={handleRoundTripClick}>
          {/* <input type="text" name="routeWay" value={input.routeWay} className="form-control">왕복</input> */}
          </div>
        </div>
      </div>

      <div className="container-sm border border-5 rounded p-5 mb-3" >
        {/* 출발지 */}
        <div className="row align-items-center" >
          <div className="col-md-2 p-5 text-center border border-5 rounded p-1 mb-3 smooth-hover " >
            <span className="d-inline-block font-style" onClick={e => openModal()}>출발</span>
            
            <p> {selectedTerminal && <span>{selectedTerminal} 선택됨</span>} </p>
          </div>
          
          <div className="col-md-1 p-1 text-center rounded p-1 mb-1">
            <FaArrowsAltH />
          </div>

          <div className="col-md-2 p-5 text-center border border-5 rounded p-1 mb-3 smooth-hover ">
            <span className="d-inline-block font-style" onClick={e => openModal()} >도착</span>
          </div>
          <div className="col-md-1"></div> {/* 빈 컬럼 추가 */}
          
            <div className="col-md-2 p-3 text-center border border-5 rounded p-4 mb-3 smooth-hover ">
              <span className="d-inline-block font-style">가는날</span>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="yyyy-MM-dd (eee)"
                className="form-control"
                locale={ko}
                dayClassName={(date) => (date.getDay() === 0 || date.getDay() === 6 ? 'weekend' : '')}
              />
              {startDate && <div>{startDate.toLocaleDateString('ko-KR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>}
            </div>
         
            <div className="col-md-1"></div> {/* 빈 컬럼 추가 */}
            <>
              <div className="col-md-2 p-3 text-center border border-5 rounded p-4 mb-3 smooth-hover ">
                <span className="d-inline-block font-style">오는날</span>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="yyyy-MM-dd (eee)"
                  className="form-control"
                  locale={ko}
                  dayClassName={(date) => (date.getDay() === 0 || date.getDay() === 6 ? 'weekend' : '')}
                />
                {startDate && <div>{startDate.toLocaleDateString('ko-KR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>}
              </div>
              <div className="col-md-1"></div> {/* 빈 컬럼 추가 */}
             
            </>
        
        </div>
      </div>

      <div className="container-sm border border-5 rounded p-3">
        <div className="row align-items-center">
          <div className="col-md-1"></div> {/* 빈 컬럼 추가 */}
          <div className="col-md-4 p-5 border border-5 rounded p-4 mb-3 d-flex flex-column">
            <div>등급</div>
            <div className="d-flex justify-content-between">
              <div>
                <SiRollsroyce />
                <span className="smooth-hover md-1">프리미엄</span>
                
              </div>
              <div>
                <MdOutlineAirlineSeatReclineExtra />
                <span className="smooth-hover md-1">우등</span>
              </div>

              <div>
                <MdOutlineAirlineSeatReclineNormal />
                <span className="smooth-hover md-1">일반</span>
              </div>
              <div>
                <BiFont />
                <span className="smooth-hover md-1">전체</span>
              </div>
            </div>
          </div>


          <div className="col-md-2"></div> {/* 빈 컬럼 추가 */}
          <div className="col-md-4 p-5 text-center border border-5 rounded p-4 mb-3 smooth-hover ">
            <span className="d-inline-block font-style">조회하기</span>
          </div>
        </div>
      </div>


      {/* Modal */}
      <div ref={bsModal} className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">출/도착지 선택</h1>
              <button type="button" className="btn-close" aria-label="Close"
                onClick={e => cancelInput()}></button>
            </div>
            <div className="modal-body">
              {/* 등록 화면 */}
              <select className="form-select form-select-sm" aria-label=".form-select-sm example" onClick={handleSelectChange}>
                <option selected>터미널을 선택 하세요</option>
                <option value="2" >서울</option>
                <option value="4">인천/경기</option>
                <option value="8">광주/전남</option>
                <option value="9">전북</option>
                <option value="10">부산/경남</option>
                <option value="11">대구/경북</option>
              </select>

              <div className="row mt-4">
                <div className="col">
                  <table className="table table-striped">
                    <thead className="text-center">
                      <tr>
                        <th>터미널번호</th>
                        <th>터미널이름</th>
                        <th>터미널지역</th>
                      </tr>
                    </thead>
                    <tbody className="text-center">
                      {terminals.map(terminal => {
                        if ((terminal.terminalId >= 138 && terminal.terminalId <= 140) && selectedRegion === "2") {
                          return (
                            <tr key={terminal.terminalId}>
                               <td>{terminal.terminalId}</td>
                              <td>{terminal.terminalName}</td>
                              <td>{terminal.terminalRegion}</td>
                            </tr>
                          );
                        } else if ((terminal.terminalId >= 102 && terminal.terminalId <= 137) && selectedRegion === "4") {
                          return (
                            <tr key={terminal.terminalId}>
                              <td>{terminal.terminalId}</td>
                              <td>{terminal.terminalName}</td>
                              <td>{terminal.terminalRegion}</td>
                            </tr>
                          );
                        } else if ((terminal.terminalId >= 55 && terminal.terminalId <= 69) && selectedRegion === "10") {
                          return (
                            <tr key={terminal.terminalId}>
                              <td>{terminal.terminalId}</td>
                              <td>{terminal.terminalName}</td>
                              <td>{terminal.terminalRegion}</td>
                            </tr>
                          );
                        } else if ((terminal.terminalId >= 81 && terminal.terminalId <= 101) && selectedRegion === "11") {
                          return (
                            <tr key={terminal.terminalId}>
                              <td>{terminal.terminalId}</td>
                              <td>{terminal.terminalName}</td>
                              <td>{terminal.terminalRegion}</td>
                            </tr>
                          );
                        } else if ((terminal.terminalId >= 40 && terminal.terminalId <= 54) && selectedRegion === "9") {
                          return (
                            <tr key={terminal.terminalId}>
                              <td>{terminal.terminalId}</td>
                              <td>{terminal.terminalName}</td>
                              <td>{terminal.terminalRegion}</td>
                            </tr>
                          );
                        } else if ((terminal.terminalId >= 1 && terminal.terminalId <= 36) && selectedRegion === "8") {
                          return (
                            <tr key={terminal.terminalId}>
                              <td>{terminal.terminalId}</td>
                              <td>{terminal.terminalName}</td>
                              <td>{terminal.terminalRegion}</td>
                            </tr>
                          );
                        }
                      })}
                    </tbody>
                  </table>
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

export default RoundTrip;
