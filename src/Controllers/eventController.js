const Event = require('../Models/Event')
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
  
  

const eventController = {

getEvents: async (req,res) => {

    try {
        const features = new APIfeatures(Event.find(), req.query)
        .filtering().sorting().paginating()
        const events = await features.query

        res.json({
            status: 'success',
            result: events.length,
            events: events
        })
        
    } catch (error) {
        console.log('error.message',error.message);
        // return res.status(500).json({message: error.message})
    }

},


getLugares: async (req,res) => {
    try {
        const lugares= await Event.distinct('lugar')
            // console.log("lugares",places);
         res.json({lugares});
       
    } catch (error) {
         return res.status(500).json({message: error.message})
    }
},

createEvent: async (req, res) => {

    try {
        const {title,description,lugar,dateEvent,hour} = req.body;
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

        const newEvent = new Event({ 
            title: title.toLowerCase(), 
            description, 
            images:urls, 
            public_id: public_ids,
            lugar,
            dateEvent,
            hour
        })
        await newEvent.save()
        for (let a = 0; a < urls.length; a++) {
            fs.unlink(req.files[a].path); // con esto eliminamos la imagen de la app (uploads) y solo la tendremos en el server de cloudinary
        }
        res.json({message: 'Evento Creado !!'})
  
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
},

updateEvent: async (req, res) => {
    try {
        const id = req.params.id;
        const archivos = req.files;
        const public_ids = [];
        const urls = [];
        if(archivos){

            const ids= await Event.findById(id,{public_id:1,_id:0})
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
        const {title,description,lugar,dateEvent,hour } = req.body;
        await Event.findByIdAndUpdate(id, { $set:{ title: title.toLowerCase(),description,images:urls.length===0?undefined:urls,public_id: public_ids.length===0 ?undefined : public_ids,lugar,dateEvent,hour}},{ new: true })
        res.json({ message: "Evento Actualizado"})
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  


deleteEvent: async (req, res) => {
    try {
        const id = req.params.id;
        const ids= await Event.findById(id,{public_id:1,_id:0})
        await Event.findByIdAndDelete(id);
        const cod= ids["public_id"]
        for (let i=0; i<cod.length; i++){
         await cloudinary.v2.uploader.destroy(cod[i]); //la eliminamos de cloudinary tambien
        }
        res.status(200).json({ message: "Evento Eliminado"})
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },



}

module.exports = eventController