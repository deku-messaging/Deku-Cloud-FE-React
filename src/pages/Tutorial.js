import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const srcset = (image, size, rows = 1, cols = 1) => {
	return {
		src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
		srcSet: `${image}?w=${size * cols}&h=${
			size * rows
		}&fit=crop&auto=format&dpr=2 2x`,
	};
};

const steps = [
	{
		label: "Create an account",
		description: `To get started, sign up for your account. This process involves
        providing some basic personal information so we can personalize
        your experience, as well as choosing a secure email and password
        to access your account.`,
		image: [
			{
				img: "./signup_page.png",
				title: "signup example image",
				cols: 4,
			},
		],
		CTA: () => (
			<Button
				href="#/signup"
				variant="outlined"
				color="primary"
				size="small"
				target={"blank"}
			>
				Sign Up Now
			</Button>
		),
	},
	{
		label: "Access your account",
		description: `Provide the email address and password that you used to create
        your account in the previous step.`,
		image: [
			{
				img: "./login_page.png",
				title: "login example image",
				cols: 4,
			},
		],
		CTA: () => (
			<Button
				href="#/login"
				variant="outlined"
				color="primary"
				size="small"
				target={"blank"}
			>
				Login Now
			</Button>
		),
	},
	{
		label: "Create a Project",
		description: `To begin publishing, you must first create a project. When
            creating the project, you will be prompted to provide a
            user-friendly name to help you easily identify it, as well as an
            optional description. Once the project is created, it will be
            assigned a unique reference that you can use when publishing
            your messages.`,
		image: [
			{
				img: "./new_project.png",
				title: "new project example image",
				cols: 2,
			},
			{
				img: "./created_project.png",
				title: "created project example image",
				cols: 2,
			},
		],
		CTA: () => (
			<Button
				href="#/projects"
				variant="outlined"
				color="primary"
				size="small"
				target={"blank"}
			>
				Create a Project
			</Button>
		),
	},

	{
		label: "Setup Twilio",
		description: `To start publishing, you need an active Deku Messaging Client.
        If you do not have one, you can set up your Twilio account by
        providing your account_sid, auth_token, and service_sid on the
        settings page.`,
		image: [
			{
				img: "./twilio_setup.png",
				title: "twilio setup example image",
				cols: 4,
			},
		],
		CTA: () => (
			<Button
				href="#/settings"
				variant="outlined"
				color="primary"
				size="small"
				target={"blank"}
			>
				Set Up Twilio
			</Button>
		),
	},
	{
		label: "Publish",
		description: `You can start publishing messages directly from the dashboard.
        If you have an active Deku Messaging Client running on a network
        carrier, any messages sent to phone numbers associated with that
        carrier will be routed to your client. However, if your Deku
        Messaging Client is not running on the network carrier
        associated with the phone number, the message will be published
        using Twilio. If you haven't set up Twilio and your Deku
        Messaging Client is not running on the network carrier
        associated with the phone number, the message will fail to send.`,
		image: [
			{
				img: "./dashboard.png",
				title: "dashboard example image",
				cols: 4,
			},
		],
		CTA: () => (
			<Button
				href="#/"
				variant="outlined"
				color="primary"
				size="small"
				target={"blank"}
			>
				Publish a message
			</Button>
		),
	},
];

const Tutorial = () => {
	const [activeStep, setActiveStep] = React.useState(0);
	const [openDialog, setOpenDialog] = React.useState(false);

	const handleClickOpen = () => {
		setOpenDialog(true);
	};

	const handleClose = () => {
		setOpenDialog(false);
	};

	const handleNext = () => {
		if (activeStep === steps.length - 1) {
			handleClickOpen();
		} else {
			setActiveStep((prevActiveStep) => prevActiveStep + 1);
		}
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const handleReset = () => {
		setActiveStep(0);
		handleClose();
	};

	return (
		<Box width={"100%"}>
			<Grid container spacing={2} p={3}>
				<Grid item xs={12} sm={6} md={4} mt={5} mx={"auto"} textAlign="justify">
					<Typography variant="h4" textAlign="center">
						Deku Messaging Cloud Dashboard Tutorial
					</Typography>

					<Grid container spacing={2}>
						<Grid item xs={12} mt={3}>
							<Typography variant="h5" mb={1}>
								What is Deku Messaging Cloud Dashboard?
							</Typography>
							<Typography variant="body1" gutterBottom>
								Deku Messaging Cloud Dashboard is an all-in-one solution for
								managing and sending messages from multiple sources. With the
								ability to connect to your Twilio account and Deku Messaging
								Client instance, you can streamline your messaging workflow and
								send messages seamlessly.
							</Typography>

							<Typography variant="body1" gutterBottom>
								The Dashboard allows you to create and manage your projects, so
								you can organize your messaging activities according to your
								needs.
							</Typography>

							<Typography variant="body1" gutterBottom>
								It logs all your activities, so you can keep track of all your
								messaging activities and get real-time updates on message
								delivery status.
							</Typography>

							<Typography variant="body1" gutterBottom>
								You can send messages directly from the dashboard. This feature
								saves you time and effort and ensures that you can send messages
								quickly and efficiently.
							</Typography>

							<Typography variant="body1" gutterBottom>
								This tutorial provides step-by-step instructions on how to get
								started using the Deku Messaging Cloud dashboard.
							</Typography>
						</Grid>
						<Stepper activeStep={activeStep} orientation="vertical">
							{steps.map((step, index) => (
								<Step key={step.label}>
									<StepLabel
										optional={
											index === steps.length - 1 ? (
												<Typography variant="caption">Last step</Typography>
											) : null
										}
									>
										{step.label}
									</StepLabel>
									<StepContent>
										<Typography>{step.description}</Typography>
										<ImageList variant="quilted" cols={4} rowHeight="auto">
											{step.image.map((item) => (
												<ImageListItem
													key={item.img}
													cols={item.cols || 1}
													rows={item.rows || 1}
												>
													<img
														{...srcset(item.img, item.rows, item.cols)}
														alt={item.title}
														loading="lazy"
													/>
												</ImageListItem>
											))}
										</ImageList>
										<step.CTA />
										<Box sx={{ mb: 2 }}>
											<div>
												<Button
													variant="contained"
													onClick={handleNext}
													sx={{ mt: 1, mr: 1 }}
												>
													{index === steps.length - 1 ? "Finish" : "Continue"}
												</Button>
												<Button
													disabled={index === 0}
													onClick={handleBack}
													sx={{ mt: 1, mr: 1 }}
												>
													Back
												</Button>
											</div>
										</Box>
									</StepContent>
								</Step>
							))}
						</Stepper>
						<Dialog
							open={openDialog}
							onClose={handleClose}
							aria-labelledby="alert-dialog-title"
							aria-describedby="alert-dialog-description"
						>
							<DialogTitle id="alert-dialog-title">
								{"🥳🥳 Congratulations!"}
							</DialogTitle>
							<DialogContent>
								<DialogContentText id="alert-dialog-description">
									{"You have completed the tutorial!"}
								</DialogContentText>
							</DialogContent>
							<DialogActions>
								<Button onClick={handleReset}>Start Over</Button>
								<Button onClick={handleClose}>Close</Button>
							</DialogActions>
						</Dialog>
					</Grid>
				</Grid>
			</Grid>
		</Box>
	);
};

export default Tutorial;
