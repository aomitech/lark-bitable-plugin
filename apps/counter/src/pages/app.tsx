import React, { useState } from "react";
import { Layout, Nav } from "@douyinfe/semi-ui";
import Home from "@/pages/home.tsx";
import { SceneSetting } from "@/pages/scene.tsx";

const { Header, Footer, Content } = Layout;

export default function App() {
  const navs = [
    {
      itemKey: "counter",
      text: "计数器",
      page: <Home goSceneSetting={() => handleChange({ itemKey: "scene" })} />,
    },
    {
      itemKey: "scene",
      text: "场景设置",
      page: <SceneSetting />,
    },
  ];

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
