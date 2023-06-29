import { Grid } from "@mui/material";
import {
	TextField,
	useRecordContext,
	RecordContextProvider,
	Labeled,
	DateField,
} from "react-admin";

const DashboardShow = () => {
	const record = useRecordContext();
	if (!record) return null;
	return (
		<RecordContextProvider key={record.id} value={record}>
			<Grid container spacing={2}>
				<Grid item xs={12} md={6}>
					<Labeled source="id">
						<TextField source="id" />
					</Labeled>
				</Grid>
				<Grid item xs={12} md={6}>
					<Labeled source="sid">
						<TextField source="sid" />
					</Labeled>
				</Grid>
				<Grid item xs={12} md={6}>
					<Labeled source="service_id">
						<TextField source="service_id" />
					</Labeled>
				</Grid>
				<Grid item xs={12} md={6}>
					<Labeled source="status">
						<TextField source="status" />
					</Labeled>
				</Grid>
				<Grid item xs={12} md={6}>
					<Labeled source="to">
						<TextField source="to" />
					</Labeled>
				</Grid>
				<Grid item xs={12} md={6}>
					<Labeled source="from_">
						<TextField source="from_" />
					</Labeled>
				</Grid>
				<Grid item xs={12} md={6}>
					<Labeled source="channel">
						<TextField source="channel" />
					</Labeled>
				</Grid>
				<Grid item xs={12} md={6}>
					<Labeled source="service_name">
						<TextField source="service_name" />
					</Labeled>
				</Grid>
				<Grid item xs={12} md={6}>
					{" "}
					<Labeled source="project_reference">
						<TextField source="project_reference" />
					</Labeled>
				</Grid>
				<Grid item xs={12} md={6}>
					<Labeled source="direction">
						<TextField source="direction" />
					</Labeled>
				</Grid>
				<Grid item xs={12} md={6}>
					<Labeled source="reason">
						<TextField source="reason" />
					</Labeled>
				</Grid>
				<Grid item xs={12} md={6}>
					<Labeled source="created_at">
						<DateField source="created_at" showTime />
					</Labeled>
				</Grid>
			</Grid>
		</RecordContextProvider>
	);
};

export default DashboardShow;
