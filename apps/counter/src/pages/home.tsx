import React, { useEffect, useState } from "react";
import { Scene } from "@/entity/scene.ts";
import { Button, Col, Empty, List, Row } from "@douyinfe/semi-ui";
import { IllustrationNoResult } from "@douyinfe/semi-illustrations";
import { addItem, getScene, initData } from "@/services/table.ts";

export default function Home({
  goSceneSetting,
}: {
  goSceneSetting: () => void;
}) {
  const [scenes, setScenes] = useState<Array<Scene>>([]);

  useEffect(() => {
    initData();
    getScene().then(setScenes);
  }, []);

  return (
    <main className="min-h-screen">
      <List
        dataSource={scenes}
        renderItem={(item) => (
          <List.Item
            align="center"
            style={{}}
            header={<div>{item.name}</div>}
            main={
              <Button
                type="primary"
                size="large"
                onClick={() => addItem(item)}
                block
              >
                添加 +1
              </Button>
            }
          />
        )}
      />

      {scenes.length === 0 && (
        <Empty
          image={<IllustrationNoResult style={{ width: 150, height: 150 }} />}
          title={"没有统计场景"}
          description="请先设置统计场景"
        >
          <Button onClick={goSceneSetting}>立即添加统计场景</Button>
        </Empty>
      )}
    </main>
  );
}
