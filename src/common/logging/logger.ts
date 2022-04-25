// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export type Logger = {
    log: (message?: any, ...optionalParams: any[]) => void;

    // If you are logging an Error object, the recommended pattern is
    //
    //   logger.error(`Some ${context} about where the error is being detected: `, theErrorObject);
    //
    // Providing the error object as an optionalParam produces better console output (particularly,
    // a better stack location link) than embedding the error in the message with techniques like
    // `${error}`, `${error.stack}`, or `${JSON.stringify(error)}`
    error: (message?: any, ...optionalParams: any[]) => void;
};
