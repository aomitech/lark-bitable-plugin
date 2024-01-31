'use client';

import {bitable, ITable} from '@lark-base-open/js-sdk';
import {toJson} from "@/services/table";
import {useState} from "react";
import {Button, ButtonGroup, Col, Divider, Empty, Form, Row, Select} from '@douyinfe/semi-ui';

const {Option} = Form.Select;

export default function Home() {

    const [config, setConfig] = useState({})
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string>('')


    async function handleToJson(all = false): Promise<[ITable | undefined, Record<string, any>]> {
        const {tableId, viewId} = await bitable.base.getSelection();
        if (!tableId || !viewId) {
            return [undefined, {}];
        }
        const table = await bitable.base.getActiveTable();
        let recordIdList = []
        if (all) {
            recordIdList = await table.getRecordIdList()
        } else {
            recordIdList = await bitable.ui.selectRecordIdList(tableId, viewId);
        }

        return [table, await toJson(table, recordIdList)];
    }

    async function handleToJsonFile(t: any, values: any) {
        const blob = new Blob([JSON.stringify(values)], {type: "application/json"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${t?.id}.json`;
        a.click();
    }

    async function handleTransform(all: boolean) {

        setLoading(true)
        const {type, format}: Record<string, any> = config
        const [t, values] = await handleToJson(all);
        if (!t) {
            return
        }
        if (type === 'file') {
            await handleToJsonFile(t, values)
        } else {
            setResult(JSON.stringify(values, null, 2))
        }
        setLoading(false)

    }

    async function handleTransformSelect() {
        await handleTransform(false)
    }
    async function handleTransformAll() {
        await handleTransform(true)
    }

    return (
        <main className="min-h-screen">
            <Form layout='vertical' onValueChange={setConfig}
                  labelWidth={120}
                  autoScrollToError={true}
            >
                <Form.Select field="format" label={{text: '转换格式'}} style={{width: '100%'}}>
                    <Option value="json">JSON</Option>
                </Form.Select>
                <Form.Select field="type" label={{text: '结果处理方式'}} style={{width: '100%'}}>
                    <Option value="str">预览</Option>
                    <Option value="file">文件</Option>
                </Form.Select>
                <Button loading={loading} type='primary' onClick={handleTransformSelect}>{'选择转换'}</Button>
                <Button loading={loading} type='primary' onClick={handleTransformAll}>{'全部转换'}</Button>
            </Form>
            <Divider/>
            <pre>{result}</pre>
        </main>
    )
}
