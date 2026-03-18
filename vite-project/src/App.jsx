import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import { format } from "date-fns";

function App() {

  const [history, setHistory] = useState([]);
  const [price, setPrice] = useState(null);

  const grams = 31.103;

  const fetchData = async () => {

    try {

      const res = await fetch(
        "https://corsproxy.io/?https://query1.finance.yahoo.com/v8/finance/chart/GC=F?range=1mo&interval=1d"
      );

      const data = await res.json();

      const timestamps =
        data.chart.result[0].timestamp;

      const closes =
        data.chart.result[0].indicators.quote[0].close;

      const inrRes = await fetch(
        "https://corsproxy.io/?https://query1.finance.yahoo.com/v8/finance/chart/INR=X?range=1mo&interval=1d"
      );

      const inrData = await inrRes.json();

      const rates =
        inrData.chart.result[0].indicators.quote[0].close;

      let arr = [];

      for (let i = 0; i < timestamps.length; i++) {

        if (!closes[i] || !rates[i]) continue;

        let gram =
          (closes[i] * rates[i]) / grams;

        arr.push({
          date: format(new Date(timestamps[i] * 1000), "dd MMM"),
          price: gram
        });

      }

      setHistory(arr);
      setPrice(arr[arr.length - 1].price);

    } catch (e) {
      console.log(e);
    }

  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ padding: 40 }}>

      <h1>Bullion Market</h1>

      {price && (
        <h2>
          Gold Price ₹{price.toFixed(2)} / gram
        </h2>
      )}

      <div style={{ width: "100%", height: 400 }}>

        <ResponsiveContainer>

          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line dataKey="price" stroke="gold" />
          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default App;