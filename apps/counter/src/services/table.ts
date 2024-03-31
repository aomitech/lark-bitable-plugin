import { bitable, IFieldMeta, IRecordValue } from "@lark-base-open/js-sdk";
import { Key } from "@/constants/Key.ts";
import { Scene } from "@/entity/scene.ts";

let fields: Array<IFieldMeta> = [];

export async function initData() {
  fields = await getFields();
}

export async function getFields() {
  const table = await bitable.base.getActiveTable();
  const view = await table.getActiveView();
  fields = await view.getFieldMetaList();
  return fields.filter((item) => {
    return ![1001, 1002, 1003, 1004, 1005].includes(item.type);
  });
}

export async function getScene(): Promise<Array<Scene>> {
  const r = await bitable.bridge.getData<Array<Scene>>(Key.scene);
  if (Array.isArray(r)) {
    return r;
  }
  return [];
}

export async function saveScene(data: Array<unknown>) {
  await bitable.bridge.setData(Key.scene, data);
}

export async function addItem(data: Scene) {
  const table = await bitable.base.getActiveTable();

  const fs: Record<string, never> = {};
  fields.forEach((f) => {
    fs[f.id] = data[f.name] as never;
    if (f.isPrimary) {
      fs[f.id] = data.name as never;
    }
  });

  const record: IRecordValue = {
    fields: fs,
  };

  await table.addRecord(record);
}
