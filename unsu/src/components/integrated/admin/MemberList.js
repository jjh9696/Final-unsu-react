import { useCallback, useEffect, useRef, useState } from "react";
import Jumbotron from "../../../Jumbotron";
import axios from "../../utils/CustomAxios";
import { FaUserShield } from "react-icons/fa";
import { Modal } from "bootstrap";



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
        memberBysAgree:""
    });


    //불러와
    useEffect(() => {
        loadData();
    }, []);
    //콜백해
    const loadData = useCallback(async () => {
        const resp = await axios.get("/member/");
        setMembers(resp.data);
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


    return (
        <>
            <Jumbotron title="회원 목록" />

            <div className="row mt-4">
                <div className="col">
                    <table className="table text-center">
                        <thead>
                            <tr>
                                <th>아이디</th>
                                <th>이름</th>
                                <th>등급</th>
                                <th>이메일</th>
                                <th>상세보기</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map(member => (
                                <tr>
                                    <td>{member.memberId}</td>
                                    <td>{member.memberName}</td>
                                    <td>{member.memberLevel}</td>
                                    <td>{member.memberEmail}</td>
                                    <td>
                                        <FaUserShield onClick={e => openModalInfo(member)}
                                            style={{ cursor: 'pointer' }} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>



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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MemberList;