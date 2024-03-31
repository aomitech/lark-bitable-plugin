import { Button, Empty, Form, Row, Space, Table } from "@douyinfe/semi-ui";
import { IFieldMeta } from "@lark-base-open/js-sdk";
import React, { useEffect, useState } from "react";
import { Scene } from "@/entity/scene.ts";
import { getFields, getScene, saveScene } from "@/services/table.ts";

export function SceneSetting() {
  const [loading, setLoading] = useState(false);

  const [fields, setFields] = useState<Array<IFieldMeta>>([]);
  const [data, setData] = useState<Array<Scene>>([]);

  const columns = [
    {
      title: "统计项",
      dataIndex: "name",
    },
    {
      title: "",
      render: (_: never, record: Scene) => {
        return (
          <Button type="danger" onClick={() => handleDelete(record.name)}>
            删除
          </Button>
        );
      },
    },
  ];

  async function init() {
    const f = await getFields();
    setFields(f.filter((item) => !item.isPrimary));
  }

  useEffect(() => {
    init();
  }, []);

  async function handleSave(value: Scene) {
    setLoading(true);
    try {
      const newData = [...data, value];
      setData(newData);
      saveScene(newData);
    } finally {
      setLoading(false);
    }
  }

  function handleDelete(name: string) {
    const newData = data.filter((item) => item.name !== name);
    setData(newData);
    saveScene(newData);
  }

  useEffect(() => {
    getScene().then(setData);
  }, []);

  return (
    <div>
      <Empty
        title="请先设置表头作为统计类目"
        description="例如统计路过汽车信息表头: 汽车品牌、汽车类型。"
      />
      <Table
        columns={columns as never}
        dataSource={data}
        pagination={false}
      ></Table>
      <Form
        labelPosition="left"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        autoScrollToError={true}
        onSubmit={handleSave}
      >
        <Row>
          <Form.Input field="name" label="统计项(使用第一列)" />
          {fields.map((field) => (
            <Form.Input
              key={field.id}
              field={field.name}
              label={{ text: field.name }}
            />
          ))}
        </Row>
        <Space
          spacing={16}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Button loading={loading} type="primary" htmlType="submit">
            添加统计项
          </Button>
        </Space>
      </Form>
    </div>
  );
}
