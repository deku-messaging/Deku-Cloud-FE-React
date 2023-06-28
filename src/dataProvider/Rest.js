import { fetchUtils } from "react-admin";
import { stringify } from "query-string";

const apiUrl = process.env.REACT_APP_API_URL;
const options = {
	credentials: "include", // include, *same-origin, omit
	headers: new Headers({
		"Accept": "application/json",
		"Content-Type": "application/json",
	}),
};
const httpClient = fetchUtils.fetchJson;

const RestProvider = {
	getList: (resource, params) => {
		const { page, perPage } = params.pagination;
		const { field, order } = params.sort;
		const query = {
			sort: JSON.stringify([field, order]),
			range: JSON.stringify([(page - 1) * perPage, page * perPage]),
			filter: JSON.stringify(params.filter),
		};
		const url = `${apiUrl}/${resource}?${stringify(query)}`;

		return httpClient(url, options).then(({ headers, json }) => ({
			data: json,
			total: parseInt(headers.get("content-range").split("/").pop(), 10),
		}));
	},

	getOne: (resource, params) =>
		httpClient(`${apiUrl}/${resource}/${params.id}`, options).then(
			({ json }) => ({
				data: json,
			})
		),

	getMany: (resource, params) => {
		const query = {
			filter: JSON.stringify({ ids: params.ids }),
		};
		const url = `${apiUrl}/${resource}?${stringify(query)}`;
		return httpClient(url, options).then(({ json }) => ({ data: json }));
	},

	getManyReference: (resource, params) => {
		const { page, perPage } = params.pagination;
		const { field, order } = params.sort;
		const query = {
			sort: JSON.stringify([field, order]),
			range: JSON.stringify([(page - 1) * perPage, page * perPage]),
			filter: JSON.stringify({
				...params.filter,
				[params.target]: params.id,
			}),
		};
		const url = `${apiUrl}/${resource}?${stringify(query)}`;

		return httpClient(url, options).then(({ headers, json }) => ({
			data: json,
			total: parseInt(headers.get("content-range").split("/").pop(), 10),
		}));
	},

	create: (resource, params) =>
		httpClient(`${apiUrl}/${resource}`, {
			method: "POST",
			body: JSON.stringify(params.data),
			...options,
		}).then(({ json }) => ({
			data: { ...params.data, id: json.id },
		})),

	update: (resource, params) =>
		httpClient(`${apiUrl}/${resource}/${params.id}`, {
			method: "PUT",
			body: JSON.stringify(params.data),
			...options,
		}).then(({ json }) => ({ data: json })),

	updateMany: (resource, params) => {
		const query = {
			filter: JSON.stringify({ id: params.ids }),
		};
		return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
			method: "PUT",
			body: JSON.stringify(params.data),
			...options,
		}).then(({ json }) => ({ data: json }));
	},

	delete: (resource, params) =>
		httpClient(`${apiUrl}/${resource}/${params.id}`, {
			method: "DELETE",
			...options,
		}).then(({ json }) => ({ data: json })),

	deleteMany: (resource, params) => {
		const query = {
			filter: JSON.stringify({ id: params.ids }),
		};
		return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
			method: "DELETE",
			body: JSON.stringify(params.data),
			...options,
		}).then(({ json }) => ({ data: json }));
	},
	customRequest: (method, url, params) => {
		if (params && params.headers) {
			params.headers = new Headers(params.headers);
		} else {
			params.headers = options.headers;
		}

		const customOptions = {
			method,
			...params,
		};

		return httpClient(`${apiUrl}/${url}`, customOptions).then(({ json }) => ({
			data: json,
		}));
	},
};

export default RestProvider;
