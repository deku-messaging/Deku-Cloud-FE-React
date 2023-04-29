import { defaultTheme, AppBar, ToggleThemeButton } from "react-admin";
import { createTheme, Box, Typography } from "@mui/material";

const darkTheme = createTheme({
	palette: { mode: "dark" },
});

const CustomAppBar = (props) => (
	<AppBar {...props}>
		<Box flex="1">
			<Typography variant="h6" id="react-admin-title"></Typography>
		</Box>
		<ToggleThemeButton lightTheme={defaultTheme} darkTheme={darkTheme} />
	</AppBar>
);

export default CustomAppBar;
