import { useEffect, useState } from "react";
import Header from "../components/Layout/Header/Header";
import Footer from "../components/Layout/Footer/Footer";
import Search from "../components/Modals/Search/Search";
import Dialog from "../components/Modals/Dialog/Dialog";

const MainLayout = ({children}) => {
  const [isSearchShow, setSearchShow] = useState(false);
  const [isDialogShow, setDialogShow] = useState(false);

  useEffect(() => {
    const dialogStatus = localStorage.getItem("dialog")
      ? JSON.parse(localStorage.getItem("dialog"))
      : localStorage.setItem("dialog", JSON.stringify(true));

    setTimeout(() => {
      setDialogShow(dialogStatus);
    }, 2000);
  }, []);

  return (
    <div className="main-layout">
      <Search isSearchShow={isSearchShow} setSearchShow={setSearchShow} />
      <Dialog isDialogShow={isDialogShow} setDialogShow={setDialogShow} />
      <Header setSearchShow={setSearchShow} />
      {children}
      <Footer />
    </div>
  );
};

export default MainLayout;

