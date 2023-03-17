const Place = require('../Models/Place')
const cloudinary = require("cloudinary");
const fs = require("fs-extra"); 


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
  
  

const placeController = {

getPlaces: async (req,res) => {

    try {
        const features = new APIfeatures(Place.find(), req.query)
        .filtering().sorting().paginating()

        const places = await features.query

        res.json({
            status: 'success',
            result: places.length,
            places: places
        })
        
    } catch (error) {
        return res.status(500).json({message: error.message})
    }

},

createPlace: async  (req, res)=> {

    try {
        const { title, description, parroquia, category,zoom,lat,lng, contact } = req.body;
        // const position= JSON.parse(location)
        const archivos = req.files;
         const public_ids = [];
         const urls = [];

        for (let i = 0; i < archivos.length; i++) {
            const localFilePath = req.files[i].path;
            const result = await cloudinary.v2.uploader.upload(localFilePath); // con esta linea ya estoy subiendo las imagenes al servidor de cloudinary
            //recuerda que result devulve url y secure_url que es la misma ruta de la imagen pero con protocolo https 
            urls.push(result.secure_url);
            public_ids.push(result.public_id);
        }
        const newPlace = new Place({
            title: title.toLowerCase(),
            description,
            parroquia,
            category,
            zoom,
            lat,
            lng,
            images: urls,
            public_id: public_ids,
            contact
        });
        await newPlace.save();
        for (let a = 0; a < urls.length; a++) {
            fs.unlink(req.files[a].path); // con esto eliminamos la imagen de la app (uploads) y solo la tendremos en el server de cloudinary
           
        }
        res.json({ message: 'Lugar Creado !!' });

    } catch (error) {
        // return res.status(500).json({ message: error.message });
        console.log("error",error)
    }
},

updatePlace: async (req, res) => {
    try {
        const id = req.params.id;

        const archivos = req.files;
        const public_ids = [];
        const urls = [];

        if(archivos){

          const ids= await Place.findById(id,{public_id:1,_id:0})
          const cod= ids["public_id"]
          for (let i=0; i<cod.length; i++){
           await cloudinary.v2.uploader.destroy(cod[i]); //la eliminamos de cloudinary tambien
          }

          for (let i = 0; i < archivos.length; i++) {
            const localFilePath = req.files[i].path;
            const result = await cloudinary.v2.uploader.upload(localFilePath); // con esta linea ya estoy subiendo las imagenes al servidor de cloudinary
            //recuerda que result devulve url y secure_url que es la misma ruta de la imagen pero con protocolo https 
            urls.push(result.secure_url);
            public_ids.push(result.public_id);
        }

        }
      
        const { title,description,parroquia,category,zoom,lat,lng,contact } = req.body;
        // console.log('req.body',req.body)
        await Place.findByIdAndUpdate(id, { $set:{ title:title.toLowerCase(),description,parroquia,
            category,zoom,lat,lng,images:urls.length===0?undefined:urls, public_id: public_ids.length===0 ?undefined : public_ids ,contact}},{ new: true })
            for (let a = 0; a < urls.length; a++) {
                fs.unlink(req.files[a].path); // con esto eliminamos la imagen de la app (uploads) y solo la tendremos en el server de cloudinary
               
            }
        res.json({ message: "Lugar Actualizado"})
    } catch (error) {
      console.log("error",error)
    //   return res.status(500).json({ message: error.message });
    }
  },





deletePlace: async (req, res) => {
    try {
        const id = req.params.id;
        const ids= await Place.findById(id,{public_id:1,_id:0})
        await Place.findByIdAndDelete(id);
        const cod= ids["public_id"]
        for (let i=0; i<cod.length; i++){
         await cloudinary.v2.uploader.destroy(cod[i]); //la eliminamos de cloudinary tambien
        }
        res.status(200).json({ message: "Lugar Eliminado"})
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },



}

module.exports = placeController