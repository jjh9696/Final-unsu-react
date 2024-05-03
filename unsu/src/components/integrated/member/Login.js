import { useCallback, useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { loginIdState, loginLevelState } from "../../utils/RecoilData";
import axios from "../../utils/CustomAxios";
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';

const Login = () => {
    // 상태 관리
    const [member, setMember] = useState({
        memberId: "", memberPw: ""
    });
    const [isRemember, setRemember] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['rememberId']);
    const [loginId, setLoginId] = useRecoilState(loginIdState);
    const [loginLevel, setLoginLevel] = useRecoilState(loginLevelState);
    const navigate = useNavigate();

    // 쿠키에서 ID 불러오기
    useEffect(() => {
        if (cookies.rememberId) {
            setMember(prev => ({ ...prev, memberId: cookies.rememberId }));
            setRemember(true);
        }
    }, [cookies.rememberId]);

    // 사용자 입력 처리
    const changeMember = useCallback((e) => {
        setMember(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    }, []);

    // 로그인 처리
    const handleLogin = useCallback(async () => {
        if (!member.memberId || !member.memberPw) {
            alert("아이디와 비밀번호를 입력해주세요.");
            return;
        }

        try {
            const resp = await axios.post("/member/login", member);
            setLoginId(resp.data.memberId);
            setLoginLevel(resp.data.memberLevel);
            axios.defaults.headers.common['Authorization'] = resp.data.accessToken;
            window.localStorage.setItem("refreshToken", resp.data.refreshToken);
            // 쿠키설정 부분
            if (isRemember) {
                setCookie('rememberId', member.memberId, { path: '/', maxAge: 3600 * 24 * 30 });
            } else {
                removeCookie('rememberId', { path: '/' });
            }

            if (resp.data.memberLevel === '관리자') {
                navigate("/adminHome");
            } else {
                navigate("/");
            }
        } catch (error) {
            console.error("로그인 실패: ", error.response);
            alert("로그인에 실패했습니다.");
        }
    }, [member, isRemember, navigate, setCookie, removeCookie, setLoginId, setLoginLevel]);

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
        }}>
            <div className='container w-50 mt-5 pt-4'>
                <div className="row mt-4">
                    <div className="col">
                        <label>로그인</label>
                        <hr />
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col">
                        <label>아이디</label>
                        <input type="text" name="memberId" className="form-control"
                            value={member.memberId} onChange={changeMember} />
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col">
                        <label>비밀번호</label>
                        <input type="password" name="memberPw" className="form-control"
                            value={member.memberPw} onChange={changeMember} />
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col">
                        <button type="submit" className="btn btn-success w-100">로그인</button>
                    </div>
                </div>
                <label className="loginPage_text">
                    <input type="checkbox" onChange={(e) => setRemember(e.target.checked)}
                        checked={isRemember}
                    />
                    ID 저장하기
                </label>
            </div>
        </form>
    );
};

export default Login;
