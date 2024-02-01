import React, { useState } from "react";
import { Layout, Nav } from "@douyinfe/semi-ui";
import Home from "@/pages/home.tsx";
import TableHeader from "@/pages/header.tsx";

const { Header, Footer, Content } = Layout;
const navs = [
  {
    itemKey: "data_transform",
    text: "数据转换",
    page: <Home />,
  },
  {
    itemKey: "table_header",
    text: "表头设置",
    page: <TableHeader />,
  },
];
export default function App() {
  const [children, setChildren] = useState<any>(navs[0]?.page);

  function handleChange({ itemKey }: any) {
    setChildren(navs.find((nav) => nav.itemKey === itemKey)?.page);
  }

  return (
    <Layout>
      <Header>
        <Nav
          items={navs}
          mode="horizontal"
          defaultSelectedKeys={["data_transform"]}
          onClick={handleChange}
        ></Nav>
      </Header>
      <Content>{children}</Content>
    </Layout>
  );
}
