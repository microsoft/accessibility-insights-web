// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export class WindowUtils {
    public postMessage(win: Window, data: any, targetOrigin: string): void {
        win.postMessage(JSON.stringify(data), targetOrigin);
    }

    public addEventListener(
        win: Window,
        command: string,
        callback: (e: MessageEvent) => void,
        useCapture: boolean,
    ): void {
        win.addEventListener(command, callback, useCapture);
    }

    public removeEventListener(
        win: Window,
        command: string,
        callback: (e: MessageEvent) => void,
        useCapture: boolean,
    ): void {
        win.removeEventListener(command, callback);
    }

    public setTimeout(handler: Function, timeout: number): number {
        return window.setTimeout(handler, timeout);
    }

    public setInterval(handler: Function, timeout: number): number {
        return window.setInterval(handler, timeout);
    }

    public createObjectURL(sourceObject: Blob | File | MediaSource): string {
        return window.URL.createObjectURL(sourceObject);
    }

    public clearTimeout(timeout: number): void {
        window.clearTimeout(timeout);
    }

    public clearInterval(timeInterval: number): void {
        window.clearInterval(timeInterval);
    }

    public getComputedStyle(elt: Element, pseudoElt?: string): CSSStyleDeclaration {
        return window.getComputedStyle(elt, pseudoElt);
    }

    public getTopWindow(): Window {
        return window.top;
    }

    public getWindow(): Window {
        return window;
    }

    public isTopWindow(): boolean {
        return this.getTopWindow() === this.getWindow();
    }

    public getParentWindow(): Window {
        return window.parent;
    }

    public closeWindow(): void {
        window.close();
    }

    public getPlatform(): string {
        return window.navigator.platform;
    }

    public isSecureOrigin(): boolean {
        return window.isSecureContext;
    }

    public getRandomValueArray(length: number): Uint8Array {
        return window.crypto.getRandomValues(new Uint8Array(length));
    }
}
