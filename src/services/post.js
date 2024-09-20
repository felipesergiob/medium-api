import { Post, PostLike, User } from "../models/index";
import { PaginationUtils } from "../utils";

class PostService {
	create(post) {
		return Post.create(post);
	}

    read (filter) {
		const scopes = [];
		if (filter.logged_user_id) {
			scopes.push({
				name: "withUserLike",
				options: filter.logged_user_id,
			});
		}

		return Post.scope(scopes).findOne({
			where: {
				id: filter.id,
				is_deleted: false, 
			},
			raw: false,
			attributes: [
				"id",
				"user_id",
				"title",
				"content",
				"total_likes",
				"created_at",
			],
			include: [
				{
					model: User,
					as: "user",
					attributes: ["email", "name"],
				},
			],
		});
	}

	update({ changes, filter }) {
		return Post.update(changes, {
			where: {
				user_id: filter.logged_user_id,
				id: filter.id,
				is_deleted: false, 
			},
		});
	}

	delete(filter) {
		return Post.update(
			{ is_deleted: true },
			{
				where: {
					id: filter.id,
					is_deleted: false,
				},
			}
		);
	}

	async list({ filter, meta }) {
		const promises = [];
		const scopes = [];
		const Pagination = PaginationUtils.config({
			page: meta.page,
			items_per_page: 20,
		});
		if (filter.logged_user_id) {
			scopes.push({
				name: "withUserLike",
				options: filter.logged_user_id,
			});
		}

		promises.push(
			Post.scope(scopes).findAll({
				...Pagination.getQueryParams(),
				raw: false,
				attributes: [
					"id",
					"user_id",
					"title",
					"content",
					"total_likes",
					"created_at",
				],
				where: {
					is_deleted: false, 
				},
				order: [["created_at", "DESC"]],
			})
		);

		if (Pagination.getPage() === 1) {
			promises.push(Post.count({ where: { is_deleted: false } }));
		}

		const [posts, totalItems] = await Promise.all(promises);

		return {
			...Pagination.mount(totalItems),
			posts,
		};
	}

	async like({ filter }) {
		const transaction = await Post.sequelize.transaction();
		try {
			const post = await Post.findOne({
				where: {
					id: filter.post_id,
					is_deleted: false, 
				},
				transaction,
			});

			if (!post) {
				throw new Error("Post not found");
			}

			const hasLike = await PostLike.findOne({
				where: {
					post_id: filter.post_id,
					user_id: filter.logged_user_id,
					is_deleted: false, 
				},
				transaction,
			});

			if (hasLike) {
				throw new Error("Post already liked");
			}

			await PostLike.create(
				{
					post_id: filter.post_id,
					user_id: filter.logged_user_id,
				},
				{ transaction }
			);

			await Post.increment("total_likes", {
				where: {
					id: filter.post_id,
				},
				by: 1,
				transaction,
			});

			await transaction.commit();
			return post;
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async dislike({ filter }) {
		const transaction = await Post.sequelize.transaction();
		try {
			const post = await Post.findOne({
				where: {
					id: filter.post_id,
					is_deleted: false,
				},
				transaction,
			});

			if (!post) {
				throw new Error("Post not found");
			}

			const hasLike = await PostLike.findOne({
				where: {
					post_id: filter.post_id,
					user_id: filter.logged_user_id,
					is_deleted: false, 
				},
				transaction,
			});

			if (!hasLike) {
				throw new Error("Post not liked");
			}

			await PostLike.update(
				{ is_deleted: true },
				{
					where: {
						post_id: filter.post_id,
						user_id: filter.logged_user_id,
					},
					transaction,
				}
			);

			await Post.decrement("total_likes", {
				where: {
					id: filter.post_id,
				},
				by: 1,
				transaction,
			});

			await transaction.commit();
			return post;
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}
}

export default PostService;
