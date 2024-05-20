import React, { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { loginIdState } from "../../utils/RecoilData";
import axios from "../../utils/CustomAxios";
import { Link, useNavigate } from "react-router-dom";
import { LiaCoinsSolid } from "react-icons/lia";

const Mypage = () => {
    const loginId = useRecoilValue(loginIdState);
    const [mypage, setMypage] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        memberPhone: "",
        memberZip: "",
        memberAddr1: "",
        memberAddr2: "",
        memberServiceAgree: ""
    });
    const navigate = useNavigate();

    const pointCharge = () => {
        navigate("/point");
    };

    const loadData = useCallback(async () => {
        try {
            const resp = await axios.get(`/member/${loginId}`);
            setMypage(resp.data);
            setFormData({
                memberPhone: resp.data.memberPhone,
                memberZip: resp.data.memberZip,
                memberAddr1: resp.data.memberAddr1,
                memberAddr2: resp.data.memberAddr2,
                memberServiceAgree: resp.data.memberServiceAgree
            });
        } catch (error) {
            console.error("데이터 읽기 실패:", error);
        }
    }, [loginId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? (checked ? 'Y' : 'N') : value
        }));
    };

    const handleSave = async () => {
        try {
            const updateData = {
                memberId: loginId,
                memberPhone: formData.memberPhone,
                memberZip: formData.memberZip,
                memberAddr1: formData.memberAddr1,
                memberAddr2: formData.memberAddr2,
                memberServiceAgree: formData.memberServiceAgree
            };
            await axios.patch(`/member/`, updateData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            loadData();  // 데이터 다시 로드
            alert("변경에 성공하였습니다");
            setEditMode(false);
        } catch (error) {
            console.error("데이터 저장 실패:", error);
        }
    };

    if (!mypage) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <div className="card mb-3">
                <div className="row">
                    <div className="col flex-fill">
                        <h3 className="card-header">마이페이지</h3>
                        <h3 className="text-end" onClick={pointCharge} style={{ cursor: 'pointer' }}>
                            <LiaCoinsSolid />포인트
                        </h3>
                    </div>
                </div>
                <div className="card-body pt-4 ps-4">
                    <h6 className="card-subtitle text-muted"> </h6>
                    <p className="card-text">
                        이름: {mypage.memberName}<br />
                    </p>
                    <p className="card-text">
                        생년월일: {mypage.memberBirth}<br />
                    </p>
                    <p className="card-text">
                        전화번호:
                        {editMode ? (
                            <input
                                type="text"
                                name="memberPhone"
                                value={formData.memberPhone}
                                onChange={handleChange}
                                className="form-control"
                            />
                        ) : (
                            mypage.memberPhone
                        )}
                    </p>
                    <p className="card-text">
                        포인트: {mypage.memberPoint}<br />
                    </p>
                    <p className="card-text">
                        이메일: {mypage.memberEmail}<br />
                    </p>
                    <p className="card-text">
                        이벤트 활용동의여부:
                        {editMode ? (
                            <input
                                type="checkbox"
                                name="memberServiceAgree"
                                checked={formData.memberServiceAgree === 'Y'}
                                onChange={handleChange}
                            />
                        ) : (
                            mypage.memberServiceAgree
                        )}
                    </p>
                    <p className="card-text">
                        <label>우편번호:</label>
                        {editMode ? (
                            <input
                                type="text"
                                name="memberZip"
                                value={formData.memberZip}
                                onChange={handleChange}
                                className="form-control"
                            />
                        ) : (
                            mypage.memberZip
                        )}
                    </p>
                    <p className="card-text">
                        <label>기본주소:</label>
                        {editMode ? (
                            <input
                                type="text"
                                name="memberAddr1"
                                value={formData.memberAddr1}
                                onChange={handleChange}
                                className="form-control"
                            />
                        ) : (
                            mypage.memberAddr1
                        )}
                    </p>
                    <p className="card-text">
                        <label>상세주소:</label>
                        {editMode ? (
                            <input
                                type="text"
                                name="memberAddr2"
                                value={formData.memberAddr2}
                                onChange={handleChange}
                                className="form-control"
                            />
                        ) : (
                            mypage.memberAddr2
                        )}
                    </p>
                    <div className="card-body text-end">
                        {editMode ? (
                            <>
                                <button className="btn btn-outline-success" onClick={handleSave}>저장</button>
                                <button className="btn btn-outline-secondary" onClick={() => setEditMode(false)}>취소</button>
                            </>
                        ) : (
                            <button className="btn btn-outline-success" onClick={() => setEditMode(true)}>회원정보변경</button>
                        )}
                    </div>
                </div>
                <div className="card-body">
                    <Link to="/orderList" className="card-link">예매확인</Link>
                    <Link to="/deleteMember" className="card-link">탈퇴</Link>
                    <Link to="/pw" className="card-link">비밀번호 변경</Link>
                </div>
            </div>
        </div>
    );
};

export default Mypage;
