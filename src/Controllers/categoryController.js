const Category = require("../Models/Category");

const categoryController = {
  getCategories: async (req, res) => {
    try {
      const categories = await Category.find();
      res.json(categories);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  createCategory: async (req, res) => {
    try {
      const { name } = req.body;
      const category = await Category.findOne({ name });
      if (category)
        return res
          .status(400)
          .json({ message: "La categoria ya existe debe ser unica" });
      //if user has role =1 -----> admin
      //only admin can create , delete and update category

      const newCategory = new Category({
        name,
      });
      await newCategory.save();
      res
        .status(200)
        .json({ message: "La categoria ha sido creada" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const id = req.params.id;
      await Category.findByIdAndDelete(id);
      res.status(200).json({ message: "La categoria ha sido eliminada" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  updateCategory: async (req, res) => {
    try {
      const id = req.params.id;
      const {name}= req.body;
     // const update=  await Category.findByIdAndUpdate(id, { $set: name }, { new: true });
     const update=  await Category.findByIdAndUpdate(id, {name });

     // res.status(200).json(update);
      res.status(200).json({ message: "La categoria ha sido actualizada" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = categoryController;
