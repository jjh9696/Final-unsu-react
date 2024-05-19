import { useCallback, useEffect, useRef, useState } from "react";
import Jumbotron from "../../../Jumbotron";
import axios from "../../utils/CustomAxios";
import { FaUserShield } from "react-icons/fa";
import { Modal } from "bootstrap";
import Pagination from '../../utils/Pagination';
import { RiUserSearchFill } from "react-icons/ri";

const MemberList = () => {
    //state
    const [members, setMembers] = useState([]);
    const [selectMember, setSelectMember] = useState({
        memberId: "",
        memberName: "",
        memberBirth: "",
        memberEmail: "",
        memberPhone: "",
        memberLevel: "",
        memberJoinDate: "",
        memberLoginDate: "",
        memberPoint: "",
        memberZip: "",
        memberAddr1: "",
        memberAddr2: "",
        memberPrivacyAgree: "",
        memberPrivacyDate: "",
        memberServiceAgree: "",
        memberBusAgree: ""
    });
    //페이징
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10);
    //검색
    const [defaultColumn, setDefaultColumn] = useState("member_id");//기본값
    const [keyword, setKeyword] = useState(""); // 검색어는 빈 문자열로 초기화
    const [searched, setSearched] = useState(false); //검색 여부 상태 추가

    //불러와
    useEffect(() => {
        loadData();
    }, []);

    //콜백해
    const loadData = useCallback(async () => {
        try {
            const resp = await axios.get("/member/");
            if (Array.isArray(resp.data)) {
                setMembers(resp.data);
            } else {
                console.error("응답 데이터가 배열이 아닙니다:", resp.data);
                setMembers([]);
            }
        } catch (error) {
            console.error("회원 목록을 불러오는 중 오류 발생:", error);
            setMembers([]);
        }
    }, []);

    useEffect(() => {
        setPostsPerPage(10);
    }, [members]);
    useEffect(() => {
        handleSearch();
    }, [searched])

    //검색핸들
    const handleSearch = (async () => {
        try {
            console.log("column : " + defaultColumn);
            console.log("keyword : " + keyword);
            const resp = await axios.get(`/member/search/column/${defaultColumn}/keyword/${keyword}`);
            if (Array.isArray(resp.data)) {
                // 검색 결과를 받아온 후에 직접 표시할 목록을 업데이트
                setCurrentPage(1); // 검색 결과는 첫 번째 페이지부터 표시되어야 함
                setMembers(resp.data);
            } else {
                console.error("검색 응답 데이터가 배열이 아닙니다:", resp.data);
                setMembers([]);
            }
            setSearched(true);
        } catch (error) {
            console.error("회원 검색 중 오류 발생:", error);
            setMembers([]);
        }
    });

    //엔터 키를 눌렀을 때 검색 실행
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleSearch]);


    //키워드바꾸기
    const keywordChange = (e) => {
        setKeyword(e.target.value);
    };
    //컬럼체인지
    const columnChange = (e) => {
        setDefaultColumn(e.target.value);
    };

    //모달세트
    const bsModal = useRef(); //상세모달을 위한거
    const openModalInfo = useCallback((member) => {
        setSelectMember(member); // 클릭한 회원 정보
        const modal = new Modal(bsModal.current);
        modal.show();
    }, [bsModal]);
    //상세보기 모달 닫기
    const closeModalInfo = useCallback(() => {
        const modal = Modal.getInstance(bsModal.current);
        modal.hide();
    }, [bsModal]);

    //pagination
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPost = members.slice(indexOfFirstPost, indexOfLastPost);

    return (
        <>
            <Jumbotron title="회원 목록" />

            <div className="row mt-4">
                <div className="col d-flex justify-content-end">
                    <select className="form-select rounded" style={{ width: '12%' }} onChange={columnChange}>
                        <option value="member_id">ID</option>
                        <option value="member_name">이름</option>
                        <option value="member_level">등급</option>
                    </select>
                    <input className="ms-2 form-control rounded" style={{ width: '25%' }} onChange={keywordChange} />
                    <button className="ms-2 btn btn-outline-primary" onClick={handleSearch}>
                        <RiUserSearchFill />
                    </button>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <table className="table table-hover text-center">
                        <thead className="table-primary">
                            <tr>
                                <th>아이디</th>
                                <th>이름</th>
                                <th>등급</th>
                                <th>이메일</th>
                                <th>상세보기</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPost.length > 0 ? (
                                currentPost.map((member, index) => (
                                    <tr key={index}>
                                        <td>{member.memberId}</td>
                                        <td>{member.memberName}</td>
                                        <td>{member.memberLevel}</td>
                                        <td>{member.memberEmail}</td>
                                        <td>
                                            <FaUserShield onClick={e => openModalInfo(member)}
                                                style={{ cursor: 'pointer' }}
                                                className="text-primary" />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">회원 정보를 찾을 수 없습니다.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <Pagination
                postsPerPage={postsPerPage}
                totalPages={Math.ceil(members.length / postsPerPage)}
                paginate={setCurrentPage}
                currentPage={currentPage}
            />

            {/* 상세보기 모달 */}
            <div ref={bsModal} className="modal fade" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">회원 상세정보</h1>
                            <button type="button" className="btn-close" aria-label="Close" onClick={e => closeModalInfo()}></button>
                        </div>
                        <div className="modal-body">
                            <div className="col p-2 d-flex justify-content-evenly">
                                <div className="d-flex flex-column align-items-center">
                                    <label>ID</label>
                                    <h3>{selectMember.memberId}</h3>
                                </div>
                                <div className="d-flex flex-column align-items-center">
                                    <label>이름</label>
                                    <h3>{selectMember.memberName}</h3>
                                </div>
                            </div>

                            <ul className="list-group list-group-flush mt-2">
                                <li className="list-group-item d-flex justify-content-between">
                                    <label className="mr-2 mb-0">등급</label>
                                    <h5 className="mb-0 ms-4">{selectMember.memberLevel}</h5>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <label className="mr-2 mb-0">생년월일</label>
                                    <h5 className="mb-0 ms-4">{selectMember.memberBirth}</h5>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <label className="mr-2 mb-0">이메일</label>
                                    <h5 className="mb-0 ms-4">{selectMember.memberEmail}</h5>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <label className="mr-2 mb-0">연락처</label>
                                    <h5 className="mb-0 ms-4">{selectMember.memberPhone}</h5>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <label className="mr-2 mb-0">포인트</label>
                                    <h5 className="mb-0 ms-4">{selectMember.memberPoint} Point</h5>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <label className="mr-2 mb-0">우편번호</label>
                                    <h5 className="mb-0 ms-4">[{selectMember.memberZip}]</h5>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <label className="mr-2 mb-0">주소</label>
                                    <h5 className="mb-0 ms-4">{selectMember.memberAddr1}&nbsp;{selectMember.memberAddr2}</h5>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <label className="mr-2 mb-0">개인정보 수집 동의</label>
                                    <h5 className="mb-0 ms-4">{selectMember.memberPrivacyAgree}</h5>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <label className="mr-2 mb-0">개인정보 수집 동의일시</label>
                                    <h5 className="mb-0 ms-4">{selectMember.memberPrivacyDate}</h5>
                                </li>

                                <li className="list-group-item d-flex justify-content-between">
                                    <label className="mr-2 mb-0">메일 수신 동의</label>
                                    <h5 className="mb-0 ms-4">{selectMember.memberServiceAgree}</h5>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <label className="mr-2 mb-0">버스 탑승 동의</label>
                                    <h5 className="mb-0 ms-4">{selectMember.memberBusAgree}</h5>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <label className="mr-2 mb-0">가입일</label>
                                    <h5 className="mb-0 ms-4">{selectMember.memberJoinDate}</h5>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <label className="mr-2 mb-0">최근 로그인</label>
                                    <h5 className="mb-0 ms-4">{selectMember.memberLoginDate}</h5>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MemberList;
