import React, { useState, useEffect, useContext, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import AuthContext from "../../context/AuthContext";
import { Line, Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";

const Dashboard = () => {
  const { authTokens, baseUrl } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [listLabels, setListLabels] = useState([]);
  const [listView, setListView] = useState([]);
  const [complaintLimit, setComplaintLimit] = useState(6);
  const [pieFilter, setPieFilter] = useState("");
  const [pieData, setPieData] = useState([]);
  const [pieLabels, setPieLabels] = useState([]);

  const [complaintAgainstFilter, setComplaintAgainstFilter] = useState("");

  const [complaints, setComplaints] = useState([]);
  const [students, setStudents] = useState([]);
  const componentRef = useRef(null);

  const headers = {
    Authorization: `Bearer ${authTokens?.access}`,
  };

  const fetchData = async () => {
    await fetch(`${baseUrl}/api/v1/complaints/`, { headers })
      .then((response) => response.json())
      .then((data) => setComplaints(data))
      .catch((error) => {
        console.error("Error:", error);
      });

    await fetch(`${baseUrl}/api/v1/students/`, { headers })
      .then((response) => response.json())
      .then((data) => setStudents(data))
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    if (loading) {
      fetchData();
      setLoading(false);
    }

    // setup for complaints - report

    let labels = [];
    let data = [];
    let months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    let datasets = [
      {
        label: "Accepted",
        data: [],
        backgroundColor: "limegreen",
        borderColor: "green",
      },
      {
        label: "Rejected",
        data: [],
        backgroundColor: "red",
        borderColor: "red",
      },
      {
        label: "Need Process",
        data: [],
        backgroundColor: "yellow",
        borderColor: "yellow",
      },
    ];

    let filteredData = [];

    switch (complaintAgainstFilter) {
      case "":
        filteredData = complaints;
        break;
      case "STUDENT":
        filteredData = complaints?.filter(
          (item) => item?.complaint_against == "STUDENT"
        );
        break;
      case "TEACHER":
        filteredData = complaints?.filter(
          (item) => item?.complaint_against == "TEACHER"
        );
        break;
      case "STAFF":
        filteredData = complaints?.filter(
          (item) => item?.complaint_against == "STAFF"
        );
        break;
    }

    let temp_data = filteredData?.reduce((result, item) => {
      let date = new Date(item?.date_created?.split("T")[0]);
      let month = months[date.getMonth() - 1];

      let year = date.getFullYear();

      const categoryExists = result.find(
        (group) => group?.year == year && group?.month == month
      );

      if (categoryExists) {
        switch (item?.status) {
          case "RECEIVED":
            categoryExists.items.received += 1;
            break;
          case "REJECTED":
            categoryExists.items.rejected += 1;
            break;
          case "ACCEPTED":
            categoryExists.items.accepted += 1;
            break;
        }
      } else {
        switch (item?.status) {
          case "RECEIVED":
            result.push({
              label: String(month + ", " + year),
              year: year,
              month: month,
              items: { received: 1, accepted: 0, rejected: 0 },
            });
            break;
          case "REJECTED":
            result.push({
              label: String(month + ", " + year),
              year: year,
              month: month,
              items: { received: 0, accepted: 0, rejected: 1 },
            });
            break;
          case "ACCEPTED":
            result.push({
              label: String(month + ", " + year),
              year: year,
              month: month,
              items: { received: 0, accepted: 1, rejected: 0 },
            });
            break;
        }
      }

      return result;
    }, []);

    temp_data?.forEach((item) => {
      datasets[0].data.push(item.items.accepted);
      datasets[1].data.push(item.items.rejected);
      datasets[2].data.push(item.items.received);

      if (!labels.includes(item?.label)) {
        labels = [item?.label, ...labels].sort().reverse();
      }
    });
    setListLabels(labels?.slice(0, complaintLimit));
    setListView(datasets);

    // setup for student's status report
    labels = [];
    data = [];

    switch (pieFilter) {
      case "alumnus":
        data = students?.filter((item) => item?.graduated == true);
        break;
      case "students":
        data = students?.filter((item) => item?.graduated == false);
        break;
      default:
        data = students;
    }

    temp_data = data?.reduce((result, item) => {
      const categoryExists = result.find(
        (group) => group?.status == item?.status
      );

      if (categoryExists) {
        categoryExists.count += 1;
      } else {
        result.push({ status: item?.status, count: 1 });
        labels.push(item?.status);
      }

      return result;
    }, []);

    data = [];
    temp_data.forEach((i) => data.push(i?.count));

    setPieData(data);
    setPieLabels(labels);
  }, [complaints, complaintLimit, students, pieFilter, complaintAgainstFilter]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div>
      <div className="text-end">
        <button
          className="btn btn-outline-primary px-5 bold"
          onClick={handlePrint}
        >
          Print
        </button>
      </div>
      <div className="m-3" ref={componentRef}>
        <div className="px-3 py-3 border-3">
          <div className="row mb-2">
            <div className="col">
              <h3 className="ps-4 my-2">Complaints</h3>
            </div>
            <div className="col-md-3">
              <select
                className="form-select ps-3 py-1 my-2"
                value={complaintAgainstFilter}
                onChange={(e) => setComplaintAgainstFilter(e.target.value)}
              >
                <option value="">Complaint Against</option>
                <option value="STUDENT">Students</option>
                <option value="TEACHER">Teachers</option>
                <option value="STAFF">Staff</option>
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select ps-3 py-1 my-2"
                value={complaintLimit}
                onChange={(e) => setComplaintLimit(e.target.value)}
              >
                <option value={3}>last 3 months</option>
                <option value={6}>last 6 months</option>
                <option value={9}>last 9 months</option>
                <option value={12}>last 1 year</option>
              </select>
            </div>
          </div>
          <Line
            data={{
              labels: listLabels,
              datasets: listView,
            }}
          />
        </div>
        <br />
        <div className=" m-3">
          <div className="row col-md-12">
            <h4 className="col-md-8 p-3 text-end">Students Status</h4>
            <div className="col-md-4">
              <select
                className="form-select ps-3 py-1 my-3"
                value={pieFilter}
                onChange={(e) => setPieFilter(e.target.value)}
              >
                <option value="">Select Filter</option>
                <option value="alumnus">Alumnus</option>
                <option value="students">Students</option>
              </select>
            </div>
          </div>
          <div className="col-md-12 row">
            <div className="col-md-2">
              <ul>
                {pieLabels?.map((label, index) => (
                  <li key={index} className="text-capitalize">
                    {pieData?.[index]} {label.toLowerCase()}
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-md-8">
              <Pie
                data={{
                  labels: pieLabels,
                  datasets: [
                    {
                      data: pieData,
                      backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "yellow",
                      ],
                    },
                  ],
                }}
                className="w-100 h-100"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
