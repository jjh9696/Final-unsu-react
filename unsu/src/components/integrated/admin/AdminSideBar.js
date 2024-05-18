import {
    Menu,
    MenuItem,
    Sidebar,
    SubMenu,
    sidebarClasses,
    menuClasses,
  } from "react-pro-sidebar";
  import { Link } from 'react-router-dom';
  import "./AdminSideBar";
  import busLogo from "../../../images/busLogo.png";
  import busLogo2 from "../../../images/busLogo2.png";
  import busLogo3 from "../../../images/busLogo3.png";
  
  const basicTheme = {
    sidebar: {
      backgroundColor: "#FFFFFF",
      height: "1000px",
    },
    menu: {
      menuContent: "#FFFFFF",
      hover: {
        backgroundColor: "#FFFFFF",
        color: "#848484"
      },
    },
    subMenu: {
      menuContent: "#FFFFFF",
      hover: {
        backgroundColor: "#FFFFFF",
        color: "#848484"
      },
    }
  }
  
  const AdminSideBar = () => {
  
    const sidebarStyles = {
      height: '1000px',
    }
    const menuItemStyles = {
      root: {
        fontSize: '14px',
        backgroundColor: basicTheme.menu.menuContent
      },
      button: {
        '&:hover': {
          backgroundColor: basicTheme.menu.hover.backgroundColor,
          color: basicTheme.menu.hover.color
        }
      }
    }
    const subItemStyles = {
      root: {
        fontSize: '12px',
        backgroundColor: basicTheme.subMenu.menuContent
      },
      button: {
        '&:hover': {
          backgroundColor: basicTheme.subMenu.hover.backgroundColor,
          color: basicTheme.menu.hover.color
        }
      }
    }
  
    return (
      <>
          <Sidebar rootStyles={sidebarStyles}>
                  <div className="text-center py-4">
                      {/* <Link to="/"><img src="https://picsum.photos/100/100" /></Link> */}
                      {/* <Link to="/"><img src={busLogo}/></Link> */}
                      {/* <Link to="/"><img src={busLogo2}/></Link> */}
                      <Link to="/"><img src={busLogo3}/></Link>
                  </div>
                  <div className="logo-outline" />
                  <Menu>
                      <SubMenu label="회원 관리" defaultClose>
                          <Menu menuItemStyles={subItemStyles}>
                              <MenuItem component={<Link to="/memberList" />}> 회원 조회 </MenuItem>
                              <MenuItem component={<Link to="/pointList" />}> 포인트 관리 </MenuItem>
                              {/* <MenuItem component={<Link to="/" />}> 메세지 보내기 </MenuItem>
                              <MenuItem component={<Link to="/" />}> 고객 예약 관리 </MenuItem> */}
                          </Menu>
                      </SubMenu>
                  </Menu>
                  <Menu>
                      <SubMenu label="운수 관리" defaultClose>
                          <Menu menuItemStyles={subItemStyles}>
                              <MenuItem component={<Link to="/driver" />}> 기사님 관리 </MenuItem>
                              <MenuItem component={<Link to="/bus" />}> 버스차량 관리 </MenuItem>
                              <MenuItem component={<Link to="/route" />}> 노선도 관리 </MenuItem>
                              <MenuItem component={<Link to="/terminal" />}> 터미널 관리 </MenuItem>
                              <MenuItem component={<Link to="/charge" />}> 요금 관리 </MenuItem>
                          </Menu>
                      </SubMenu>
                  </Menu>
                  {/* <Menu>
                      <SubMenu label="이용안내" defaultClose>
                          <Menu menuItemStyles={subItemStyles}>
                              <MenuItem component={<Link to="/" />}> 예매안내  </MenuItem>
                              <MenuItem component={<Link to="/" />}> 결제수단 안내</MenuItem>
                              <MenuItem component={<Link to="/" />}> 승차권 환불 안내</MenuItem>
                              <MenuItem component={<Link to="/" />}> 고속버스터미널 안내</MenuItem>
                          </Menu>
                      </SubMenu>
                  </Menu> */}
                  <Menu>
                      <SubMenu label="게시판관리" defaultClose>
                          <Menu menuItemStyles={subItemStyles}>
                              <MenuItem component={<Link to="/notice" />}> 공지사항 </MenuItem>
                              <MenuItem component={<Link to="/reviewList" />}> 이용후기 </MenuItem>
                          </Menu>
                      </SubMenu>
                  </Menu>
                  {/* <Menu>
                      <SubMenu label="고객센터" defaultClose>
                          <Menu menuItemStyles={subItemStyles}>
                              <MenuItem component={<Link to="/" />}> 자주하는 질문  </MenuItem>
                              <MenuItem component={<Link to="/" />}> 유실물센터 안내</MenuItem>
                          </Menu>
                      </SubMenu>
                  </Menu> */}
                  <Menu>
                      <SubMenu label="챗봇 관리" defaultClose>
                          <Menu menuItemStyles={subItemStyles}>
                              <MenuItem component={<Link to="/chatbot" />}> 챗봇 확인 </MenuItem>
                              <MenuItem component={<Link to="/chatbotEdit" />}> 챗봇 수정 </MenuItem>
                          </Menu>
                      </SubMenu>
                  </Menu>
                  <Menu>
                      <SubMenu label="문의 채팅" defaultClose>
                          <Menu menuItemStyles={subItemStyles}>
                              <MenuItem component={<Link to="/memberChat" />}> 문의 채팅 </MenuItem>
                          </Menu>
                      </SubMenu>
                  </Menu>
                  <Menu>
                      <SubMenu label="통계" defaultClose>
                          <Menu menuItemStyles={subItemStyles}>
                              <MenuItem component={<Link to="/reservationStats" />}> 예약 통계 </MenuItem>
                          </Menu>
                      </SubMenu>
                  </Menu>
                      <div className="logo-outline" />
                  <div className="logo-outline" />
          </Sidebar >
      </>
    );
  }
  
  export default AdminSideBar;