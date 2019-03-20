// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IDrawer, IDrawerInitData } from './idrawer';

export class NullDrawer implements IDrawer {
    public initialize(drawerData: IDrawerInitData<any>): void {}
    public isOverlayEnabled: boolean = false;
    public drawLayout(): void {}
    public eraseLayout(): void {}
}
