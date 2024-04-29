import {
  Menu,
  MenuItem,
  Sidebar,
  SubMenu,
  sidebarClasses,
  menuClasses,
} from "react-pro-sidebar";
import { NavLink } from 'react-router-dom';

function SideBar() {
  return (
    <>
      <Sidebar
        rootStyles={{
          [`.${sidebarClasses.container}`]: {
            backgroundColor: 'white',
            height: '100vh', // 변경: 사이드바의 높이를 화면 높이와 동일하게 조정
            position: 'fixed', // 변경: 고정된 위치로 설정
            zIndex: 10, // 변경: 다른 요소 위에 배치
            top: 0, // 변경: 화면 상단에 고정
          },
        }}
      >
        <div className='row' style={{ marginBlockStart: '2em', marginLeft: '5em', marginBottom: '2em' }}>
          <div className='col'>
          <NavLink to="/"><img src="https://picsum.photos/100/100" alt="Sidebar Image" className='' /></NavLink>
          </div>
        </div>
        <Menu
          rootStyles={{
            [`.${menuClasses.subMenuRoot}`]: {
              backgroundColor: "white",
              color: "black",
            },
            [`.${menuClasses.menuItemRoot}`]: {
              backgroundColor: "white",
              color: "black",
            },
          }}
        >
          <SubMenu label="운행정보">
            <MenuItem> 시간표 조회 </MenuItem>
            <MenuItem> 도착시간 안내 </MenuItem>
          </SubMenu>
          <SubMenu label="이용안내">
            <MenuItem> 예매안내 </MenuItem>
            <MenuItem> 결제수단 안내 </MenuItem>
            <MenuItem> 승차권 환불 안내 </MenuItem>
            <MenuItem> 고속버스터미널 안내 </MenuItem>
          </SubMenu>
          <NavLink to="/notice">
            <MenuItem> 공지사항 </MenuItem>
          </NavLink>
          <SubMenu label="고객센터">
            <MenuItem> 자주하는 질문 </MenuItem>
            <MenuItem> 유실물센터 안내 </MenuItem>
          </SubMenu>
        </Menu>
      </Sidebar>
    </>
  );
}

export default SideBar;
