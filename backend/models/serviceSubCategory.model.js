const SERVICE_SUB_CATEGORY_COLLECTION = "serviceSubCategories";

const serviceSubCategorySchema = {
  title: "String",
  slug: "String",
  category: "ObjectId",
  hero: {
    headline: "String",
    subheadline: "String",
  },
  overview: "String",
  whatsIncluded: "String[]",
  process: "String[]",
  bestFor: "String",
  cta: "String",
  isActive: "Boolean",
  order: "Number",
};

module.exports = {
  SERVICE_SUB_CATEGORY_COLLECTION,
  serviceSubCategorySchema,
};
