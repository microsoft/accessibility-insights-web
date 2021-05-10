// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Drawer, DrawerInitData } from './drawer';

export class NullDrawer implements Drawer {
    public initialize(drawerData: DrawerInitData<any>): void {}
    public isOverlayEnabled: boolean = false;
    public drawLayout = async (): Promise<void> => {};
    public eraseLayout(): void {}
}
