import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import Cookies from "js-cookie";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const BarChartOne = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/order/getOrderByStatus`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const jsonData = await response.json();
      setData(jsonData.data); // Assuming data is in the format { count: number, labels: string[], count: number[] }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const deliveredOrders =
    data?.filter((order) => order.status === "Delivered") || [];
  const deliveredPercentage =
    data && data.length > 0
      ? ((deliveredOrders.length / data.length) * 100).toFixed(2)
      : 0;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      const myChartRef = chartRef.current.getContext("2d");

      const barColors = [
        "rgb(0, 101, 193)",
        "rgb(0, 101, 193)",
        "rgb(0, 101, 193)",
        "rgb(0, 101, 193)",
        "rgb(0, 101, 193)",
      ];

      chartInstance.current = new Chart(myChartRef, {
        type: "bar",
        data: {
          labels: data.labels,
          datasets: [
            {
              label: "Data",
              data: data.count,
              backgroundColor: barColors,
              barPercentage: 0.2,
              borderRadius: 10,
            },
          ],
        },
      });
    }
  }, [data]);

  return (
    <div className="BarChartOne01">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">
          Total Orders
          <br />
          <Typography paragraph style={{ fontWeight: "800" }}>
            {data && data.length}
            {/*    <span
              style={{
                color: "green",
                fontSize: "12px",
                fontWeight: "200",
              }}
            >
              <ArrowUpwardIcon sx={{ fontSize: "12px" }} />
              {data && data.length > 0 && `+${deliveredPercentage}%`}
            </span> */}
          </Typography>
        </Typography>
      </Box>
      <canvas ref={chartRef} />
    </div>
  );
};

export default BarChartOne;
