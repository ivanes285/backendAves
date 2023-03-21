const Category = require("../Models/Category");


class APIfeatures {
  constructor(query, queryString){
      this.query = query;
      this.queryString = queryString;
  }

  //Filtrar
  filtering(){
     const queryObj = {...this.queryString} //queryString = req.query
    //  console.log("queryObj",queryObj)
    //  console.log({before: queryObj})

     const excludedFields = ['page', 'sort', 'limit']
     excludedFields.forEach(el => delete(queryObj[el]))
     
     let queryStr = JSON.stringify(queryObj)

     queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)
  
  //    gte = greater than or equal
  //    lte = lesser than or equal
  //    lt = lesser than
  //    gt = greater than

     this.query.find(JSON.parse(queryStr))
    //  console.log({after: queryObj})
     return this;
  }


  sorting(){
      if(this.queryString.sort){
          const sortBy = this.queryString.sort.split(',').join(' ')
          this.query = this.query.sort(sortBy)
      }else{
          this.query = this.query.sort('-createdAt')
      }

      return this;
  }

  paginating(){
      const page = this.queryString.page * 1 || 1
      const limit = this.queryString.limit * 1 || 9
      const skip = (page - 1) * limit;
      this.query = this.query.skip(skip).limit(limit)
      return this;
  }
}



const categoryController = {

  getCategories: async (req, res) => {

    try {
      const features = new APIfeatures(Category.find(), req.query)
      .filtering().sorting().paginating()

      const categories = await features.query

      res.json({
          status: 'success',
          result: categories.length,
          categories: categories
      })
      
  } catch (error) {
      return res.status(500).json({message: error.message})
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
