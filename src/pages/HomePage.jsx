import { useState, useContext } from "react";
import Sidebar from "../components/SideBar";
import Header from "../components/Header";
import PageLoader from "../components/PageLoader";
import AuthContext from "../context/AuthContext";

import "bootstrap/dist/css/bootstrap.min.css";
import "./homePage.css";

const HomePage = () => {
  const {user} =useContext(AuthContext);

  const [breadCrumb, setBreadCrumb] = useState(["Dashboard"]);
  const [pageTitle, setPageTitle] = useState("Dashboard");
  const [url, setUrl] = useState(['ADMIN', 'SUPER_ADMIN'].includes(user?.profile_type) ? "dashboard": "");

  const loadPage = ({ data }) => {
    setUrl(data?.url);
    setBreadCrumb(data?.breadCrumb);
    setPageTitle(data?.pageTitle);
  };

  return (
    <>
      <Header />
      <Sidebar changePage={loadPage} />
      <div className="pagetitle">
        <h1>{pageTitle}</h1>
        <nav>
          <ol className="breadcrumb">
            {breadCrumb.map((item, index) => {
              return (
                <li
                  key={index}
                  className={`breadcrumb-item ${
                    index + 1 == breadCrumb.length && "active"
                  }`}
                >
                  {item}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
      <PageLoader url={url} />
    </>
  );
};

export default HomePage;
