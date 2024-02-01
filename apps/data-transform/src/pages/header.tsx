import React, { createRef, useEffect, useState } from "react";
import {
  Field,
  getFields,
  saveFields,
  updateTableHeader,
} from "@/services/table.ts";
import {
  ArrayField,
  Button,
  Form,
  Row,
  Space,
  Typography,
} from "@douyinfe/semi-ui";

export default function TableHeader() {
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState<Array<Field>>([]);
  const formRef = createRef<Form>();

  useEffect(() => {
    getFields().then((f) => {
      setFields(f);
      formRef.current?.formApi.setValue(
        "fields",
        f.map((item) => ({ dataKey: item.dataKey ?? item.name })),
      );
    });
  }, []);

  async function handleSave(value: any) {
    setLoading(true);
    try {
      const data = value.fields;
      const newFields = fields.map((item, index) => ({
        ...item,
        dataKey: data[index]?.dataKey,
      }));
      await saveFields(newFields);
    } finally {
      setLoading(false);
    }
  }

  async function handleApply2table() {
    setLoading(true);
    try {
      const data = formRef.current?.formApi.getValue("fields");
      const newFields = fields.map((item, index) => ({
        ...item,
        name: data[index]?.dataKey,
      }));
      await updateTableHeader(newFields);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form
      ref={formRef}
      labelPosition="left"
      labelAlign="right"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      onSubmit={handleSave}
    >
      <Typography.Text strong style={{ flexBasis: "100%" }}>
        设置表头信息,用户数据转换时的标识
      </Typography.Text>
      <ArrayField field="fields">
        {({ arrayFields }) => (
          <Row>
            {arrayFields.map(({ field }, index) => (
              <Form.Input
                key={`${field}[dataKey]`}
                field={`${field}[dataKey]`}
                label={fields[index]?.name}
              />
            ))}
          </Row>
        )}
      </ArrayField>
      <Space spacing={16} style={{ display: "flex", justifyContent: "center" }}>
        <Button loading={loading} type="primary" htmlType="submit">
          保存设置
        </Button>
        <Button loading={loading} onClick={handleApply2table}>
          同步到表头
        </Button>
      </Space>
    </Form>
  );
}
