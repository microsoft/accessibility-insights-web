// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { DebugToolsTelemetryMessage } from 'debug-tools/controllers/telemetry-listener';
import { isEmpty } from 'lodash';
import * as moment from 'moment';
import { DetailsList, IColumn } from 'office-ui-fabric-react';
import * as React from 'react';

export type TelemetryMessagesListProps = {
    items: DebugToolsTelemetryMessage[];
};

export const TelemetryMessagesList = NamedFC<TelemetryMessagesListProps>(
    'TelemetryMessagesList',
    ({ items }) => {
        const columns: IColumn[] = [
            {
                key: 'date',
                name: 'date & time',
                fieldName: 'timestamp',
                isResizable: true,
                minWidth: 100,
                maxWidth: 130,
                onRender: onRenderTimestamp,
            },
            {
                key: 'eventName',
                name: 'event name',
                fieldName: 'name',
                isResizable: true,
                minWidth: 100,
                maxWidth: 130,
            },
            {
                key: 'source',
                name: 'source',
                fieldName: 'source',
                isResizable: true,
                minWidth: 100,
                maxWidth: 100,
            },
            {
                key: 'triggeredBy',
                name: 'triggeredBy',
                fieldName: 'triggeredBy',
                isResizable: true,
                minWidth: 100,
                maxWidth: 100,
            },
            {
                key: 'customProperties',
                name: 'custom properties',
                fieldName: 'customProperties',
                isResizable: true,
                minWidth: 100,
                onRender: onRenderCustomProperties.bind(null, 'customProperties'),
            },
        ];

        return <DetailsList items={items} columns={columns} />;
    },
);

export const onRenderCustomProperties = (
    propertyName: keyof DebugToolsTelemetryMessage,
    item: DebugToolsTelemetryMessage,
): JSX.Element => {
    const propertyValue = item[propertyName];

    let toRender = '-';

    if (!isEmpty(propertyValue)) {
        toRender = JSON.stringify(propertyValue);
    }

    return <span>{toRender}</span>;
};

export const onRenderTimestamp = (item: DebugToolsTelemetryMessage): JSX.Element => {
    const dateString = moment(item.timestamp).format('YYYY-MMM-DD HH:mm:ss.S');
    return <span>{dateString}</span>;
};
