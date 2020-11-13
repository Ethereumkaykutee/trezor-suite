/* eslint-disable no-restricted-globals */
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { prepareCsv, preparePdf } from '@suite-utils/export';
import { Network } from '@wallet-types';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const ctx: Worker = self as any;

type Data = {
    coin: Network['symbol'];
    type: 'csv' | 'pdf' | 'json';
    fields: { [key: string]: string };
    content: any[];
};

interface CustomMessageEvent extends MessageEvent {
    data: Data;
}

const makePdf = (definitions: TDocumentDefinitions): Promise<Blob> =>
    new Promise(resolve => {
        pdfMake.createPdf(definitions).getBlob(blob => {
            resolve(blob);
        });
    });

const formatData = async ({ coin, type, fields, content }: Data) => {
    switch (type) {
        case 'csv': {
            const csv = prepareCsv(fields, content);
            return new Blob([csv], { type: 'text/csv;charset=utf-8' });
        }
        case 'pdf': {
            const pdfLayout = preparePdf(coin, fields, content);
            const pdf = await makePdf(pdfLayout as TDocumentDefinitions);
            return pdf;
        }
        case 'json': {
            const json = JSON.stringify({
                coin,
                data: content,
            });
            return new Blob([json], { type: 'text/json;charset=utf-8' });
        }
        // no default
    }
};

ctx.addEventListener('message', async (event: CustomMessageEvent) => {
    const result = await formatData(event.data);
    ctx.postMessage(result);
});

// // Trickery to fix TypeScript since this will be done by "worker-loader"
export default {} as typeof Worker & (new () => Worker);
