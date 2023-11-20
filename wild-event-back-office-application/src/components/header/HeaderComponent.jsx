import {
	Box,
	AppBar,
	CssBaseline,
	Toolbar,
	Typography,
} from "@mui/material"
import DarkModeToggle from "react-dark-mode-toggle";
import { useDarkMode } from "../../components/darkMode/DarkModeProvider"
import { useUser } from "../../services/providers/LoggedUserProvider"

export const HeaderComponent = () => {
	const { darkMode, toggleDarkMode } = useDarkMode()
	const { user } = useUser()

	return (
		<Box sx={{ display: "flex" }}>
			<CssBaseline />
			<AppBar
				position='fixed'
				sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
				<Toolbar>
					<Typography variant='h6' noWrap component='div'>
						Wild Event Manager
					</Typography>
					<Typography
						variant='h6'
						sx={{
							flexGrow: 1,
							textAlign: "center",
							textTransform: "uppercase",
						}}>
						{user.name}
					</Typography>
						<DarkModeToggle 
						size={50}
						checked={darkMode === true}
						onChange={toggleDarkMode}
						/>
				</Toolbar>
			</AppBar>
		</Box>
	)
}
