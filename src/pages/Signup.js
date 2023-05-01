import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";

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
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import { blue } from "@mui/material/colors";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { MuiTelInput, matchIsValidTel } from "mui-tel-input";
import { useAuthProvider, useNotify } from "react-admin";

const validationSchema = yup.object().shape({
	email: yup.string().email().required("Please a valid email address"),
	password: yup
		.string()
		.min(8, "Password must be at least 8 characters long")
		.required("Please enter a password")
		.test(
			"lowercase-letters",
			"Password must include at least one lowercase letter",
			(value) => {
				return /[a-z]/.test(value);
			}
		)
		.test(
			"uppercase-letters",
			"Password must include at least one uppercase letter",
			(value) => {
				return /[A-Z]/.test(value);
			}
		)
		.test("numbers", "Password must include at least one number", (value) => {
			return /\d/.test(value);
		})
		.test(
			"special-characters",
			"Password must include at least one of the following special characters: !@#$%^&*()_+-=",
			(value) => {
				return /[!@#$%^&*()_+\-=]/.test(value);
			}
		)
		.test(
			"no-compromised-password",
			"Password has previously been compromised in a data breach. Use another password",
			async (value) => {
				const passwordHash = (await sha1(value)).toLocaleUpperCase();
				const prefix = passwordHash.substring(0, 5);
				const suffix = passwordHash.substring(5);
				const response = await fetch(
					`https://api.pwnedpasswords.com/range/${prefix}`
				);
				if (!response.ok) {
					return true;
				}
				const hashList = await response.text();
				const hashLines = hashList.split("\n");
				for (const line of hashLines) {
					const [hashSuffix] = line.split(":");
					if (hashSuffix === suffix) {
						return false;
					}
				}
				return true;
			}
		),
	confirm_password: yup
		.string()
		.required()
		.oneOf([yup.ref("password"), null], "Passwords must match"),
	first_name: yup.string(),
	last_name: yup.string(),
	phone_number: yup.string(),
});

const sha1 = async (input) => {
	const buffer = new TextEncoder().encode(input);
	const hashBuffer = await crypto.subtle.digest("SHA-1", buffer);
	return arrayBufferToHex(hashBuffer);
};

const arrayBufferToHex = (buffer) => {
	const byteArray = new Uint8Array(buffer);
	const hexCodes = [...byteArray].map((value) => {
		const hexCode = value.toString(16);
		const paddedHexCode = hexCode.padStart(2, "0");
		return paddedHexCode;
	});
	return hexCodes.join("");
};

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

const SignupPage = () => {
	const authProvider = useAuthProvider();
	const notify = useNotify();
	const navigate = useNavigate();

	const [loading, setLoading] = React.useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const handleShowPasswordClick = () => setShowPassword(!showPassword);

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(validationSchema),
		defaultValues: {
			phone_number: "",
		},
	});

	const onSubmit = async (data) => {
		if (!loading) {
			setLoading(true);
			await authProvider
				.signup(data)
				.then(() => {
					notify("Account created successfully", {
						type: "success",
						anchorOrigin: { vertical: "top", horizontal: "right" },
					});
					navigate("/login", { replace: true });
					return;
				})
				.catch((error) => {
					if (error.status === 409) {
						let message = `Oops! Account '${data.email}' already exist`;
						notify(message, {
							type: "warning",
							anchorOrigin: { vertical: "top", horizontal: "right" },
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
			<Grid container component="main" sx={{ height: "100vh" }}>
				<CssBaseline />
				<Grid
					item
					xs={false}
					sm={4}
					md={7}
					sx={{
						backgroundImage: "url(./undraw_sign_up_n6im.svg)",
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
							Sign Up
						</Typography>
						<Box
							component="form"
							noValidate
							onSubmit={handleSubmit(onSubmit)}
							sx={{ mt: 1 }}
						>
							<Grid container spacing={2}>
								<Grid item xs={12} md={6}>
									<TextField
										margin="normal"
										fullWidth
										label="First Name"
										key="first_name"
										disabled={loading}
										{...register("first_name")}
										error={!!errors.first_name}
										helperText={errors.first_name?.message}
									/>
								</Grid>
								<Grid item xs={12} md={6}>
									<TextField
										margin="normal"
										fullWidth
										label="Last Name"
										key="last_name"
										disabled={loading}
										{...register("last_name")}
										error={!!errors.last_name}
										helperText={errors.last_name?.message}
									/>
								</Grid>
							</Grid>
							<Controller
								name="phone_number"
								control={control}
								rules={{ validate: matchIsValidTel }}
								render={({ field, fieldState }) => (
									<MuiTelInput
										{...field}
										fullWidth
										margin="normal"
										key="phone_number"
										label="Phone Number"
										disabled={loading}
										forceCallingCode
										focusOnSelectCountry
										defaultCountry={"CM"}
										error={fieldState.invalid}
										helperText={
											fieldState.invalid ? fieldState.error.message : ""
										}
									/>
								)}
							/>
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
								label="Confirm Password"
								key="confirm_password"
								disabled={loading}
								{...register("confirm_password")}
								error={!!errors.confirm_password}
								helperText={errors.confirm_password?.message}
							/>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								disabled={loading}
								sx={{ mt: 3, mb: 2 }}
							>
								Create Account
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
								<Grid item ml={"auto"}>
									<Link href="#/login" variant="body2">
										{"Already have an account? Sign In"}
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

export default SignupPage;
