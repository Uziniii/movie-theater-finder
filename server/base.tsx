import React, { type PropsWithChildren } from "react";
import { ThemeProvider } from "../src/components/theme-provider";

export function Page(props: PropsWithChildren) {
  return <>
    <head>
      <meta charSet="UTF-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <link href="/styles/global.css" rel="stylesheet"></link>
    </head>
    <body>
      <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
        {props.children}
      </ThemeProvider>
    </body>
  </>
}