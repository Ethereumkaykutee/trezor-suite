import React, { useCallback, useState } from 'react';
import TrezorConnect, { AccountInfo } from 'trezor-connect';
import { Button, Modal } from '@trezor/components';
import { Translation } from '@suite-components';
import { Account } from '@wallet-reducers/accountsReducer';
import { range } from '@suite-utils/array';

type Props = {
    account: Account;
    onCancel: () => void;
};

type ExportStatus = {
    isRunning: boolean;
    error?: string;
};

const ExportTransaction = ({ account, onCancel }: Props) => {
    const [status, setStatus] = useState<ExportStatus>({
        isRunning: false,
    });

    const onClose = useCallback(() => {
        // Stop export if in progress
        onCancel();
    }, [onCancel]);

    console.log(account);

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
        console.log(transactions);

        setStatus({
            isRunning: false,
        });
    }, [descriptor, symbol, isRunning, setStatus]);

    return (
        <Modal cancelable onCancel={onClose} heading={<Translation id="TR_EXPORT_TRANSACTIONS" />}>
            <Button onClick={runExport} isDisabled={isRunning}>
                Export
            </Button>
            {error && <p>{error}</p>}
        </Modal>
    );
};

export default ExportTransaction;
