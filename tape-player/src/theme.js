export default {
	space: [0, 4, 8, 16, 24, 32, 64, 128, 256, 512],
	fonts: {
		body:
			'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
		heading: "inherit",
		monospace: "Menlo, monospace",
	},
	radii: [4, 8, 12, 20],
	borders: {
		light: "1px solid #eee",
		heavy: "1px solid #000",
	},
	shadows: {
		small: "0 2px 10px rgba(0,0,0,0.1)",
		medium: "0 4px 20px rgba(0,0,0,0.1)",
		large: "0 8px 30px rgba(0,0,0,0.15)",
	},
	fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 96],
	fontWeights: {
		body: 400,
		heading: 700,
		bold: 700,
	},
	lineHeights: {
		body: 1.5,
		heading: 1.125,
	},
	colors: {
		text: "#1b1f37",
		background: "#fff",
		primary: "#1043d8",
		secondary: "#3d4056",
		focus: "#bfdbf1",
		quiet: "#8d8e96",
		loud: "#ffeb71",
		accent: "#434495",
		contrast: "#9e1331",
		pale: "#7966e9",
		muted: "#e9e6fb",
		fade: "rgba(255, 255, 255, .5)",
		shade: "rgba(0,0,0,.08)",
		dull: "#ededed",
	},
	styles: {
		root: {
			fontFamily: "body",
			lineHeight: "body",
			fontWeight: "body",
		},
		h1: {
			color: "text",
			fontFamily: "heading",
			lineHeight: "heading",
			fontWeight: "heading",
			fontSize: 6,
		},
		h2: {
			color: "text",
			fontFamily: "heading",
			lineHeight: "heading",
			fontWeight: "heading",
			fontSize: 4,
		},
		h3: {
			color: "text",
			fontFamily: "heading",
			lineHeight: "heading",
			fontWeight: "heading",
			fontSize: 3,
		},
		h4: {
			color: "text",
			fontFamily: "heading",
			lineHeight: "heading",
			fontWeight: "heading",
			fontSize: 2,
		},
		h5: {
			color: "text",
			fontFamily: "heading",
			lineHeight: "heading",
			fontWeight: "heading",
			fontSize: 1,
		},
		h6: {
			color: "text",
			fontFamily: "heading",
			lineHeight: "heading",
			fontWeight: "heading",
			fontSize: 0,
		},
		hr: {
			color: "shade",
		},
		p: {
			color: "text",
			fontFamily: "body",
			fontWeight: "body",
			lineHeight: "body",
		},
		a: {
			color: "primary",
			textDecoration: "none",
		},
		pre: {
			fontFamily: "monospace",
			overflowX: "auto",
			code: {
				color: "inherit",
			},
		},
		code: {
			fontFamily: "monospace",
			fontSize: "inherit",
		},
		table: {
			width: "100%",
			borderCollapse: "separate",
			borderSpacing: 0,
		},
		th: {
			textAlign: "left",
			borderBottomStyle: "solid",
		},
		td: {
			textAlign: "left",
			borderBottomStyle: "solid",
		},
		img: {
			maxWidth: "100%",
		},
		ul: {
			listStyleType: "none",
			pl: 0,
		},
	},
	container: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "column",
		px: 3,
		py: 4,
		maxWidth: 700,
	},
	text: {
		title: {
			fontSize: 6,
			color: "background",
			fontFamily: "heading",
			fontWeight: "heading",
			lineHeight: "heading",
		},
		value: {
			fontSize: 4,
			fontWeight: "bold",
		},
		caption: {
			mt: 2,
			fontSize: 0,
			color: "secondary",
		},
		warning: {
			mt: 2,
			fontSize: 0,
			color: "contrast",
		},
	},
	buttons: {
		primary: {
			py: 2,
			px: 3,
			borderRadius: 0,
			outlineColor: "#bfdbf1",
			outlineOffset: -1,
			"&:disabled": {
				opacity: 0.5,
			},
		},
		secondary: {
			px: 3,
			py: 2,
			borderRadius: 2,
			outlineColor: "#bfdbf1",
			outlineOffset: -1,
			"&:disabled": {
				opacity: 0.5,
			},
		},
		icon: {
			px: 3,
			py: 3,
			lineHeight: 0,
			borderRadius: 2,
			transition: "all .16s",
			color: "background",
			bg: "primary",
			outlineColor: "#bfdbf1",
			outlineOffset: -1,
			outline: "none",
			"&:disabled": {
				bg: "quiet",
				opacity: 0.5,
			},
		},
	},
	cards: {
		primary: {
			width: "fit-content",
			p: 4,
			bg: "background",
			boxShadow: "large",
			borderRadius: 2,
		},
	},
	links: {
		primary: {
			fontWeight: "bold",
			textDecoration: "none",
			color: "primary",
		},
		active: {
			fontWeight: "bold",
			textDecoration: "none",
			color: "accent",
		},
	},
	forms: {
		label: {
			fontSize: 1,
			color: "secondary",
			mb: 2,
		},
		input: {
			borderColor: "secondary",
			outlineColor: "#bfdbf1",
			outlineOffset: -1,
			"&:active": {
				borderColor: "text",
			},
		},
		checkbox: {
			outlineColor: "#bfdbf1",
			outlineOffset: -1,
		},
	},
}
