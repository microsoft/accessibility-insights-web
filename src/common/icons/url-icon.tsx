// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../react/named-sfc';

const d =
    'M8.82353 0C9.5579 0 10.2662 0.0963542 10.9485 0.289062C11.6308 0.476562 12.2688 0.744792 12.8626 1.09375C13.4563 1.4375 ' +
    '13.9954 1.85417 14.4798 2.34375C14.9694 2.82812 15.386 3.36719 15.7298 3.96094C16.0787 4.55469 16.347 5.19271 16.5345 5.875C16.7272 ' +
    '6.55729 16.8235 7.26562 16.8235 8C16.8235 8.73438 16.7272 9.44271 16.5345 10.125C16.347 10.8073 16.0787 11.4453 15.7298 ' +
    '12.0391C15.386 12.6328 14.9694 13.1745 14.4798 13.6641C13.9954 14.1484 13.4563 14.5651 12.8626 14.9141C12.2688 15.2578 11.6308 ' +
    '15.526 10.9485 15.7188C10.2662 15.9062 9.5579 16 8.82353 16C8.08915 16 7.38082 15.9062 6.69853 15.7188C6.01624 15.526 5.37822 ' +
    '15.2578 4.78447 14.9141C4.19072 14.5651 3.64905 14.1484 3.15947 13.6641C2.67509 13.1745 2.25843 12.6328 1.90947 12.0391C1.56572 ' +
    '11.4453 1.29749 10.8099 1.10478 10.1328C0.917279 9.45052 0.823529 8.73958 0.823529 8C0.823529 7.26562 0.917279 6.55729 1.10478 ' +
    '5.875C1.29749 5.19271 1.56572 4.55469 1.90947 3.96094C2.25843 3.36719 2.67509 2.82812 3.15947 2.34375C3.64905 1.85417 4.19072 ' +
    '1.4375 4.78447 1.09375C5.37822 0.744792 6.01363 0.476562 6.69072 0.289062C7.37301 0.0963542 8.08395 0 8.82353 0ZM15.1438 5C14.9459 ' +
    '4.57812 14.7063 4.18229 14.4251 3.8125C14.1438 3.4375 13.8313 3.09635 13.4876 2.78906C13.1438 2.48177 12.7714 2.20833 12.3704 ' +
    '1.96875C11.9694 1.72917 11.5501 1.53385 11.1126 1.38281C11.3001 1.64323 11.4694 1.91927 11.6204 2.21094C11.7714 2.5026 11.9043 ' +
    '2.80469 12.0188 3.11719C12.1386 3.42448 12.2402 3.73698 12.3235 4.05469C12.4069 4.3724 12.4798 4.6875 12.5423 5H15.1438ZM15.8235 ' +
    '8C15.8235 7.30729 15.7272 6.64062 15.5345 6H12.6985C12.7402 6.33333 12.7714 6.66667 12.7923 7C12.8131 7.32812 12.8235 7.66146 ' +
    '12.8235 8C12.8235 8.33854 12.8131 8.67448 12.7923 9.00781C12.7714 9.33594 12.7402 9.66667 12.6985 10H15.5345C15.7272 9.35938 ' +
    '15.8235 8.69271 15.8235 8ZM8.82353 15C9.07874 15 9.31572 14.9297 9.53447 14.7891C9.75843 14.6484 9.96415 14.4635 10.1517 ' +
    '14.2344C10.3392 14.0052 10.5058 13.7474 10.6517 13.4609C10.8027 13.1693 10.9355 12.875 11.0501 12.5781C11.1647 12.2812 11.261 ' +
    '11.9948 11.3392 11.7188C11.4173 11.4427 11.4772 11.2031 11.5188 11H6.12822C6.16988 11.2031 6.22978 11.4427 6.3079 11.7188C6.38603 ' +
    '11.9948 6.48238 12.2812 6.59697 12.5781C6.71155 12.875 6.84176 13.1693 6.98759 13.4609C7.13863 13.7474 7.3079 14.0052 7.4954 ' +
    '14.2344C7.6829 14.4635 7.88603 14.6484 8.10478 14.7891C8.32874 14.9297 8.56832 15 8.82353 15ZM11.6907 10C11.7324 9.66667 11.7636 ' +
    '9.33594 11.7845 9.00781C11.8105 8.67448 11.8235 8.33854 11.8235 8C11.8235 7.66146 11.8105 7.32812 11.7845 7C11.7636 6.66667 ' +
    '11.7324 6.33333 11.6907 6H5.95634C5.91468 6.33333 5.88082 6.66667 5.85478 7C5.83395 7.32812 5.82353 7.66146 5.82353 8C5.82353 ' +
    '8.33854 5.83395 8.67448 5.85478 9.00781C5.88082 9.33594 5.91468 9.66667 5.95634 10H11.6907ZM1.82353 8C1.82353 8.69271 1.91988 ' +
    '9.35938 2.11259 10H4.94853C4.90686 9.66667 4.87561 9.33594 4.85478 9.00781C4.83395 8.67448 4.82353 8.33854 4.82353 8C4.82353 ' +
    '7.66146 4.83395 7.32812 4.85478 7C4.87561 6.66667 4.90686 6.33333 4.94853 6H2.11259C1.91988 6.64062 1.82353 7.30729 1.82353 ' +
    '8ZM8.82353 1C8.56832 1 8.32874 1.07031 8.10478 1.21094C7.88603 1.35156 7.6829 1.53646 7.4954 1.76562C7.3079 1.99479 7.13863 ' +
    '2.25521 6.98759 2.54688C6.84176 2.83333 6.71155 3.125 6.59697 3.42188C6.48238 3.71875 6.38603 4.00521 6.3079 4.28125C6.22978 ' +
    '4.55729 6.16988 4.79688 6.12822 5H11.5188C11.4772 4.79688 11.4173 4.55729 11.3392 4.28125C11.261 4.00521 11.1647 3.71875 11.0501 ' +
    '3.42188C10.9355 3.125 10.8027 2.83333 10.6517 2.54688C10.5058 2.25521 10.3392 1.99479 10.1517 1.76562C9.96415 1.53646 9.75843 ' +
    '1.35156 9.53447 1.21094C9.31572 1.07031 9.07874 1 8.82353 1ZM6.53447 1.38281C6.09697 1.53385 5.6777 1.72917 5.27665 ' +
    '1.96875C4.87561 2.20833 4.50322 2.48177 4.15947 2.78906C3.81572 3.09635 3.50322 3.4375 3.22197 3.8125C2.94072 4.18229 ' +
    '2.70113 4.57812 2.50322 5H5.10478C5.16728 4.6875 5.2402 4.3724 5.32353 4.05469C5.40686 3.73698 5.50582 3.42448 5.6204 ' +
    '3.11719C5.7402 2.80469 5.87561 2.5026 6.02665 2.21094C6.1777 1.91927 6.34697 1.64323 6.53447 1.38281ZM2.50322 11C2.70113 ' +
    '11.4219 2.94072 11.8203 3.22197 12.1953C3.50322 12.5651 3.81572 12.9036 4.15947 13.2109C4.50322 13.5182 4.87561 13.7917 5.27665 ' +
    '14.0312C5.6777 14.2708 6.09697 14.4661 6.53447 14.6172C6.34697 14.3568 6.1777 14.0807 6.02665 13.7891C5.87561 13.4974 5.7402 ' +
    '13.1979 5.6204 12.8906C5.50582 12.5781 5.40686 12.263 5.32353 11.9453C5.2402 11.6276 5.16728 11.3125 5.10478 11H2.50322ZM11.1126 ' +
    '14.6172C11.5501 14.4661 11.9694 14.2708 12.3704 14.0312C12.7714 13.7917 13.1438 13.5182 13.4876 13.2109C13.8313 12.9036 14.1438 ' +
    '12.5651 14.4251 12.1953C14.7063 11.8203 14.9459 11.4219 15.1438 11H12.5423C12.4798 11.3125 12.4069 11.6276 12.3235 ' +
    '11.9453C12.2402 12.263 12.1386 12.5781 12.0188 12.8906C11.9043 13.1979 11.7714 13.4974 11.6204 13.7891C11.4694 14.0807 11.3001 ' +
    '14.3568 11.1126 14.6172Z';

export const UrlIcon = NamedSFC('UrlIcon', () => (
    <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d={d} fill="#737373" />
    </svg>
));
