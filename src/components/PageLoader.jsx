import Dashboard from "./Pages/Dashboard";
import Students from "./Pages/Profiles/Students";
import Alumnus from "./Pages/Profiles/Alumnus";
import Teachers from "./Pages/Profiles/Teachers";
import Admins from "./Pages/Profiles/Admins";
import SuperAdmins from "./Pages/Profiles/SuperAdmins";
import Facultys from "./Pages/Facultys/Facultys";
import Departments from "./Pages/Facultys/Departments";
import Classes from "./Pages/Facultys/Classes";
import Subjects from "./Pages/Facultys/Subjects";
import ResultSheets from "./Pages/Other/ResultSheets";


const PageLoader = ({ url }) => {

  switch (url) {
    case "dashboard":
      return (
        <div className="main-page shadow p-3 rounded w-100">
          <Dashboard />
        </div>
      );
    case "students":
      return (
        <div className="main-page shadow-top p-3 rounded w-100">
          <Students />
        </div>
      );
    case "alumnus":
      return (
        <div className="main-page shadow-top p-3 rounded w-100">
          <Alumnus />
        </div>
      );
    case "teachers":
      return (
        <div className="main-page shadow p-3 rounded w-100">
          <Teachers />
        </div>
      );
    case "admins":
      return (
        <div className="main-page shadow p-3 rounded w-100">
          <Admins />
        </div>
      );
    case "super-admins":
      return (
        <div className="main-page shadow p-3 rounded w-100">
          <SuperAdmins />
        </div>
      );
    case "facultys":
      return (
        <div className="main-page shadow p-3 rounded w-100">
          <Facultys />
        </div>
      );
    case "departments":
      return (
        <div className="main-page shadow p-3 rounded w-100">
          <Departments />
        </div>
      );
    case "classes":
      return (
        <div className="main-page shadow p-3 rounded w-100">
          <Classes />
        </div>
      );
    case "subjects":
      return (
        <div className="main-page shadow p-3 rounded w-100">
          <Subjects />
        </div>
      );
    case "result-sheets":
      return (
        <div className="main-page shadow p-3 rounded w-100">
          <ResultSheets />
        </div>
      );    

    default:
      return <div className="main-page shadow p-3 rounded w-100"></div>;

  }
};

export default PageLoader;
