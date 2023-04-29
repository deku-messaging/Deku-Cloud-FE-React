const options = {
	credentials: "include", // include, *same-origin, omit
	headers: new Headers({
		"Accept": "application/json",
		"Content-Type": "application/json",
	}),
};

export const AuthProvider = {
	// called when the user attempts to log in
	login: ({ email, password }) => {
		const request = new Request(`${process.env.REACT_APP_API_URL}/login`, {
			method: "POST",
			body: JSON.stringify({ email, password }),
			...options,
		});
		return fetch(request)
			.then((response) => {
				if (response.status < 200 || response.status >= 300) {
					throw response;
				}

				return response.text();
			})
			.then(() => {
				const request = new Request(`${process.env.REACT_APP_API_URL}/`, {
					method: "GET",
					...options,
				});
				return fetch(request)
					.then((response) => {
						if (response.status < 200 || response.status >= 300) {
							throw response;
						}

						return response.json();
					})
					.then((user) => {
						user.fullName =
							(user.first_name || "") +
							(user.first_name && user.last_name ? " " : "") +
							(user.last_name || "");
						user = JSON.stringify(user);
						localStorage.setItem("deku-user", user);
						return Promise.resolve();
					})
					.catch((error) => {
						throw error;
					});
			})
			.catch((error) => {
				throw error;
			});
	},

	// called when the user attempts to sign up
	signup: (data) => {
		const request = new Request(`${process.env.REACT_APP_API_URL}/signup`, {
			method: "POST",
			body: JSON.stringify(data),
			...options,
		});
		return fetch(request)
			.then((response) => {
				if (response.status < 200 || response.status >= 300) {
					throw response;
				}

				return response.text();
			})
			.then(() => {
				return Promise.resolve();
			})
			.catch((error) => {
				throw error;
			});
	},

	// called when the user clicks on the logout button
	logout: () => {
		localStorage.removeItem("deku-user");
		return Promise.resolve();
	},
	// called when the API returns an error
	checkError: ({ status }) => {
		if (status === 401 || status === 403) {
			localStorage.removeItem("deku-user");
			return Promise.reject();
		}
		return Promise.resolve();
	},
	// called when the user navigates to a new location, to check for authentication
	checkAuth: () => {
		return localStorage.getItem("deku-user")
			? Promise.resolve()
			: Promise.reject();
	},
	// called when the user navigates to a new location, to check for permissions / roles
	getIdentity: () => {
		const user = localStorage.getItem("deku-user");
		return user ? Promise.resolve(JSON.parse(user)) : Promise.reject();
	},
	getPermissions: () => {
		const user = localStorage.getItem("deku-user");
		return user
			? Promise.resolve(JSON.parse(user).permission)
			: Promise.reject();
	},
};
