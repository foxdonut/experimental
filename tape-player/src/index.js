import React from "react"
import ReactDOM from "react-dom"
import { ThemeProvider, BaseStyles } from "theme-ui"

import theme from "./theme"
import App from "./App"

function WithTheme(props) {
	return (
		<ThemeProvider theme={theme}>
			<BaseStyles>{props.children}</BaseStyles>
		</ThemeProvider>
	)
}

const rootElement = document.getElementById("root")
ReactDOM.render(
	<WithTheme>
		<App />
	</WithTheme>,
	rootElement
)
