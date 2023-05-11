import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { useLogin, useNotify } from "react-admin";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
	Link,
	Paper,
	Typography,
	Box,
	Grid,
	Avatar,
	Button,
	CssBaseline,
	TextField,
	IconButton,
	AppBar,
	Toolbar,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import { blue } from "@mui/material/colors";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const validationSchema = yup.object().shape({
	email: yup.string().email().required("Please enter your email"),
	password: yup.string().required("Please enter your password"),
});

const Copyright = (props) => {
	return (
		<Typography
			variant="body2"
			color="text.secondary"
			align="center"
			{...props}
		>
			{"Copyright © "}
			<Link color="inherit" href="#">
				Deku
			</Link>{" "}
			{new Date().getFullYear()}
			{"."}
		</Typography>
	);
};

const theme = createTheme();

const LoginPage = () => {
	const notify = useNotify();

	const [loading, setLoading] = React.useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const handleShowPasswordClick = () => setShowPassword(!showPassword);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(validationSchema),
	});

	const login = useLogin();
	const onSubmit = async (data) => {
		if (!loading) {
			setLoading(true);

			await login(data)
				.catch((error) => {
					if (error.status === 401 || error.status === 403) {
						let message = "Ahh! Wrong Username or Password";
						notify(message, {
							type: "warning",
							anchorOrigin: { vertical: "top", horizontal: "right" },
						});
						reset({
							password: "",
						});
						return;
					}

					let message = "Oops! Something went wrong. Please try again latter";
					notify(message, {
						type: "error",
						anchorOrigin: { vertical: "top", horizontal: "right" },
					});
					return;
				})
				.finally(() => setLoading(false));
		}
	};

	return (
		<ThemeProvider theme={theme}>
			<AppBar position="static">
				<Toolbar>
					<Grid container spacing={2} justifyContent="space-between">
						<Grid item sx={{ display: "flex" }}>
							<Avatar sx={{ m: 1, backgroundColor: "inherit" }}>
								<img src="./favicon-32x32.png" alt="Logo" />
							</Avatar>
						</Grid>
						<Grid item sx={{ display: "flex" }}>
							<Button href="#/tutorial" color="inherit" size="medium">
								Tutorial
							</Button>
						</Grid>
						<Grid item sx={{ display: "flex" }}>
							<Button href="#/signup" color="inherit" size="medium">
								Sign Up
							</Button>
						</Grid>
					</Grid>
				</Toolbar>
			</AppBar>
			<Grid container component="main" sx={{ height: "100vh" }}>
				<CssBaseline />
				<Grid
					item
					xs={false}
					sm={4}
					md={7}
					sx={{
						backgroundImage: "url(./undraw_login_re_4vu2.svg)",
						backgroundRepeat: "no-repeat",
						backgroundColor: (t) =>
							t.palette.mode === "light"
								? t.palette.grey[50]
								: t.palette.grey[900],
						backgroundSize: "contain",
						backgroundPosition: "center",
					}}
				/>
				<Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
					<Box
						sx={{
							my: 8,
							mx: 4,
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
						}}
					>
						<Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
							<LockOutlinedIcon />
						</Avatar>
						<Typography component="h1" variant="h5">
							Sign in
						</Typography>
						<Box
							component="form"
							noValidate
							onSubmit={handleSubmit(onSubmit)}
							sx={{ mt: 1 }}
						>
							<TextField
								margin="normal"
								required
								fullWidth
								label="Email Address"
								key="email"
								disabled={loading}
								{...register("email")}
								error={!!errors.email}
								helperText={errors.email?.message}
							/>
							<TextField
								margin="normal"
								required
								fullWidth
								InputProps={{
									endAdornment: (
										<IconButton
											disabled={loading}
											onClick={handleShowPasswordClick}
										>
											{showPassword ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									),
								}}
								type={showPassword ? "text" : "password"}
								label="Password"
								key="password"
								disabled={loading}
								{...register("password")}
								error={!!errors.password}
								helperText={errors.password?.message}
							/>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								disabled={loading}
								sx={{ mt: 3, mb: 2 }}
							>
								Sign In
								{loading && (
									<CircularProgress
										size={24}
										sx={{
											color: { blue },
											position: "absolute",
											top: "50%",
											left: "50%",
											marginTop: "-12px",
											marginLeft: "-12px",
										}}
									/>
								)}
							</Button>
							<Grid container>
								<Grid item xs></Grid>
								<Grid item>
									<Link href="#/signup" variant="body2">
										{"Don't have an account? Sign Up"}
									</Link>
								</Grid>
							</Grid>
							<Copyright sx={{ mt: 5 }} />
						</Box>
					</Box>
				</Grid>
			</Grid>
		</ThemeProvider>
	);
};

export default LoginPage;
