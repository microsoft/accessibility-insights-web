// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ElementHandle, JSHandle, Page } from 'playwright';

// Hopefully this file becomes obsolete in the future. See:
// https://github.com/microsoft/playwright/issues/3047
// https://github.com/microsoft/playwright/issues/2752
// https://github.com/microsoft/playwright/issues/1732

export type WaitForSelectorOptions = Parameters<Page['waitForSelector']>[1];

export type NoHandles<Arg> = Arg extends JSHandle
    ? never
    : Arg extends object
      ? { [Key in keyof Arg]: NoHandles<Arg[Key]> }
      : Arg;
export type Unboxed<Arg> = Arg extends ElementHandle<infer T1>
    ? T1
    : Arg extends JSHandle<infer T2>
      ? T2
      : Arg extends NoHandles<Arg>
        ? Arg
        : Arg extends [infer A0]
          ? [Unboxed<A0>]
          : Arg extends [infer B0, infer B1]
            ? [Unboxed<B0>, Unboxed<B1>]
            : Arg extends [infer C0, infer C1, infer C2]
              ? [Unboxed<C0>, Unboxed<C1>, Unboxed<C2>]
              : Arg extends [infer D0, infer D1, infer D2, infer D3]
                ? [Unboxed<D0>, Unboxed<D1>, Unboxed<D2>, Unboxed<D3>]
                : Arg extends Array<infer T3>
                  ? Array<Unboxed<T3>>
                  : Arg extends object
                    ? { [Key in keyof Arg]: Unboxed<Arg[Key]> }
                    : Arg;
export type PageFunction<Arg, R> = string | ((arg: Unboxed<Arg>) => R | Promise<R>);
export type PageFunctionOn<On, Arg2, R> =
    | string
    | ((on: On, arg2: Unboxed<Arg2>) => R | Promise<R>);
