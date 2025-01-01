import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation, useNavigate } from "react-router";
import { backendUrl, frontendUrl } from "../config/constants";
import "../styles/question2/Question2Share.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  PointElement,
  LineElement,
  zoomPlugin
);

export default function Question2Share() {
  const urlRef = useRef<HTMLSpanElement>(null);
  const [fetchedData, setFetchedData] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [filteredData, setFilteredData] = useState<any>(null);
  const [filter, setFilter] = useState<any>({
    age: "15-25",
    gender: "Male",
    startDate: "4/10/2022",
    endDate: "28/10/2022",
  });
  const [lineChartData, setLineChartData] = useState<any>(null);
  const [featureName, setFeatureName] = useState("A");
  const [showUrl, setShowUrl] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const initialFilters = getFiltersFromURL();
    if (initialFilters)
      localStorage.setItem("initialFilters", JSON.stringify(initialFilters));

    const tokenString = localStorage.getItem("token");
    if (tokenString) {
      const token = JSON.parse(tokenString);
      checkAuth(token);
    } else {
      console.warn("No token found, redirecting to sign-in");
      navigate("/question2/signin");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!fetchedData || !filter.startDate || !filter.endDate) return;
    updateData(fetchedData, featureName);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  function getFiltersFromURL() {
    const query = location.search;
    if (!query) return null;

    const filters = query.slice(1).split("&");
    const formattedFilters = filters.reduce((total: any, currValue: any) => {
      let [key, value] = currValue.split("=");
      if (value[0] === "%") value = `>${value.slice(3)}`;
      total[key] = value;
      return total;
    }, {});
    return formattedFilters;
  }

  async function checkAuth(token: string) {
    try {
      const res = await fetch(backendUrl + "/question2/checkauth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (res.ok) {
        fetch(backendUrl + "/getData")
          .then((response) => response.json())
          .then((resData: { values: Array<any> }) => {
            setFetchedData(resData);

            const localStorageFilters = localStorage.getItem("initialFilters");
            if (localStorageFilters) {
              const initialFilters = JSON.parse(localStorageFilters);
              localStorage.removeItem("initialFilters");
              setFilter(initialFilters);
            } else {
              updateData(resData);
            }
          });
      } else {
        const error = await res.json();
        console.error("Frontend check auth error:", error);
        navigate("/question2/signin");
      }
    } catch (error) {
      console.error("Frontend check auth error:", error);
      navigate("/question2/signin");
    }
  }

  const formatDate = (dateString: any) => {
    const [day, month, year] = dateString.split("/").map(Number);
    return new Date(year, month - 1, day); // Month is zero-based
  };

  const updateData = (data: any, feature = "A") => {
    const features = data.values[0].slice(3);
    const filteredData = data.values.slice(1).filter((row: any) => {
      const rowDate = formatDate(row[0]); // Convert day string to Date object
      const startDate = formatDate(filter.startDate);
      const endDate = formatDate(filter.endDate);

      return (
        row[1] === filter.age &&
        row[2] === filter.gender &&
        rowDate >= startDate &&
        rowDate <= endDate
      );
    });
    const timeSpent = new Array(features.length).fill(0);
    filteredData.slice(1).forEach((row: any) => {
      for (let i = 3; i <= 8; i++) {
        timeSpent[i - 3] += parseInt(row[i], 10); // Sum values for each feature A-F
      }
    });

    if (features) {
      const datacontent = {
        labels: features,
        datasets: [
          {
            label: "Time Spent",
            data: timeSpent,
            borderColor: "rgba(255, 99, 133, 0)",
            backgroundColor: features.map((item: any) => {
              return item === feature
                ? "rgb(252, 100, 100)"
                : "rgb(84, 148, 250)";
            }),
          },
        ],
      };
      setData(datacontent);
      setFilteredData(filteredData);
    }

    setFeatureName(feature);
    const featureIndex = features.findIndex((item: any) => item === feature);
    updateLineChart(featureIndex, filteredData);
  };

  const options = {
    indexAxis: "y" as const,
    maintainAspectRatio: true,
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Features vs Time Spent Analysis",
      },
    },
    scales: {
      x: {
        min: 0, // Set the minimum value for the x-axis
        max: 15000, // Set the maximum value for the x-axis
        title: {
          display: true,
          text: "Time Spent",
        },
      },
      y: {
        title: {
          display: true,
          text: "Features",
        },
      },
    },
    onClick: (events: any, activeElements: any) => {
      if (activeElements.length > 0) {
        const feature = fetchedData.values[0][activeElements[0].index + 3];
        updateData(fetchedData, feature);
        // setFeatureName(fetchedData.values[0][activeElements[0].index + 3]);
        // updateLineChart(activeElements[0].index);
      }
    },
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      title: {
        display: true,
        text: `Time Spent on ${featureName} vs Days Analysis`,
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "x" as "x", // Allow panning in the x-direction
        },
        zoom: {
          wheel: {
            enabled: true, // Enable zooming with the mouse wheel
          },
          pinch: {
            enabled: true, // Enable zooming by pinching on touch devices
          },
          mode: "x" as "x", // Allow zooming in the x-direction
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Days",
        },
      },
      y: {
        title: {
          display: true,
          text: `Time Spent on ${featureName}`,
        },
      },
    },
  };

  function updateLineChart(index: number, data = filteredData) {
    const timesArrayForIndexFeature = data.map((row: any) => row[index + 3]);
    const days = data.map((row: any) => row[0]);
    const formattedDays = days.map((item: any) => {
      const [day, month, year] = item.split("/");
      const date = new Date(`${year}-${month}-${day}`);
      return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(date);
    });
    const lineChartData = {
      labels: formattedDays,
      datasets: [
        {
          label: "Time Spent",
          data: timesArrayForIndexFeature,
          borderColor: "rgb(84, 148, 250)",
          backgroundColor: "rgb(84, 148, 250)",
        },
      ],
    };
    setLineChartData(lineChartData);
  }

  return (
    <section className="container">
      <section className="buttons">
        <div className="filters">
          <span style={{ fontSize: "13px" }}>Filter By: </span>
          <fieldset
            style={{
              display: "flex",
              background: "white",
              height: "25px",
              alignItems: "center",
            }}
          >
            <legend>Age</legend>
            <select
              name="age"
              id="age"
              onChange={(e) =>
                setFilter((prev: any) => ({ ...prev, age: e.target.value }))
              }
              value={filter.age}
              style={{
                border: "none",
                background: "transparent",
                fontFamily: "Quicksand",
                fontSize: "12px",
              }}
            >
              <option value="15-25">15-25</option>
              <option value=">25">{">25"}</option>
            </select>
          </fieldset>
          <fieldset
            style={{
              display: "flex",
              background: "white",
              height: "25px",
              alignItems: "center",
            }}
          >
            <legend>Gender</legend>
            <select
              value={filter.gender}
              name="gender"
              id="gender"
              onChange={(e) =>
                setFilter((prev: any) => ({ ...prev, gender: e.target.value }))
              }
              style={{
                border: "none",
                background: "transparent",
                fontFamily: "Quicksand",
                fontSize: "12px",
              }}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </fieldset>

          <fieldset
            style={{
              display: "flex",
              background: "white",
              height: "25px",
              alignItems: "center",
            }}
          >
            <legend>Date Range</legend>
            <DatePicker
              selected={
                filter.startDate
                  ? formatDate(filter.startDate)
                  : filter.startDate
              }
              onChange={(dates) => {
                const [start, end] = dates;

                setFilter({
                  ...filter,
                  startDate: start ? start.toLocaleDateString("en-GB") : start,
                  endDate: end ? end.toLocaleDateString("en-GB") : end,
                });
              }}
              startDate={
                filter.startDate
                  ? formatDate(filter.startDate)
                  : filter.startDate
              }
              endDate={
                filter.endDate ? formatDate(filter.endDate) : filter.endDate
              }
              selectsRange
              isClearable
              placeholderText="Select a date range"
              dateFormat="d/M/yyyy"
              customInput={
                <input
                  style={{
                    width: "160px",
                    padding: "8px",
                    border: "none",
                    background: "transparent",
                    fontFamily: "Quicksand",
                    fontSize: "12px",
                    outline: "none",
                  }}
                />
              }
            />
          </fieldset>
        </div>
        <div
          style={{
            position: "relative",
            height: "fit-content",
            width: "max-content",
          }}
        >
          <button
            onClick={() => setShowUrl(!showUrl)}
            style={{
              fontFamily: "Quicksand",
              fontSize: "13px",
              background: "var(--accent)",
              color: "white",
              border: "none",
              padding: "10px",
              borderRadius: "5px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Share Charts
          </button>
          {showUrl && (
            <div
              style={{
                position: "absolute",
                top: "50px",
                right: "0px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                background: "white",
                padding: "10px",
                borderRadius: "5px",
                zIndex: "4",
              }}
            >
              <span
                ref={urlRef}
                style={{
                  background: "whitesmoke",
                  padding: "2px 5px",
                  borderRadius: "2px",
                }}
              >
                {frontendUrl}/question2/share?age={filter.age}&gender=
                {filter.gender}&startDate={filter.startDate}&endDate=
                {filter.endDate}
              </span>
              <SnackbarProvider
                hideIconVariant
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
              />
              <button
                style={{
                  fontFamily: "Quicksand",
                  fontSize: "12px",
                  border: "1px solid var(--accent)",
                  borderRadius: "2px",
                  padding: "5px",
                  backgroundColor: "white",
                  color: "var(--accent)",
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (urlRef.current) {
                    navigator.clipboard
                      .writeText(urlRef.current.textContent || "")
                      .then(() => {
                        enqueueSnackbar("URL copied to clipboard!", {
                          variant: "success",
                        });
                      })
                      .catch((err) => {
                        console.error("Failed to copy URL: ", err);
                      });
                  }
                }}
              >
                Copy URL
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="charts">
        <div style={{ flex: 1 }} className="bar-chart">
          {data && <Bar options={options} data={data} />}
        </div>
        <div style={{ flex: 1 }} className="line-chart">
          {lineChartData && (
            <Line options={lineChartOptions} data={lineChartData} />
          )}
        </div>
      </section>
    </section>
  );
}
