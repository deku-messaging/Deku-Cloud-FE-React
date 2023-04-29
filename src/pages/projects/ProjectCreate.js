import React from "react";

import {
	Create,
	SimpleForm,
	TextInput,
	required,
	TopToolbar,
	useNotify,
} from "react-admin";
import { Box, Grid } from "@mui/material";

import BackButton from "./../../components/backButton";

const ProjectCreateActions = () => (
	<TopToolbar>
		<BackButton path={"/projects"} />
	</TopToolbar>
);

export const ProjectCreate = () => {
	const notify = useNotify();

	const onError = (error) => {
		if (error.status === 409) {
			notify(
				"Uh oh! It seems you've used this name before for a different project. Please choose another name",
				{ type: "warning" }
			);

			return;
		}
		notify("Oops! Something went wrong. Please again latter", {
			type: "error",
		});
	};

	return (
		<Create actions={<ProjectCreateActions />} mutationOptions={{ onError }}>
			<SimpleForm>
				<Box width={"100%"}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<TextInput
								source="friendly_name"
								validate={required()}
								fullWidth
							/>
							<TextInput source="description" multiline fullWidth />
						</Grid>
					</Grid>
				</Box>
			</SimpleForm>
		</Create>
	);
};
