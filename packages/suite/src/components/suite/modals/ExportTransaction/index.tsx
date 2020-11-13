import React, { useCallback, useState } from 'react';
import { saveAs } from 'file-saver';
import TrezorConnect, { AccountInfo } from 'trezor-connect';
import { Button, Modal, Select } from '@trezor/components';
import { Translation } from '@suite-components';
import { Account } from '@wallet-reducers/accountsReducer';
import { range } from '@suite-utils/array';
// eslint-disable-next-line import/no-webpack-loader-syntax
import ExportWorker from 'worker-loader?filename=static/[hash].worker.js!../../../../workers/export.worker';

type Props = {
    account: Account;
    onCancel: () => void;
};

type ExportParams = {
    type: 'csv' | 'pdf' | 'json';
};

type ExportStatus = {
    isRunning: boolean;
    error?: string;
};

const exportTypes = [
    { value: 'csv', label: 'Export as CSV', },
    { value: 'pdf', label: 'Export as PDF', },
    { value: 'json', label: 'Export as JSON', },
];

const ExportTransaction = ({ account, onCancel }: Props) => {
    const [params, setParams] = useState<ExportParams>({
        type: 'csv',
    });
    const [status, setStatus] = useState<ExportStatus>({
        isRunning: false,
    });

    const onClose = useCallback(() => {
        // Stop export if in progress
        onCancel();
    }, [onCancel]);

    const { symbol, descriptor } = account;
    const { isRunning, error } = status;

    const runExport = useCallback(async () => {
        if (isRunning) {
            return;
        }

        setStatus({
            isRunning: true,
            error: undefined,
        });

        const result = await TrezorConnect.getAccountInfo({
            descriptor,
            coin: symbol,
            details: 'txs',
        });

        if (!result.success) {
            setStatus({
                isRunning: false,
                error: '',
            });
            return;
        }

        const { history, page } = result.payload;
        const transactions = history.transactions ?? [];
        if (page && page.total > 1) {
            // TODO: Make this sequential (for tracking progress and cancellation)
            const pages = range(2, page.total);
            const promises = pages.map(p =>
                TrezorConnect.getAccountInfo({
                    descriptor,
                    coin: symbol,
                    details: 'txs',
                    page: p,
                }),
            );
            const results = await Promise.all(promises);
            results.forEach(r => {
                if (r.success && r.payload.history.transactions) {
                    transactions.push(...r.payload.history.transactions);
                }
            });
        }

        // Generate CSV or PDF
        const fields = {
            datetime: 'Date & Time',
            type: 'Type',
            txid: 'Transaction ID',
            amount: 'Amount',
            fee: 'Fee',
        };
        const content = transactions.map(t => ({
            ...t,
            datetime: t.blockTime, // TODO: Format
        }));

        const worker = new ExportWorker();
        worker.postMessage({
            coin: symbol,
            type: params.type,
            fields,
            content,
        });

        const handleMessage = (event: MessageEvent) => {
            saveAs(event.data, `suite-export-${+new Date()}.${params.type}`);

            setStatus({
                isRunning: false,
            });
        };

        worker.addEventListener('message', handleMessage);
        return () => {
            worker.removeEventListener('message', handleMessage);
        };
    }, [isRunning, descriptor, symbol, params.type]);

    const onTypeChange = useCallback(
        options => {
            setParams({
                ...params,
                type: options.value,
            });
        },
        [params, setParams],
    );

    return (
        <Modal cancelable onCancel={onClose} heading={<Translation id="TR_EXPORT_TRANSACTIONS" />}>
            <Select
                isSearchable={false}
                value={exportTypes.find(t => t.value === params.type)}
                options={exportTypes}
                onChange={onTypeChange}
            />
            <Button onClick={runExport} isDisabled={isRunning}>
                Export
            </Button>
            {error && <p>{error}</p>}
        </Modal>
    );
};

export default ExportTransaction;
