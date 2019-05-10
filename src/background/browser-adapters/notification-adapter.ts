// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NotificationOptions } from './notification-options';
export type NotificationAdapter = {
    createNotification(options: NotificationOptions): void;
};
