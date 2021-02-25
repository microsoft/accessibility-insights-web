// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export type InjectedDialogStoreData =
    | {
          isOpen: false;
          target: null;
      }
    | {
          isOpen: true;
          target: string[]; // Corresponds to the target property of an axe result node
      };
