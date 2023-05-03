import React from "react";
import { useState, useEffect } from "react";

import {
	TextInput,
	useInput,
	useNotify,
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
} from "react-admin";
import { groupBy } from "lodash";
import { Box, Grid, Typography, CardContent, Card } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { MuiTelInput } from "mui-tel-input";

import { RestProvider } from "../../dataProvider";
import DashboardShow from "./DashboardShow";

const Dashboard = () => {
	const notify = useNotify();
	const { data: identity, isLoading: identityLoading } = useGetIdentity();
	const refresh = useRefresh();

	const validateFields = (values) => {
		const errors = {};
		if (!values.reference) {
			errors.reference = "A project is required to publish";
		}
		if (!values.service) {
			errors.service = "A service is required to publish";
		}
		if (!values.phone_number) {
			errors.message = "A phone number is required to publish";
		}
		if (!values.message) {
			errors.message = "A message is required to publish";
		}
		return errors;
	};

	const onSubmit = async (data) => {
		try {
			await RestProvider.customRequest(
				"POST",
				`projects/${data.reference}/services/${data.service}`,
				{
					headers: [
						{
							Authorization:
								"Basic " +
								btoa(identity.account_sid + ":" + identity.auth_token),
						},
					],
					body: JSON.stringify({
						to: data.phone_number,
						body: data.message,
					}),
				}
			);

			notify("Successfully sent message", {
				type: "success",
				anchorOrigin: { vertical: "top", horizontal: "right" },
			});
			refresh();
			return;
		} catch (error) {
			notify("Failed to send message. Check logs.", {
				type: "error",
				anchorOrigin: { vertical: "top", horizontal: "right" },
			});
			refresh();
			return;
		}
	};

	const SendToolbar = (props) => {
		return (
			<Toolbar {...props}>
				<SaveButton label="Send" icon={<SendIcon />} color="info" fullWidth />
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
		const { field } = useInput(props);

		return (
			<MuiTelInput
				{...field}
				margin="normal"
				defaultCountry={"CM"}
				label="Phone Number"
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
					source="message"
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
		const { data, ids } = useGetList("logs", {
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
						<PhoneNumberInput source="phone_number" />
						<MessageInput />
					</SimpleForm>
				</Grid>
			</Grid>
		</Box>
	);
};

export default Dashboard;
