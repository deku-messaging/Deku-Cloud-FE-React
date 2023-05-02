import React from "react";
import { useState, useEffect } from "react";

import {
	SimpleForm,
	TextInput,
	DateTimeInput,
	Toolbar,
	SaveButton,
	required,
	useInput,
	RecordContextProvider,
	PasswordInput,
	useNotify,
	useLogout,
} from "react-admin";
import {
	Box,
	Typography,
	IconButton,
	Divider,
	Grid,
	Dialog,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Button,
} from "@mui/material";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CloseIcon from "@mui/icons-material/Close";
import { MuiTelInput } from "mui-tel-input";

import { RestProvider } from "../dataProvider";

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

const validateCurrentPassword = async (values) => {
	const errors = {};
	if (!values.password) {
		errors.password = "Please enter your current password";
	} else {
		try {
			await RestProvider.customRequest("POST", "login", {
				body: JSON.stringify({
					email: values.email,
					password: values.password,
				}),
			});
		} catch (error) {
			errors.password = "Password is incorrect";
		}
	}
	return errors;
};

const validateNewPassword = async (values) => {
	const errors = {};
	if (!values.new_password) {
		errors.new_password = "Please enter a new password";
	} else if (values.new_password.length < 8) {
		errors.new_password = "Password must be at least 8 characters long";
	} else if (!/[a-z]/.test(values.new_password)) {
		errors.new_password = "Password must include at least one lowercase letter";
	} else if (!/[A-Z]/.test(values.new_password)) {
		errors.new_password = "Password must include at least one uppercase letter";
	} else if (!/\d/.test(values.new_password)) {
		errors.new_password = "Password must include at least one number";
	} else if (!/[!@#$%^&*()_+\-=]/.test(values.new_password)) {
		errors.new_password =
			"Password must include at least one of the following special characters: !@#$%^&*()_+-=";
	} else {
		const passwordHash = (await sha1(values.new_password)).toLocaleUpperCase();
		const prefix = passwordHash.substring(0, 5);
		const suffix = passwordHash.substring(5);
		const response = await fetch(
			`https://api.pwnedpasswords.com/range/${prefix}`
		);
		if (response.ok) {
			const hashList = await response.text();
			const hashLines = hashList.split("\n");
			for (const line of hashLines) {
				const [hashSuffix] = line.split(":");
				if (hashSuffix === suffix) {
					errors.new_password =
						"Password has previously been compromised in a data breach. Use another password";
					break;
				}
			}
		}
	}
	return errors;
};

const validateConfirmNewPassword = (values) => {
	const errors = {};
	if (values.confirm_new_password !== values.new_password) {
		errors.confirm_new_password = "Passwords must match";
	}
	return errors;
};

const validatePasswords = async (values) => {
	if (values.password || values.new_password || values.confirm_new_password) {
		return {
			...(await validateCurrentPassword(values)),
			...(await validateNewPassword(values)),
			...validateConfirmNewPassword(values),
		};
	}
};

export const Setting = () => {
	const notify = useNotify();
	const logout = useLogout();

	const [userData, setUserData] = useState(null);
	const [copied, setCopied] = useState({
		accountSid: false,
		authToken: false,
		twilioAccountSid: false,
		twilioAuthToken: false,
		twilioServiceSid: false,
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await RestProvider.customRequest("GET", "");
				setUserData(response.data);
			} catch (error) {
				if (error.status === 401 || error.status === 403) {
					return logout();
				}
				notify("Oops! Something went wrong. Please again latter", {
					type: "error",
				});
				return;
			}
		};
		fetchData();
	}, []);

	if (!userData) return null;

	const SettingToolbar = (props) => {
		return (
			<Toolbar {...props}>
				<SaveButton />
			</Toolbar>
		);
	};

	const onSubmit = async (data) => {
		try {
			if (data.hasOwnProperty("created_at") && data["created_at"] != null) {
				data["created_at"] = new Date(data["created_at"]).toISOString();
			}

			await RestProvider.customRequest("PUT", "", {
				body: JSON.stringify(data),
			});

			notify("Successfully Updated", { type: "success" });

			setTimeout(() => {
				if (data.password && data.new_password && data.confirm_new_password) {
					return logout();
				}

				window.location.reload(true);
			}, 2000);
			return;
		} catch (error) {
			notify("Oops! Something went wrong. Please again latter", {
				type: "error",
			});
			return;
		}
	};

	const DeleteUserButton = () => {
		const [open, setOpen] = React.useState(false);
		const [deleteError, setDeleteError] = React.useState("");

		const handleDelete = async (data) => {
			try {
				// console.log(data);
				await RestProvider.customRequest("DELETE", "", {
					body: JSON.stringify({
						password: data.password,
					}),
				});
				notify("Successfully Deleted", { type: "success" });
				return logout();
			} catch (error) {
				if (error.status === 401 || error.status === 403) {
					setDeleteError("Password is incorrect");
					return;
				}
				notify("Oops! Something went wrong. Please again latter", {
					type: "error",
				});
				return;
			}
		};

		const handleOpen = () => {
			setOpen(true);
		};

		const handleClose = () => {
			setOpen(false);
			setDeleteError("");
		};

		const DeleteToolbar = (props) => {
			return (
				<Toolbar {...props}>
					<SaveButton
						label="Confirm action"
						icon={<DeleteForeverIcon />}
						color="error"
						fullWidth
					/>
				</Toolbar>
			);
		};

		return (
			<>
				<Button
					variant="contained"
					color="error"
					onClick={handleOpen}
					fullWidth
				>
					Delete your account
				</Button>
				<Dialog open={open} onClose={handleClose} sx={{ textAlign: "center" }}>
					<DialogTitle>
						Are you sure?
						<IconButton
							onClick={handleClose}
							sx={{ position: "absolute", top: 8, right: 8 }}
						>
							<CloseIcon />
						</IconButton>
					</DialogTitle>
					<DialogContent>
						<DialogContentText>
							Please note that deleting your account is an irreversible action.
							To confirm, please enter your password.
						</DialogContentText>
						<SimpleForm toolbar={<DeleteToolbar />} onSubmit={handleDelete}>
							<PasswordInput
								source="password"
								validate={required()}
								error={!!deleteError}
								helperText={
									deleteError ? (
										<p style={{ color: "red" }}>{deleteError}</p>
									) : (
										""
									)
								}
								onChange={() => setDeleteError("")}
								fullWidth
							/>
						</SimpleForm>
					</DialogContent>
				</Dialog>
			</>
		);
	};

	const PhoneNumberInput = (props) => {
		const { field } = useInput(props);

		return (
			<MuiTelInput
				{...field}
				defaultCountry={"CM"}
				label="Phone Number"
				fullWidth
			/>
		);
	};

	return (
		<Box margin="0.5em">
			<RecordContextProvider key={userData.id} value={userData}>
				<SimpleForm
					toolbar={<SettingToolbar />}
					onSubmit={onSubmit}
					validate={validatePasswords}
				>
					<Box width={"100%"}>
						<Typography variant="h6">Access Keys</Typography>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<TextInput
									source="account_sid"
									InputProps={{
										endAdornment: (
											<IconButton
												onClick={() => {
													navigator.clipboard.writeText(userData.account_sid);
													setCopied((prevState) => ({
														...prevState,
														accountSid: true,
													}));
													setTimeout(() => {
														setCopied((prevState) => ({
															...prevState,
															accountSid: false,
														}));
													}, 3000);
												}}
											>
												{copied.accountSid ? (
													<CheckCircleIcon color="success" />
												) : (
													<FileCopyOutlinedIcon />
												)}
											</IconButton>
										),
									}}
									disabled
									fullWidth
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextInput
									source="auth_token"
									InputProps={{
										endAdornment: (
											<IconButton
												onClick={() => {
													navigator.clipboard.writeText(userData.auth_token);
													setCopied((prevState) => ({
														...prevState,
														authToken: true,
													}));
													setTimeout(() => {
														setCopied((prevState) => ({
															...prevState,
															authToken: false,
														}));
													}, 3000);
												}}
											>
												{copied.authToken ? (
													<CheckCircleIcon color="success" />
												) : (
													<FileCopyOutlinedIcon />
												)}
											</IconButton>
										),
									}}
									disabled
									fullWidth
								/>
							</Grid>
						</Grid>
						<Divider />
						<Typography variant="h6">Twilio Keys</Typography>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<TextInput
									source="twilio_account_sid"
									InputProps={{
										endAdornment: (
											<IconButton
												onClick={() => {
													navigator.clipboard.writeText(
														userData.twilio_account_sid
													);
													setCopied((prevState) => ({
														...prevState,
														twilioAccountSid: true,
													}));
													setTimeout(() => {
														setCopied((prevState) => ({
															...prevState,
															twilioAccountSid: false,
														}));
													}, 3000);
												}}
											>
												{copied.twilioAccountSid ? (
													<CheckCircleIcon color="success" />
												) : (
													<FileCopyOutlinedIcon />
												)}
											</IconButton>
										),
									}}
									fullWidth
								/>
								<TextInput
									source="twilio_auth_token"
									InputProps={{
										endAdornment: (
											<IconButton
												onClick={() => {
													navigator.clipboard.writeText(
														userData.twilio_auth_token
													);
													setCopied((prevState) => ({
														...prevState,
														twilioAuthToken: true,
													}));
													setTimeout(() => {
														setCopied((prevState) => ({
															...prevState,
															twilioAuthToken: false,
														}));
													}, 3000);
												}}
											>
												{copied.twilioAuthToken ? (
													<CheckCircleIcon color="success" />
												) : (
													<FileCopyOutlinedIcon />
												)}
											</IconButton>
										),
									}}
									fullWidth
								/>
								<TextInput
									source="twilio_service_sid"
									InputProps={{
										endAdornment: (
											<IconButton
												onClick={() => {
													navigator.clipboard.writeText(
														userData.twilio_service_sid
													);
													setCopied((prevState) => ({
														...prevState,
														twilioServiceSid: true,
													}));
													setTimeout(() => {
														setCopied((prevState) => ({
															...prevState,
															twilioServiceSid: false,
														}));
													}, 3000);
												}}
											>
												{copied.twilioServiceSid ? (
													<CheckCircleIcon color="success" />
												) : (
													<FileCopyOutlinedIcon />
												)}
											</IconButton>
										),
									}}
									fullWidth
								/>
							</Grid>
						</Grid>
						<Divider />
						<Typography variant="h6">Account Details</Typography>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<TextInput
									validate={required()}
									source="first_name"
									fullWidth
								/>
								<TextInput source="last_name" fullWidth />
								<PhoneNumberInput source="phone_number" />
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextInput label="ID" source="id" disabled fullWidth />
								<TextInput label="Email" source="email" disabled fullWidth />
								<DateTimeInput source="created_at" disabled fullWidth />
							</Grid>
						</Grid>
						<Divider />
						<Typography variant="h6">Update Password</Typography>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<PasswordInput source="password" fullWidth />
							</Grid>
							<Grid item xs={12} sm={6}>
								<PasswordInput source="new_password" fullWidth />
								<PasswordInput source="confirm_new_password" fullWidth />
							</Grid>
						</Grid>
						<Divider />
						<Grid container justifyContent="center" sx={{ marginTop: "50px" }}>
							<Grid item xs={12} sm={6} md={4}>
								<DeleteUserButton />
							</Grid>
						</Grid>
					</Box>
				</SimpleForm>
			</RecordContextProvider>
		</Box>
	);
};
