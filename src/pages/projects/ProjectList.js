import {
	Datagrid,
	List,
	TextField,
	DeleteWithConfirmButton,
	EditButton,
	DateField,
	TextInput,
	DateInput,
} from "react-admin";
import { useMediaQuery } from "@mui/material";

import MobileGrid from "./MobileGrid";

const ProjectFilters = [
	<TextInput source="friendly_name" />,
	<TextInput source="reference" />,
	<DateInput
		label="Created At"
		source="created_at"
		parse={(v) => (v ? new Date(v).toISOString() : "")}
	/>,
];

export const ProjectList = () => {
	const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));
	return (
		<List filters={ProjectFilters}>
			{isSmall ? (
				<MobileGrid action={<EditButton />} />
			) : (
				<Datagrid rowClick="edit">
					<TextField source="reference" />
					<TextField source="friendly_name" />
					<DateField source="created_at" showTime />
					<DeleteWithConfirmButton />
				</Datagrid>
			)}
		</List>
	);
};
