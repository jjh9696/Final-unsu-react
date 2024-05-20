import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import Jumbotron from "../../../Jumbotron";
import axios from "../../utils/CustomAxios";
import moment from "moment";
import { FaEye } from "react-icons/fa";
import { useRecoilState, useRecoilValue } from "recoil";
import { isLoginState, loginIdState, loginLevelState } from "../../utils/RecoilData";

const NoticeDetail = (props) => {

    // const location = useLocation();
    // //원하는 곳에서 location.pathname 쓰면 현재 페이지 주소가 나옴
    // useEffect(()=>{
    //     console.log(location.pathname);
    // }, []);

    const { noticeNo } = useParams();
    useEffect(() => {
        //console.log('공지사항번호:', noticeNo);
    }, []);


    const [notice, setNotice] = useState({});

    const [input, setInput] = useState({
        noticeTitle: "",
        noticeContent: ""
    });
    //수정시 복원을 위한 백업
    const [backup, setBackup] = useState(null);

    //recoil state
    const [loginLevel, setLoginLevel] = useRecoilState(loginLevelState);

    // //effect
    useEffect(() => {
        getNotice();
    }, []);

    const loadData = useCallback(async () => {
        const resp = await axios.get("/notice/");
        setNotice(resp.data);
    }, [notice]);

    //비동기 상세 번호 불러오기
    const getNotice = useCallback(async () => {
        const resp = await axios.get(`/notice/${noticeNo}`);
        setNotice(resp.data);
    }, []);

    //navigator
    const navigator = useNavigate();

    //목록 바로가기
    const redirectList = useCallback(() => {
        //강제 페이지 이동 - useNavigate()
        navigator("/notice/");
    }, []);

    //수정
    const editNotice = useCallback((target) => {
        //1. notice 복제
        const copy = { ...notice, edit: true };

        // 수정 중인 항목이 있을 수 있으므로 해당 항목은 취소 처리가 필요
        if (copy.edit === true) {
            copy.edit = false;
        }

        // target을 백업
        setBackup({ ...notice });

        // target과 동일한 정보를 가진 항목을 수정 모드로 변경

        copy.edit = true;


        // 수정된 내용으로 상태 업데이트
        setNotice(copy);
    }, [notice]);

    //입력수정
    const changeNotice = useCallback((e, target) => {
        const copy = { ...notice };

        // target과 동일한 정보를 가진 항목을 찾아서 수정
        if (target.noticeNo === copy.noticeNo) {
            copy[e.target.name] = e.target.value;
        }


        // 수정된 내용으로 상태 업데이트
        setNotice(copy);
    }, [notice]);

    //수정된 결과를 저장 + 목록갱신 + 수정모드 해제
    const saveEditNotice = useCallback(async (target) => {
        //서버에 target을 전달하여 수정 처리
        const resp = await axios.patch("/notice/", target);

        // 수정 모드 해제하고 화면 갱신
        setNotice(prevNotice => ({
            ...prevNotice,
            edit: false
        }));
    }, []);

    const cancelEditNotice = useCallback((target) => {
        // 이전 데이터로 복원하여 상태 업데이트
        setNotice(backup);

        // 수정 모드 해제
        setNotice(prevNotice => ({
            ...prevNotice,
            edit: false
        }));
    }, [backup]);



    //삭제
    const deleteNotice = useCallback(async (target) => {
        const choice = window.confirm("확인을 누르시면 완전히 삭제 됩니다.");
        if (choice === true) {
            const resp = await axios.delete("/notice/" + target.noticeNo);
            loadData();
            redirectList(); //목록 페이지 이동
        }
    }, [notice]);

    //시간 변경 moment.js(라이브러리 사용)
    const formattedDate = moment(notice.noticeWdate).format("YYYY-MM-DD HH:mm:ss");

    return (
        <>
            {notice.edit === true ? (
                <>
                    <div className="row mt-4">
                        <div className="col">
                            <h2>공지사항 수정</h2>
                        </div>
                    </div>
                    <hr />
                    <div className="row mt-4">
                        <div className="col">
                            <input type="text" className="form-control"
                                value={notice.noticeTitle} name="noticeTitle"
                                onChange={e => changeNotice(e, notice)} />
                        </div>
                    </div>

                    <div className="row mt-4">
                        <div className="col">
                            <textarea type="text" className="form-control"
                                value={notice.noticeContent} name="noticeContent"
                                onChange={e => changeNotice(e, notice)} />
                        </div>
                    </div>

                    <div className="row mt-4 text-end">
                        <div className="col">
                            <button className="btn text-success me-2"
                                onClick={e => saveEditNotice(notice)}>
                                수정하기
                            </button>
                            <button className="btn text-danger"
                                onClick={e => cancelEditNotice(notice)}>
                                취소하기
                            </button>
                        </div>
                    </div>

                </>
            ) : (
                <>
                    <div className="row mt-4 text-center">
                        <div className="col">
                            <h4>운수좋은날 홈페이지의 새로운 소식을 확인하세요.</h4>
                        </div>
                    </div>
                    <hr />
                    <div className="row mt-4">
                        <div className="col">
                            <strong><h4>{notice.noticeTitle}</h4></strong>
                        </div>
                    </div>
                    <p className="text-end">{formattedDate}</p>
                    <hr />

                    <div className="row mt-4">
                        <div className="col">
                            <div className="row mt-4">
                                <div className="col">
                                    <p>{notice.noticeContent}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr />

                    <p><FaEye /> {notice.noticeViewCount}</p>
                    <hr />
                    <div className="row mt-4">
                        <div className="col d-flex justify-content-between">
                            <button className="btn btn-success me-5 text-start" onClick={e => redirectList()}>
                                목록
                            </button>

                            {loginLevel === '관리자' && (
                            <div>
                                <button className="btn btn-warning text-end me-2"
                                    onClick={e => editNotice(notice)}>
                                    수정
                                </button>
                                <button className="btn btn-danger text-end"
                                    onClick={e => deleteNotice(notice)}>
                                    삭제
                                </button>
                            </div>
                            )}
                        </div>
                    </div>
                </>
            )}



        </>
    );

};
export default NoticeDetail;