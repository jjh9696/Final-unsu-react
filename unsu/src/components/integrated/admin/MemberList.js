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
        memberId:"",
        memberName:"",
        memberBirth:"",
        memberEmail:"",
        memberPhone:"",
        memberLevel:"",
        memberJoinDate:"",
        memberLoginDate:"",
        memberPoint:"",
        memberZip:"",
        memberAddr1:"",
        memberAddr2:"",
        memberPrivacyAgree:"",
        memberPrivacyDate:"",
        memberServiceAgree:"",
        memberBusAgree:""
    });
    //페이징
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10);
    //검색
    const [keyword, setKeyword] = useState(""); // 검색어는 빈 문자열로 초기화


    //불러와
    useEffect(() => {
        loadData();
    }, []);
    //콜백해
    const loadData = useCallback(async () => {
        const resp = await axios.get("/member/");
        setMembers(resp.data);
    }, [members]);

    useEffect(() => {
        setPostsPerPage(10);
    }, [members]);

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
                <div className="col d-flex justify-content-between">
                    <select className="form-select rounded" style={{width:'15%'}}>

                    </select>
                    <input className="form-control rounded text-end" style={{width:'30%'}}/>
                    <button className="btn btn-outline">
                        <RiUserSearchFill/>
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
                            {currentPost.map(member => (
                                <tr>
                                    <td>{member.memberId}</td>
                                    <td>{member.memberName}</td>
                                    <td>{member.memberLevel}</td>
                                    <td>{member.memberEmail}</td>
                                    <td>
                                        <FaUserShield onClick={e => openModalInfo(member)}
                                            style={{ cursor: 'pointer' }} 
                                            className="text-primary"/>
                                    </td>
                                </tr>
                            ))}
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
            <div ref={bsModal} className="modal fade" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">회원 상세정보</h1>
                            <button type="button" className="btn-close" aria-label="Close" onClick={e => closeModalInfo()}></button>
                        </div>
                        <div className="modal-body">
                            
                            <div className="row mt-4">
                                <div className="col">
                                    <label>ID</label>
                                    <h3>{selectMember.memberId}</h3>
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col">
                                    <label>이름</label>
                                    <h3>{selectMember.memberName}</h3>
                                </div>
                                <div className="col">
                                    <label>등급</label>
                                    <h3>{selectMember.memberLevel}</h3>
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col">
                                    <label>생년월일</label>
                                    <h3>{selectMember.memberBirth}</h3>
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col">
                                    <label>이메일</label>
                                    <h3>{selectMember.memberEmail}</h3>
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col">
                                    <label>연락처</label>
                                    <h3>{selectMember.memberPhone}</h3>
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col">
                                    <label>포인트</label>
                                    <h3>{selectMember.memberPoint} Point</h3>
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col">
                                    <label>주소</label>
                                    <h3>[{selectMember.memberZip}] &nbsp;
                                        {selectMember.memberAddr1} &nbsp;
                                        {selectMember.memberAddr2}</h3>
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col">
                                    <label>개인정보 수집 동의</label>
                                    <h3>{selectMember.memberPrivacyAgree}</h3>
                                </div>
                                <div className="col">
                                    <label>동의일자</label>
                                    <h3>{selectMember.memberPrivacyDate}</h3>
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col">
                                    <label>메일 수신 동의</label>
                                    <h3>{selectMember.memberServiceAgree}</h3>
                                </div>
                                <div className="col">
                                    <label>버스 탑승 동의</label>
                                    <h3>{selectMember.memberBusAgree}</h3>
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col">
                                    <label>가입 일시</label>
                                    <h3>{selectMember.memberJoinDate}</h3>
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col">
                                    <label>최근 로그인</label>
                                    <h3>{selectMember.memberLoginDate}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MemberList;