import {
  bitable,
  FieldType,
  IFieldConfig,
  IFieldMeta,
  IOpenSingleSelect,
  ITable,
} from "@lark-base-open/js-sdk";

const DATA_KEY = {
  fields: "user_custom_fields",
};

export type Field = {
  /**
   * 默认使用name
   */
  dataKey?: string;
} & IFieldMeta;

export async function updateTableHeader(headers: Array<Field>) {
  const table = await bitable.base.getActiveTable();

  for (const header of headers) {
    await table.setField(header.id, {
      ...(header as IFieldConfig),
      name: header.name,
    });
  }
  await bitable.bridge.setData(`${DATA_KEY.fields}_${table.id}`, []);
}

export async function getFields(): Promise<Array<Field>> {
  const table = await bitable.base.getActiveTable();
  const view = await table.getActiveView();
  let fields = await view.getFieldMetaList();

  const bridge = bitable.bridge;
  const cacheFields = await bridge.getData(`${DATA_KEY.fields}_${table.id}`);
  if (Array.isArray(cacheFields)) {
    fields = fields.map((item, index) => ({
      ...item,
      ...(cacheFields[index] || {}),
    }));
  }
  return fields;
}

export async function saveFields(fields: Array<Field>) {
  const table = await bitable.base.getActiveTable();
  await bitable.bridge.setData(`${DATA_KEY.fields}_${table.id}`, fields);
}

export async function getFieldValue(
  table: ITable,
  recordId: string,
  field: any,
) {
  let value: any;

  switch (field.type) {
    case FieldType.Attachment: {
      value = await table.getCellValue(field.id, recordId);
      if (Array.isArray(value)) {
        for (const item of value) {
          item.file_token = item.token;
          item.url = await table.getAttachmentUrl(
            item.token,
            field.id,
            recordId,
          );
        }
      } else {
        value.file_token = value.token;
        value.url = await table.getAttachmentUrl(
          value.token,
          field.id,
          recordId,
        );
      }
      break;
    }
    case FieldType.MultiSelect: {
      value = await table.getCellValue(field.id, recordId);
      value = (value as IOpenSingleSelect[]).map((item) => item.text);
      break;
    }
    default:
      value = await table.getCellString(field.id, recordId);
  }
  return value;
}

export async function toJson(
  recordIds: Array<string> | true,
): Promise<Array<Record<string, any>>> {
  const table = await bitable.base.getActiveTable();

  const fieldMetas = await getFields();

  const res: Array<Record<string, any>> = [];
  if (recordIds === true) {
    recordIds = await table.getRecordIdList();
  }
  for (const recordId of recordIds) {
    const record: Record<string, any> = {};
    for (const fieldMeta of fieldMetas) {
      record[fieldMeta.dataKey || fieldMeta.name] = await getFieldValue(
        table,
        recordId,
        fieldMeta,
      );
    }
    record.larkId = recordId;
    res.push(record);
  }
  return res;
}
