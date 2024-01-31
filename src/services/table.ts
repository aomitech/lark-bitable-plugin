import {FieldType, IOpenSingleSelect, ITable} from "@lark-base-open/js-sdk";


export async function getFieldValue(table: ITable, recordId: string, field: any) {
    let value: any

    switch (field.type) {
        case FieldType.Attachment: {
            value = await table.getCellValue(field.id, recordId);
            if (Array.isArray(value)) {
                for (const item of value) {
                    item.file_token = item.token;
                    item.url = await table.getAttachmentUrl(item.token, field.id, recordId)
                }
            } else {
                value.file_token = value.token;
                value.url = await table.getAttachmentUrl(value.token, field.id, recordId)
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

export async function toJson(table: ITable, recordIds: Array<string>): Promise<Array<Record<string, any>>> {

    const fieldMetas = await table.getFieldMetaList();

    const res: Array<Record<string, any>> = [];
    for (const recordId of recordIds) {

        const record: Record<string, any> = {}
        for (const fieldMeta of fieldMetas) {
            record[fieldMeta.name] = await getFieldValue(table, recordId, fieldMeta);
        }
        record.larkId = recordId;
        res.push(record);
    }
    return res;

}