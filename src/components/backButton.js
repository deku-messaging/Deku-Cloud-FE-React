import Button from "@mui/material/Button";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router";

const BackButton = (props) => {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate(props.path);
	};

	return (
		<Button
			startIcon={<ArrowBack />}
			color="primary"
			onClick={handleClick}
			sx={{ marginRight: "auto" }}
		/>
	);
};

export default BackButton;
