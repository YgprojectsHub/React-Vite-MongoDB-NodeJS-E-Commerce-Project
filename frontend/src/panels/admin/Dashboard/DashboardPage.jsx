import { Row, Col, Card, Statistic } from "antd";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { orders, statistics } from "../../../http-requests/requests";
import { formatCurrency } from "../../../helper/formatCurrency";

const DashboardPage = () => {

  const [staticsData, setStaticsData] = useState(null);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    const getStatics = async () => {
      const data = await statistics();
      const oCount = await orders()

      setStaticsData(data);
      setOrderCount(oCount.response.length);
    };
  
    getStatics()
  }, []);

  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="Toplam Ürün Satışı" value={staticsData && staticsData[1].response.additionalData.totalProductSales || 0} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Anlık Sipariş Sayısı" value={orderCount && orderCount} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Toplam Gelir" value={staticsData && formatCurrency(staticsData[1].response.additionalData.totalRevenue || 0, "TRY")} />
          </Card>
        </Col>
      </Row>
      <Card style={{ marginTop: "20px" }}>
        <h2>Yıllık Ürün Satış Sayı Grafiği</h2>
        <LineChart
          width={700}
          height={400}
          data={staticsData && staticsData[1].response.result}
          margin={{ top: 5, right: 30, bottom: 5 }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="totalSales"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </Card>
      <Card style={{ marginTop: "20px" }}>
        <h2>Yıllık Müşteri Sayı Grafiği</h2>
        <LineChart
          width={700}
          height={400}
          data={staticsData && staticsData[0].response}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#82ca9d"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </Card>
    </div>
  );
};

export default DashboardPage;