/* @flow */
'use strict';

import { LOCATION_CHANGE } from 'react-router-redux';

import TrezorConnect, { DEVICE_EVENT, UI_EVENT, UI, DEVICE } from 'trezor-connect';
import * as TrezorConnectActions from '../actions/TrezorConnectActions';

let inited: boolean = false;

const TrezorConnectService = store => next => action => {
    // Pass all actions through by default
    next(action);

    if (action.type === LOCATION_CHANGE && !inited) {
        inited = true;

        TrezorConnect.init()
        .then(r => {
            // post action inited
        })
        .catch(error => {
            // TODO: show some ui with errors
            console.log("ERROR", error);
        });

        TrezorConnect.on(DEVICE_EVENT, (event: DeviceMessage): void => {
            // post event to reducer
            store.dispatch({
                type: event.type,
                device: event.data
            });
        });

        const version: Object = TrezorConnect.getVersion();

        if (version.type === 'library') {
            // handle UI events only if TrezorConnect isn't using popup
            TrezorConnect.on(UI_EVENT, (type: string, data: any): void => {
                // post event to reducer
                store.dispatch({
                    type,
                    data
                });
            });
        }

        const handleDeviceConnect = (device) => {
            store.dispatch( TrezorConnectActions.discover(device.path) );
        }

        const handleDeviceDisconnect = (device) => {
            store.dispatch( TrezorConnectActions.remove(device.path) );
        }

        TrezorConnect.on(DEVICE.CONNECT, handleDeviceConnect);
        //TrezorConnect.on(DEVICE.CONNECT_UNACQUIRED, handleDeviceConnect);

        TrezorConnect.on(DEVICE.DISCONNECT, handleDeviceDisconnect);
        //TrezorConnect.on(DEVICE.CONNECT_UNACQUIRED, handleDeviceConnect);

    }
};

export default TrezorConnectService;