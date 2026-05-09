const SERVICE_CATEGORY_COLLECTION = "serviceCategories";

const serviceCategorySchema = {
  title: "String",
  slug: "String",
  description: "String",
  icon: "String",
  order: "Number",
  isActive: "Boolean",
  subCategories: "ObjectId[]",
};

module.exports = {
  SERVICE_CATEGORY_COLLECTION,
  serviceCategorySchema,
};
