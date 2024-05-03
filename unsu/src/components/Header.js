import { useCallback, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { loginIdState, loginLevelState, isLoginState } from "./utils/RecoilData";
import axios from "./utils/CustomAxios";
import { Link,useNavigate } from "react-router-dom";



const headerStyles = `
.header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 50px;
    padding: 0 20px;
    background-color: #fff;
    border-bottom: 1px solid #ccc;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
    flex: 1;
    text-align: center;
}

.menu {
    display: flex;
    justify-content: flex-end;
    gap: 20px;
}

.menu-item {
    text-decoration: none;
    color: #333;
}
`;


const Header = () => {
    // Navigate hook
    const navigate = useNavigate();

    // recoil value
    //recoil
    const [loginId, setLoginId] = useRecoilState(loginIdState);
    const [loginLevel, setLoginLevel] = useRecoilState(loginLevelState);
    const isLogin = useRecoilValue(isLoginState);
    const logout = useCallback(() => {
        // recoil 저장소에 대한 정리 + axios의 헤더 제거 + localStorage 청소
        setLoginId('');
        setLoginLevel('');
        navigate("/"); 
        delete axios.defaults.headers.common['Authorization'];
        window.localStorage.removeItem("refreshToken");
    }, [loginId, loginLevel]);


    return (
        <div className="row   text-end headerStyles" >
            <div className="col  bg-light">
                {isLogin ? (
                    <>
                        <div className="col">
                            {loginId}님
                            <button className="btn" onClick={e => logout()}>로그아웃</button>
                            <Link to="/mypage" className="btn">마이페이지</Link>
                        </div>
                    </>
                ) : (
                    <>
                        <Link to="/Join" className="btn">회원가입</Link>
                        <Link to="/Login" className="btn">로그인</Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default Header;