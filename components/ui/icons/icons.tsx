import * as React from "react";

import {IconSvgProps} from "@/types";

export const Logo: React.FC<IconSvgProps> = ({
                                               size = 36,
                                               width,
                                               height,
                                               ...props
                                             }) => (
  <svg
    height={size || height}
    viewBox="0 0 256 256"
    width={size || width}
    {...props}
  >
    <path
      d="M0 84C1 38 38 1 84 1V0H0v84z"
      fill="none"
      fillOpacity="0"
      strokeOpacity="0"
      strokeWidth="0.3"
    />
    <path
      d="M84 1c4 0 9 1 12-1H84v1z"
      fill="none"
      fillOpacity="0"
      stroke="#0F1E2F"
      strokeOpacity="0.6"
      strokeWidth="0.3"
    />
    <path
      d="M84 1C38 1 1 38 0 84v2c2 3 2 8 0 11v75c0 45 38 83 83 84h78c3-2 8-1 12-1 45 0 81-36 83-80V84c-1-45-37-83-82-83-4 0-10 1-13-1H96c-3 2-8 1-12 1m-5 89c6-10 7-31 21-36 15-4 21 23 28 30 7-9 14-34 30-31s14 29 24 37c5-16 8-27 17-42 8-16 38-10 30 8s-8 29-14 46-9 30-12 48-10 28-12 47c-2 20-15 26-35 25H96c-19 0-26-13-30-30l-13-46-13-47c-4-17-11-27-15-45s27-19 35-5 14 26 19 41z"
      fill="none"
      fillOpacity="0"
      stroke="#0F1E2F"
      strokeWidth="0.3"
    />
    <path
      d="M174 1V0h-13c3 2 9 1 13 1z"
      fill="none"
      fillOpacity="0"
      stroke="#0F1E2F"
      strokeOpacity="0.5"
      strokeWidth="0.3"
    />
    <path
      d="M174 1c45 0 81 38 82 83V0h-82v1z"
      fill="none"
      fillOpacity="0"
      strokeOpacity="0"
      strokeWidth="0.3"
    />
    <path
      d="M79 90c-5-15-11-27-19-41s-39-13-35 5 11 28 15 45l13 47 13 46c4 17 11 30 30 30h60c20 1 33-5 35-25 2-19 9-29 12-47s6-31 12-48 6-28 14-46-22-24-30-8c-9 15-12 26-17 42-10-8-8-34-24-37s-23 22-30 31c-7-7-13-34-28-30-14 5-15 26-21 36m141-44c5 3-2 16-4 21l-7 22-7 23-7 22-7 23-6 23c-3 7-3 15-11 19s-19-2-16-11 4-14 9-21l8-21 6-24c2-8 3-16 6-23l8-22 8-21c3-7 12-14 20-10m-104 69c4 5 9 11 11 17 5-3 5-12 11-15 7 16 9 31 16 48 6 17-12 32-27 36-14 5-39 16-44-3l-15-49-15-50c-5-17-11-33-15-50 18-9 24 18 29 29s4 14 8 23l8 24 7 24c2 7 6 21 12 15s4-16 7-24c4-7 4-17 7-25z"
      fill="none"
      fillOpacity="0"
      stroke="#EFF8F8"
      strokeWidth="0.3"
    />
    <path
      d="M220 46c-8-4-17 3-20 10l-8 21-8 22c-3 7-4 15-6 23l-6 24-8 21c-5 7-6 12-9 21s8 15 16 11 8-12 11-19l6-23 7-23 7-22 7-23 7-22c2-5 9-18 4-21zm-104 69c-3 8-3 18-7 25-3 8-1 18-7 24s-10-8-12-15l-7-24-8-24c-4-9-3-12-8-23S56 40 38 49c4 17 10 33 15 50l15 50 15 49c5 19 30 8 44 3 15-4 33-19 27-36-7-17-9-32-16-48-6 3-6 12-11 15-2-6-7-12-11-17z"
      fill="none"
      fillOpacity="0"
      stroke="#0F1E2F"
      strokeWidth="0.3"
    />
    <path
      d="M0 97c2-3 2-8 0-11v11z"
      fill="none"
      fillOpacity="0"
      stroke="#0F1E2F"
      strokeOpacity="0.8"
      strokeWidth="0.3"
    />
    <path
      d="M0 256h83c-45-1-83-39-83-84v84zm173-1v1h83v-81c-2 44-38 80-83 80z"
      fill="none"
      fillOpacity="0"
      strokeOpacity="0"
      strokeWidth="0.3"
    />
    <path
      d="M161 256h12v-1c-4 0-9-1-12 1z"
      fill="none"
      fillOpacity="0"
      stroke="#0F1E2F"
      strokeOpacity="0.6"
      strokeWidth="0.3"
    />
    <path
      d="M0 84C1 38 38 1 84 1V0H0v84z"
      fill="none"
      fillOpacity="0"
      stroke="None"
    />
    <path
      d="M84 1c4 0 9 1 12-1H84v1z"
      fill="#0F1E2F"
      fillOpacity="0.6"
      stroke="None"
    />
    <path
      d="M84 1C38 1 1 38 0 84v2c2 3 2 8 0 11v75c0 45 38 83 83 84h78c3-2 8-1 12-1 45 0 81-36 83-80V84c-1-45-37-83-82-83-4 0-10 1-13-1H96c-3 2-8 1-12 1m-5 89c6-10 7-31 21-36 15-4 21 23 28 30 7-9 14-34 30-31s14 29 24 37c5-16 8-27 17-42 8-16 38-10 30 8s-8 29-14 46-9 30-12 48-10 28-12 47c-2 20-15 26-35 25H96c-19 0-26-13-30-30l-13-46-13-47c-4-17-11-27-15-45s27-19 35-5 14 26 19 41z"
      fill="#0F1E2F"
      stroke="None"
    />
    <path
      d="M174 1V0h-13c3 2 9 1 13 1z"
      fill="#0F1E2F"
      fillOpacity="0.5"
      stroke="None"
    />
    <path
      d="M174 1c45 0 81 38 82 83V0h-82v1z"
      fill="none"
      fillOpacity="0"
      stroke="None"
    />
    <path
      d="M79 90c-5-15-11-27-19-41s-39-13-35 5 11 28 15 45l13 47 13 46c4 17 11 30 30 30h60c20 1 33-5 35-25 2-19 9-29 12-47s6-31 12-48 6-28 14-46-22-24-30-8c-9 15-12 26-17 42-10-8-8-34-24-37s-23 22-30 31c-7-7-13-34-28-30-14 5-15 26-21 36m141-44c5 3-2 16-4 21l-7 22-7 23-7 22-7 23-6 23c-3 7-3 15-11 19s-19-2-16-11 4-14 9-21l8-21 6-24c2-8 3-16 6-23l8-22 8-21c3-7 12-14 20-10m-104 69c4 5 9 11 11 17 5-3 5-12 11-15 7 16 9 31 16 48 6 17-12 32-27 36-14 5-39 16-44-3l-15-49-15-50c-5-17-11-33-15-50 18-9 24 18 29 29s4 14 8 23l8 24 7 24c2 7 6 21 12 15s4-16 7-24c4-7 4-17 7-25z"
      fill="#EFF8F8"
      stroke="None"
    />
    <path
      d="M220 46c-8-4-17 3-20 10l-8 21-8 22c-3 7-4 15-6 23l-6 24-8 21c-5 7-6 12-9 21s8 15 16 11 8-12 11-19l6-23 7-23 7-22 7-23 7-22c2-5 9-18 4-21zm-104 69c-3 8-3 18-7 25-3 8-1 18-7 24s-10-8-12-15l-7-24-8-24c-4-9-3-12-8-23S56 40 38 49c4 17 10 33 15 50l15 50 15 49c5 19 30 8 44 3 15-4 33-19 27-36-7-17-9-32-16-48-6 3-6 12-11 15-2-6-7-12-11-17z"
      fill="#0F1E2F"
      stroke="None"
    />
    <path
      d="M0 97c2-3 2-8 0-11v11z"
      fill="#0F1E2F"
      fillOpacity="0.8"
      stroke="None"
    />
    <path
      d="M0 256h83c-45-1-83-39-83-84v84zm173-1v1h83v-81c-2 44-38 80-83 80z"
      fill="none"
      fillOpacity="0"
      stroke="None"
    />
    <path
      d="M161 256h12v-1c-4 0-9-1-12 1z"
      fill="#0F1E2F"
      fillOpacity="0.6"
      stroke="None"
    />
  </svg>
);

export const DiscordIcon: React.FC<IconSvgProps> = ({
                                                      size = 24,
                                                      width,
                                                      height,
                                                      ...props
                                                    }) => {
  return (
    <svg
      height={size || height}
      viewBox="0 0 24 24"
      width={size || width}
      {...props}
    >
      <path
        d="M14.82 4.26a10.14 10.14 0 0 0-.53 1.1 14.66 14.66 0 0 0-4.58 0 10.14 10.14 0 0 0-.53-1.1 16 16 0 0 0-4.13 1.3 17.33 17.33 0 0 0-3 11.59 16.6 16.6 0 0 0 5.07 2.59A12.89 12.89 0 0 0 8.23 18a9.65 9.65 0 0 1-1.71-.83 3.39 3.39 0 0 0 .42-.33 11.66 11.66 0 0 0 10.12 0q.21.18.42.33a10.84 10.84 0 0 1-1.71.84 12.41 12.41 0 0 0 1.08 1.78 16.44 16.44 0 0 0 5.06-2.59 17.22 17.22 0 0 0-3-11.59 16.09 16.09 0 0 0-4.09-1.35zM8.68 14.81a1.94 1.94 0 0 1-1.8-2 1.93 1.93 0 0 1 1.8-2 1.93 1.93 0 0 1 1.8 2 1.93 1.93 0 0 1-1.8 2zm6.64 0a1.94 1.94 0 0 1-1.8-2 1.93 1.93 0 0 1 1.8-2 1.92 1.92 0 0 1 1.8 2 1.92 1.92 0 0 1-1.8 2z"
        fill="currentColor"
      />
    </svg>
  );
};

export const GithubIcon: React.FC<IconSvgProps> = ({
                                                     size = 24,
                                                     width,
                                                     height,
                                                     ...props
                                                   }) => {
  return (
    <svg
      height={size || height}
      viewBox="0 0 24 24"
      width={size || width}
      {...props}
    >
      <path
        clipRule="evenodd"
        d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const MoonFilledIcon = ({
                                 size = 24,
                                 width,
                                 height,
                                 ...props
                               }: IconSvgProps) => (
  <svg
    aria-hidden="true"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <path
      d="M21.53 15.93c-.16-.27-.61-.69-1.73-.49a8.46 8.46 0 01-1.88.13 8.409 8.409 0 01-5.91-2.82 8.068 8.068 0 01-1.44-8.66c.44-1.01.13-1.54-.09-1.76s-.77-.55-1.83-.11a10.318 10.318 0 00-6.32 10.21 10.475 10.475 0 007.04 8.99 10 10 0 002.89.55c.16.01.32.02.48.02a10.5 10.5 0 008.47-4.27c.67-.93.49-1.519.32-1.79z"
      fill="currentColor"
    />
  </svg>
);

export const SunFilledIcon = ({
                                size = 24,
                                width,
                                height,
                                ...props
                              }: IconSvgProps) => (
  <svg
    aria-hidden="true"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <g fill="currentColor">
      <path d="M19 12a7 7 0 11-7-7 7 7 0 017 7z"/>
      <path
        d="M12 22.96a.969.969 0 01-1-.96v-.08a1 1 0 012 0 1.038 1.038 0 01-1 1.04zm7.14-2.82a1.024 1.024 0 01-.71-.29l-.13-.13a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.984.984 0 01-.7.29zm-14.28 0a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a1 1 0 01-.7.29zM22 13h-.08a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zM2.08 13H2a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zm16.93-7.01a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a.984.984 0 01-.7.29zm-14.02 0a1.024 1.024 0 01-.71-.29l-.13-.14a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.97.97 0 01-.7.3zM12 3.04a.969.969 0 01-1-.96V2a1 1 0 012 0 1.038 1.038 0 01-1 1.04z"/>
    </g>
  </svg>
);

export const LogoutIcon: React.FC<IconSvgProps> = (props) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path
      d="M5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path
      d="M16 17L21 12L16 7"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path
      d="M21 12H9"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);
