import React from "react";
import { useState, useEffect } from "react";

import {
	TextInput,
	useInput,
	useGetIdentity,
	SimpleForm,
	List,
	Datagrid,
	TextField,
	DateField,
	DeleteWithConfirmButton,
	useGetList,
	Toolbar,
	SaveButton,
	ReferenceInput,
	SelectInput,
	useRefresh,
	SimpleFormIterator,
	ArrayInput,
	FileInput,
	FileField,
} from "react-admin";
import { groupBy } from "lodash";
import {
	Button,
	Box,
	Grid,
	Typography,
	CardContent,
	Card,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AddIcon from "@mui/icons-material/Add";
import { MuiTelInput } from "mui-tel-input";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { RestProvider } from "../../dataProvider";
import DashboardShow from "./DashboardShow";

const Dashboard = () => {
	const notify = (message, type) => {
		toast[type](message);
	};

	const { data: identity } = useGetIdentity();
	const refresh = useRefresh();

	const validateFields = (values) => {
		const errors = {};
		if (!values.reference) {
			errors.reference = "A project is required to publish";
		}
		if (!values.service) {
			errors.service = "A service is required to publish";
		}
		if (!values.csv && (!values.messages || values.messages.length === 0)) {
			errors.messages =
				"Either a file or at least one message is required to publish";
			errors.csv =
				"Either a file or at least one message is required to publish";
		}
		if (values.csv && !values.csv.src) {
			errors.csv = "Invalid file source";
		}
		if (values.csv && values.csv.rawFile.type !== "text/csv") {
			errors.csv = "Invalid file format. Only CSV files are allowed";
		}
		if (values.messages && values.messages.length > 0) {
			const messageErrors = [];
			values.messages.forEach((message, index) => {
				const messageError = {};
				if (!message.phone_number) {
					messageError.phone_number = "A phone number is required";
				}
				if (!message.message) {
					messageError.message = "A message is required";
				}
				messageErrors[index] = messageError;
			});
			if (messageErrors.length > 0) {
				errors.messages = messageErrors;
			}
		}
		return errors;
	};

	const onSubmit = async (data) => {
		// Check if CSV file is present
		if (data.csv && data.csv.src) {
			try {
				let formData = new FormData();
				formData.append("file", data.csv.rawFile);

				const response = await RestProvider.customRequest(
					"POST",
					`projects/${data.reference}/services/${data.service}`,
					{
						headers: {
							Authorization:
								"Basic " +
								btoa(identity.account_sid + ":" + identity.auth_token),
						},

						body: formData,
					}
				);

				let result = response.data;

				if (result.message) {
					notify(result.message, "success");
				}

				if (result.errors.length > 0) {
					result.errors.forEach((item) => {
						notify(item, "error");
					});
				}

				refresh();
			} catch (error) {
				notify("Failed to upload CSV file. Check logs.", "error");
				refresh();
			}
		}

		// Check if messages array is present
		if (data.messages && data.messages.length > 0) {
			try {
				const response = await RestProvider.customRequest(
					"POST",
					`projects/${data.reference}/services/${data.service}`,
					{
						headers: {
							"Authorization":
								"Basic " +
								btoa(identity.account_sid + ":" + identity.auth_token),
							"Accept": "application/json",
							"Content-Type": "application/json",
						},

						body: JSON.stringify(
							data.messages.map(({ phone_number, message }) => {
								return {
									to: phone_number,
									body: message,
								};
							})
						),
					}
				);

				let result = response.data;

				if (result.message) {
					notify(result.message, "success");
				}

				if (result.errors.length > 0) {
					result.errors.forEach((item) => {
						notify(item, "error");
					});
				}

				refresh();
			} catch (error) {
				notify("Failed to send message. Check logs.", "error");
				refresh();
			}
		}

		return;
	};

	const SendToolbar = (props) => {
		return (
			<Toolbar {...props}>
				<SaveButton
					label="Send"
					icon={<SendIcon />}
					color="primary"
					fullWidth
				/>
			</Toolbar>
		);
	};

	const ProjectsInput = () => (
		<ReferenceInput reference="projects" source="reference">
			<SelectInput
				label="Project"
				source="reference"
				fullWidth
				optionText="friendly_name"
				optionValue="reference"
			/>
		</ReferenceInput>
	);

	const PhoneNumberInput = (props) => {
		const {
			field,
			fieldState: { isTouched, invalid, error },
			formState: { isSubmitted },
		} = useInput(props);

		return (
			<MuiTelInput
				{...field}
				margin="normal"
				defaultCountry={"CM"}
				label="Phone Number"
				error={(isTouched || isSubmitted) && invalid}
				helperText={
					(isTouched || isSubmitted) && invalid ? error.message.message : ""
				}
				fullWidth
			/>
		);
	};

	const MessageInput = (props) => {
		const [message, setMessage] = useState("");
		const handleInputChange = (event) => setMessage(event.target.value);

		return (
			<>
				<TextInput
					{...props}
					multiline
					fullWidth
					inputProps={{ style: { minHeight: 200 } }}
					onChange={handleInputChange}
				/>
				<div>{message.length} characters</div>
			</>
		);
	};

	const Logs = () => {
		const [logs, setLogs] = useState([]);
		const { data } = useGetList("logs", {
			perPage: 1000,
			sort: { field: "created_at", order: "DESC" },
		});

		useEffect(() => {
			if (data) {
				setLogs(data);
			}
		}, [data]);

		const groupedLogs = groupBy(logs, "status");
		const statusCounts = Object.keys(groupedLogs).map((status) => ({
			status,
			count: groupedLogs[status].length,
		}));

		return (
			<Grid container spacing={2} sx={{ marginTop: 2 }}>
				<Grid item xs={12}>
					<Grid container spacing={2}>
						{statusCounts.map((statusCount) => (
							<Grid item key={statusCount.status} xs={12} sm={6} md={4} lg={3}>
								<Card>
									<CardContent>
										<Typography variant="h6" component="h2">
											{statusCount.status.toUpperCase()}
										</Typography>
										<Typography color="textSecondary">
											{statusCount.count}
										</Typography>
									</CardContent>
								</Card>
							</Grid>
						))}
					</Grid>
				</Grid>

				<Grid item xs={12}>
					<List
						sort={{ field: "created_at", order: "DESC" }}
						resource="logs"
						title={"Dashboard"}
					>
						<Datagrid
							rowClick="expand"
							expand={<DashboardShow />}
							expandSingle
							sx={{
								"& .column-service_id": {
									display: { xs: "none", md: "table-cell" },
								},
								"& .column-from_": {
									display: { xs: "none", md: "table-cell" },
								},
								"& .column-created_at": {
									display: { xs: "none", md: "table-cell" },
								},
							}}
						>
							<TextField source="service_id" />
							<TextField source="to" />
							<TextField source="from_" />
							<TextField source="status" />
							<DateField source="created_at" showTime />
							<DeleteWithConfirmButton redirect={"/"} />
						</Datagrid>
					</List>
				</Grid>
			</Grid>
		);
	};

	return (
		<Box margin="0.5em">
			<Grid container spacing={2}>
				<ToastContainer
					position="top-center"
					autoClose={30000}
					hideProgressBar={false}
					closeOnClick={true}
					pauseOnHover={true}
					progress={undefined}
					style={{ width: "80%", marginTop: "60px" }}
				/>

				<Grid item xs={12} sm={8}>
					<Logs resource={"logs"} />
				</Grid>

				<Grid item xs={12} sm={4}>
					<SimpleForm
						toolbar={<SendToolbar />}
						onSubmit={onSubmit}
						validate={validateFields}
					>
						<Typography variant="p">Publish a message</Typography>
						<ProjectsInput />
						<SelectInput
							source="service"
							choices={[
								{ id: "sms", name: "SMS" },
								{ id: "notification", name: "Notification" },
							]}
							fullWidth
						/>
						<FileInput source="csv" accept=".csv" label="File">
							<FileField source="src" title="title" />
						</FileInput>
						<ArrayInput source="messages">
							<SimpleFormIterator
								addButton={
									<Button
										variant="contained"
										color="primary"
										startIcon={<AddIcon />}
									>
										Add Message
									</Button>
								}
								inline
							>
								<PhoneNumberInput source="phone_number" />
								<MessageInput source="message" />
							</SimpleFormIterator>
						</ArrayInput>
					</SimpleForm>
				</Grid>
			</Grid>
		</Box>
	);
};

export default Dashboard;
