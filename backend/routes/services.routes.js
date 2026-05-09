const express = require("express");
const { createServicesController } = require("../controllers/services.controller");

module.exports = (db, verifyToken) => {
  const router = express.Router();
  const controller = createServicesController(db);

  router.get("/categories", controller.getPublicCategories);
  router.get("/admin/categories", verifyToken, controller.getAdminCategories);
  router.get("/categories/:slug", controller.getCategoryBySlug);
  router.post("/categories", verifyToken, controller.createCategory);
  router.put("/categories/:id", verifyToken, controller.updateCategory);
  router.delete("/categories/:id", verifyToken, controller.deleteCategory);

  router.get("/admin/subcategories", verifyToken, controller.getAdminSubCategories);
  router.get("/subcategories/:slug", controller.getPublicSubCategoryBySlug);
  router.post("/subcategories", verifyToken, controller.createSubCategory);
  router.put("/subcategories/:id", verifyToken, controller.updateSubCategory);
  router.delete("/subcategories/:id", verifyToken, controller.deleteSubCategory);

  return router;
};
