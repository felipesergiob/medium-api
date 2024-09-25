import * as yup from "yup";

const schema = {
	create: {
		body: yup
			.object({
				title: yup.string().required(),
				content: yup.string().required(),
			})
			.noUnknown(),
	},
	list: {
		query: yup
			.object({
				page: yup.number().default(1),
			})
			.noUnknown(),
	},
	get: {
		params: yup
			.object({
				id: yup.number().required(),
			})
			.noUnknown(),
	},
	find: {
		params: yup
			.object({
				id: yup.number().required(),
			})
			.noUnknown(),
	},
	remove: {
		params: yup
			.object({
				id: yup.number().required(),
			})
			.noUnknown(),
	},
	like: {
		body: yup
			.object({
				post_id: yup.number().required(),
			})
			.noUnknown(),
	},  
	dislike: {
		body: yup
			.object({
				post_id: yup.number().required(),
			})
			.noUnknown(),
	},  
};

export default {
	get: schema.get,
	like: schema.like,
	dislike: schema.dislike,
	find: schema.find,
	list: schema.list,
	remove: schema.remove,
	create: schema.create,
	update: {
		params: schema.find.params,
		body: schema.create.body,
	},
};
