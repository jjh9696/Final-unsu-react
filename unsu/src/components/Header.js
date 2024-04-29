import { NavLink } from "react-router-dom";

const Header = () => {
    return (
        <div className="row ms-5 ps-5 text-end" >
            <div className="col ms-5 ps-5 bg-light">
                <NavLink to="/join" className="">회원가입</NavLink>&nbsp;
                <NavLink to="/login" className="">로그인</NavLink>
            </div>
        </div>
    );
};

export default Header;