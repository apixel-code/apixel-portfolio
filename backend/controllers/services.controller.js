const { ObjectId } = require("mongodb");
const { SERVICE_CATEGORY_COLLECTION } = require("../models/serviceCategory.model");
const { SERVICE_SUB_CATEGORY_COLLECTION } = require("../models/serviceSubCategory.model");

const slugify = (text = "") =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const serializeDoc = (doc) => {
  if (!doc) return null;
  if (doc instanceof ObjectId) return doc.toString();
  const { _id, category, subCategories, createdAt, updatedAt, ...rest } = doc;
  return {
    id: _id.toString(),
    ...rest,
    ...(category ? { category: typeof category === "object" && category._id ? serializeDoc(category) : category.toString() } : {}),
    ...(subCategories ? { subCategories: subCategories.map(serializeDoc) } : {}),
    ...(createdAt ? { createdAt: createdAt instanceof Date ? createdAt.toISOString() : createdAt } : {}),
    ...(updatedAt ? { updatedAt: updatedAt instanceof Date ? updatedAt.toISOString() : updatedAt } : {}),
  };
};

const parseObjectId = (id) => {
  if (!ObjectId.isValid(id)) return null;
  return new ObjectId(id);
};

const parseBoolean = (value, fallback = true) => {
  if (typeof value === "boolean") return value;
  if (value === "false") return false;
  if (value === "true") return true;
  return fallback;
};

const normalizeCategoryPayload = (body = {}, existing = {}) => ({
  title: body.title ?? existing.title ?? "",
  slug: body.slug ? slugify(body.slug) : slugify(body.title ?? existing.title ?? ""),
  description: body.description ?? existing.description ?? "",
  icon: body.icon ?? existing.icon ?? "Code",
  order: Number(body.order ?? existing.order ?? 1),
  isActive: parseBoolean(body.isActive, existing.isActive ?? true),
});

const normalizeSubCategoryPayload = (body = {}, existing = {}) => {
  const categoryId = body.category || existing.category;
  return {
    title: body.title ?? existing.title ?? "",
    slug: body.slug ? slugify(body.slug) : slugify(body.title ?? existing.title ?? ""),
    category: typeof categoryId === "string" ? parseObjectId(categoryId) : categoryId,
    hero: {
      headline: body.hero?.headline ?? body.heroHeadline ?? existing.hero?.headline ?? "",
      subheadline: body.hero?.subheadline ?? body.heroSubheadline ?? existing.hero?.subheadline ?? "",
    },
    overview: body.overview ?? existing.overview ?? "",
    whatsIncluded: Array.isArray(body.whatsIncluded) ? body.whatsIncluded.filter(Boolean) : existing.whatsIncluded ?? [],
    process: Array.isArray(body.process) ? body.process.filter(Boolean) : existing.process ?? [],
    bestFor: body.bestFor ?? existing.bestFor ?? "",
    cta: body.cta ?? existing.cta ?? "Start Your Project",
    isActive: parseBoolean(body.isActive, existing.isActive ?? true),
    order: Number(body.order ?? existing.order ?? 1),
  };
};

const createServicesController = (db) => {
  const categories = () => db.collection(SERVICE_CATEGORY_COLLECTION);
  const subCategories = () => db.collection(SERVICE_SUB_CATEGORY_COLLECTION);

  const attachSubCategories = async (category, activeOnly = true) => {
    const query = { category: category._id };
    if (activeOnly) query.isActive = true;

    const items = await subCategories().find(query).sort({ order: 1, title: 1 }).toArray();
    return serializeDoc({ ...category, subCategories: items });
  };

  return {
    async getPublicCategories(_req, res) {
      try {
        const items = await categories().find({ isActive: true }).sort({ order: 1, title: 1 }).toArray();
        res.json(items.map(serializeDoc));
      } catch (error) {
        res.status(500).json({ detail: "Failed to fetch service categories" });
      }
    },

    async getAdminCategories(_req, res) {
      try {
        const items = await categories().find().sort({ order: 1, title: 1 }).toArray();
        res.json(items.map(serializeDoc));
      } catch (error) {
        res.status(500).json({ detail: "Failed to fetch service categories" });
      }
    },

    async getCategoryBySlug(req, res) {
      try {
        const category = await categories().findOne({ slug: req.params.slug, isActive: true });
        if (!category) return res.status(404).json({ detail: "Service category not found" });
        res.json(await attachSubCategories(category, true));
      } catch (error) {
        res.status(500).json({ detail: "Failed to fetch service category" });
      }
    },

    async createCategory(req, res) {
      try {
        const data = normalizeCategoryPayload(req.body);
        if (!data.title) return res.status(400).json({ detail: "Title is required" });
        if (await categories().findOne({ slug: data.slug })) {
          return res.status(409).json({ detail: "A category with this slug already exists" });
        }

        const doc = { ...data, subCategories: [], createdAt: new Date(), updatedAt: new Date() };
        const result = await categories().insertOne(doc);
        res.status(201).json(serializeDoc({ _id: result.insertedId, ...doc }));
      } catch (error) {
        res.status(500).json({ detail: "Failed to create service category" });
      }
    },

    async updateCategory(req, res) {
      try {
        const id = parseObjectId(req.params.id);
        if (!id) return res.status(400).json({ detail: "Invalid category id" });
        const existing = await categories().findOne({ _id: id });
        if (!existing) return res.status(404).json({ detail: "Service category not found" });

        const data = { ...normalizeCategoryPayload(req.body, existing), updatedAt: new Date() };
        const duplicate = await categories().findOne({ slug: data.slug, _id: { $ne: id } });
        if (duplicate) return res.status(409).json({ detail: "A category with this slug already exists" });

        const result = await categories().findOneAndUpdate({ _id: id }, { $set: data }, { returnDocument: "after" });
        res.json(serializeDoc(result));
      } catch (error) {
        res.status(500).json({ detail: "Failed to update service category" });
      }
    },

    async deleteCategory(req, res) {
      try {
        const id = parseObjectId(req.params.id);
        if (!id) return res.status(400).json({ detail: "Invalid category id" });
        const result = await categories().deleteOne({ _id: id });
        if (result.deletedCount === 0) return res.status(404).json({ detail: "Service category not found" });
        await subCategories().deleteMany({ category: id });
        res.json({ message: "Service category deleted successfully" });
      } catch (error) {
        res.status(500).json({ detail: "Failed to delete service category" });
      }
    },

    async getPublicSubCategoryBySlug(req, res) {
      try {
        const item = await subCategories().findOne({ slug: req.params.slug, isActive: true });
        if (!item) return res.status(404).json({ detail: "Service sub-category not found" });
        const category = await categories().findOne({ _id: item.category, isActive: true });
        if (!category) return res.status(404).json({ detail: "Service category not found" });
        res.json(serializeDoc({ ...item, category }));
      } catch (error) {
        res.status(500).json({ detail: "Failed to fetch service sub-category" });
      }
    },

    async getAdminSubCategories(req, res) {
      try {
        const query = {};
        const categoryId = req.query.category ? parseObjectId(req.query.category) : null;
        if (req.query.category && !categoryId) return res.status(400).json({ detail: "Invalid category id" });
        if (categoryId) query.category = categoryId;

        const items = await subCategories().aggregate([
          { $match: query },
          { $sort: { order: 1, title: 1 } },
          {
            $lookup: {
              from: SERVICE_CATEGORY_COLLECTION,
              localField: "category",
              foreignField: "_id",
              as: "categoryDoc",
            },
          },
          { $unwind: { path: "$categoryDoc", preserveNullAndEmptyArrays: true } },
          { $addFields: { category: "$categoryDoc" } },
          { $project: { categoryDoc: 0 } },
        ]).toArray();

        res.json(items.map(serializeDoc));
      } catch (error) {
        res.status(500).json({ detail: "Failed to fetch service sub-categories" });
      }
    },

    async createSubCategory(req, res) {
      try {
        const data = normalizeSubCategoryPayload(req.body);
        if (!data.title) return res.status(400).json({ detail: "Title is required" });
        if (!data.category) return res.status(400).json({ detail: "Category is required" });
        if (!(await categories().findOne({ _id: data.category }))) {
          return res.status(404).json({ detail: "Service category not found" });
        }
        if (await subCategories().findOne({ slug: data.slug })) {
          return res.status(409).json({ detail: "A sub-category with this slug already exists" });
        }

        const doc = { ...data, createdAt: new Date(), updatedAt: new Date() };
        const result = await subCategories().insertOne(doc);
        await categories().updateOne({ _id: data.category }, { $addToSet: { subCategories: result.insertedId } });
        res.status(201).json(serializeDoc({ _id: result.insertedId, ...doc }));
      } catch (error) {
        res.status(500).json({ detail: "Failed to create service sub-category" });
      }
    },

    async updateSubCategory(req, res) {
      try {
        const id = parseObjectId(req.params.id);
        if (!id) return res.status(400).json({ detail: "Invalid sub-category id" });
        const existing = await subCategories().findOne({ _id: id });
        if (!existing) return res.status(404).json({ detail: "Service sub-category not found" });

        const data = { ...normalizeSubCategoryPayload(req.body, existing), updatedAt: new Date() };
        if (!data.category || !(await categories().findOne({ _id: data.category }))) {
          return res.status(404).json({ detail: "Service category not found" });
        }

        const duplicate = await subCategories().findOne({ slug: data.slug, _id: { $ne: id } });
        if (duplicate) return res.status(409).json({ detail: "A sub-category with this slug already exists" });

        const result = await subCategories().findOneAndUpdate({ _id: id }, { $set: data }, { returnDocument: "after" });
        if (String(existing.category) !== String(data.category)) {
          await categories().updateOne({ _id: existing.category }, { $pull: { subCategories: id } });
          await categories().updateOne({ _id: data.category }, { $addToSet: { subCategories: id } });
        }
        res.json(serializeDoc(result));
      } catch (error) {
        res.status(500).json({ detail: "Failed to update service sub-category" });
      }
    },

    async deleteSubCategory(req, res) {
      try {
        const id = parseObjectId(req.params.id);
        if (!id) return res.status(400).json({ detail: "Invalid sub-category id" });
        const existing = await subCategories().findOne({ _id: id });
        if (!existing) return res.status(404).json({ detail: "Service sub-category not found" });

        await subCategories().deleteOne({ _id: id });
        await categories().updateOne({ _id: existing.category }, { $pull: { subCategories: id } });
        res.json({ message: "Service sub-category deleted successfully" });
      } catch (error) {
        res.status(500).json({ detail: "Failed to delete service sub-category" });
      }
    },
  };
};

module.exports = {
  createServicesController,
  slugify,
};
