// promise responses
export const ERROR = 'r_error'; // exception: this could be also emitted as event (with id: -1)
export const CONNECT = 'r_connect';
export const GET_INFO = 'r_info';
export const GET_BLOCK_HASH = 'r_get_block_hash';
export const GET_ACCOUNT_INFO = 'r_account_info';
export const GET_ACCOUNT_UTXO = 'r_get_account_utxo';
export const GET_TRANSACTION = 'r_get_transaction';
export const ESTIMATE_FEE = 'r_estimate_fee';
export const SUBSCRIBE = 'r_subscribe';
export const UNSUBSCRIBE = 'r_unsubscribe';
export const PUSH_TRANSACTION = 'r_push_tx';

// emitted events
export const CONNECTED = 'r_connected';
export const DISCONNECTED = 'r_disconnected';
export const NOTIFICATION = 'r_notification';
