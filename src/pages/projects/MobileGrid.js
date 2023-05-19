import * as React from "react";
import { Box, Card, CardHeader, CardContent, Typography } from "@mui/material";
import {
	DateField,
	TextField,
	useListContext,
	RecordContextProvider,
	Labeled,
} from "react-admin";

const MobileGrid = (props) => {
	const { data, isLoading } = useListContext();
	if (isLoading || data.length === 0) {
		return null;
	}
	return (
		<Box margin="0.5em">
			{data.map((record) => (
				<RecordContextProvider key={record.id} value={record}>
					<Card sx={{ margin: "0.5rem 0" }}>
						<CardHeader
							title={<TextField source="friendly_name" variant="body1" />}
							titleTypographyProps={{ variant: "body1" }}
							action={props.action}
						/>
						<CardContent sx={{ pt: 0 }}>
							<Typography variant="body2" gutterBottom>
								<Labeled source="reference">
									<TextField source="reference" />
								</Labeled>
								<Labeled
									source="created_at"
									sx={{
										position: "absolute",
										right: "1rem",
										textAlign: "right",
									}}
								>
									<DateField source="created_at" />
								</Labeled>
							</Typography>
						</CardContent>
					</Card>
				</RecordContextProvider>
			))}
		</Box>
	);
};

MobileGrid.defaultProps = {
	data: {},
	ids: [],
};

export default MobileGrid;
