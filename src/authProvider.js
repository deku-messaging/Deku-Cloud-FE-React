const headers = {
	"Accept": "application/json",
	"Content-Type": "application/json",
};
const apiUrl = process.env.REACT_APP_API_URL;

async function getFullName(user) {
	const { first_name, last_name } = user;
	return `${first_name || ""}${first_name && last_name ? " " : ""}${
		last_name || ""
	}`;
}

export const AuthProvider = {
	async login({ email, password }) {
		const response = await fetch(`${apiUrl}/login`, {
			method: "POST",
			credentials: "include",
			headers,
			body: JSON.stringify({ email, password }),
		});

		if (response.status < 200 || response.status >= 300) {
			throw response;
		}

		const userResponse = await fetch(`${apiUrl}/`, {
			method: "GET",
			credentials: "include",
			headers,
		});

		if (userResponse.status < 200 || userResponse.status >= 300) {
			throw userResponse;
		}

		const user = await userResponse.json();
		user.fullName = await getFullName(user);
		localStorage.setItem("deku-user", JSON.stringify(user));
	},

	async signup(data) {
		const response = await fetch(`${apiUrl}/signup`, {
			method: "POST",
			credentials: "include",
			headers,
			body: JSON.stringify(data),
		});

		if (response.status < 200 || response.status >= 300) {
			throw response;
		}
	},

	logout() {
		localStorage.removeItem("deku-user");
		return Promise.resolve();
	},

	checkError({ status }) {
		if (status === 401 || status === 403) {
			localStorage.removeItem("deku-user");
			return Promise.reject();
		}

		return Promise.resolve();
	},

	checkAuth() {
		return localStorage.getItem("deku-user")
			? Promise.resolve()
			: Promise.reject();
	},

	async getIdentity() {
		const response = await fetch(`${apiUrl}/`, {
			method: "GET",
			credentials: "include",
			headers,
		});

		if (response.status < 200 || response.status >= 300) {
			throw response;
		}

		const user = await response.json();
		user.fullName = await getFullName(user);
		localStorage.setItem("deku-user", JSON.stringify(user));
		return JSON.parse(localStorage.getItem("deku-user"));
	},

	getPermissions() {
		const user = localStorage.getItem("deku-user");

		if (!user) {
			return Promise.reject();
		}

		return Promise.resolve(JSON.parse(user).permission);
	},
};
