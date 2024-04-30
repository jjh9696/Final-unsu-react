import {
  Menu,
  MenuItem,
  Sidebar,
  SubMenu,
  sidebarClasses,
  menuClasses,
} from "react-pro-sidebar";
import { Link } from 'react-router-dom';
import "./SideBar";

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

const SideBar = () => {

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
                    <Link to="/"><img src="https://picsum.photos/100/100" /></Link>
                </div>
                <div className="logo-outline" />
                <Menu>
                    <SubMenu label="운행정보" defaultClose>
                        <Menu menuItemStyles={subItemStyles}>
                            <MenuItem component={<Link to="/" />}> 시간표 조회 </MenuItem>
                            <MenuItem component={<Link to="/" />}> 도착시간 안내</MenuItem>
                        </Menu>
                    </SubMenu>
                </Menu>
                <Menu>
                    <SubMenu label="이용안내" defaultClose>
                        <Menu menuItemStyles={subItemStyles}>
                            <MenuItem component={<Link to="/" />}> 예매안내  </MenuItem>
                            <MenuItem component={<Link to="/" />}> 결제수단 안내</MenuItem>
                            <MenuItem component={<Link to="/" />}> 승차권 환불 안내</MenuItem>
                            <MenuItem component={<Link to="/" />}> 고속버스터미널 안내</MenuItem>
                        </Menu>
                    </SubMenu>
                </Menu>
                <Menu>
                    <SubMenu label="공지사항" defaultClose>
                        <Menu menuItemStyles={subItemStyles}>
                            <MenuItem component={<Link to="/notice" />}> 공지사항 </MenuItem>
                        </Menu>
                    </SubMenu>
                </Menu>
                <Menu>
                    <SubMenu label="고객센터" defaultClose>
                        <Menu menuItemStyles={subItemStyles}>
                            <MenuItem component={<Link to="/" />}> 자주하는 질문  </MenuItem>
                            <MenuItem component={<Link to="/" />}> 유실물센터 안내</MenuItem>
                        </Menu>
                    </SubMenu>
                </Menu>
                    <div className="logo-outline" />
                <div className="logo-outline" />
        </Sidebar >
    </>
  );
}

export default SideBar;