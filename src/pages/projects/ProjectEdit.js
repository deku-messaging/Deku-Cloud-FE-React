import React from "react";
import { useState } from "react";

import {
	Edit,
	SimpleForm,
	TextInput,
	useRecordContext,
	TopToolbar,
	DateTimeInput,
	Toolbar,
	DeleteWithConfirmButton,
	SaveButton,
} from "react-admin";
import { Box, Grid, IconButton } from "@mui/material";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import BackButton from "./../../components/backButton";

const ProjectEditActions = () => (
	<TopToolbar>
		<BackButton path={"/projects"} />
	</TopToolbar>
);

const ReferenceField = () => {
	const [copied, setCopied] = useState(false);

	const record = useRecordContext();
	if (!record) return null;

	return (
		<TextInput
			source="reference"
			InputProps={{
				endAdornment: (
					<IconButton
						onClick={() => {
							navigator.clipboard.writeText(record.reference);
							setCopied(true);
							setTimeout(() => {
								setCopied(false);
							}, 3000);
						}}
					>
						{copied ? (
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
	);
};

const ProjectEditToolbar = (props) => (
	<Toolbar {...props}>
		<SaveButton />
		<DeleteWithConfirmButton
			sx={{
				position: "absolute",
				right: "1rem",
				textAlign: "right",
			}}
		/>
	</Toolbar>
);

export const ProjectEdit = () => {
	const transform = (data) => {
		for (let key in data) {
			if (
				data.hasOwnProperty(key) &&
				key.endsWith("_at") &&
				data[key] != null
			) {
				data[key] = new Date(data[key]).toISOString();
			}
		}
		return data;
	};

	return (
		<Edit actions={<ProjectEditActions />} transform={transform}>
			<SimpleForm toolbar={<ProjectEditToolbar />}>
				<Box width={"100%"}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<TextInput source="friendly_name" fullWidth />
							<TextInput source="description" multiline fullWidth />
						</Grid>
						<Grid item xs={12} sm={6}>
							<ReferenceField />
							<DateTimeInput source="created_at" disabled fullWidth />
						</Grid>
					</Grid>
				</Box>
			</SimpleForm>
		</Edit>
	);
};
