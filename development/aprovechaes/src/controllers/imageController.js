const path = require('path');
const {randomNumber} = require('../helpers/libs');
const fs = require('fs-extra');
const {Image} = require('../models');

const controller = {};

controller.index = async (req, res) => {
    let viewModel = { image: {}, comments: [] };
    const image = await Image.findOne({filename: { $regex: req.params.image_id }});
    if (image) {
      image.views = image.views + 1;    
      viewModel.image = image;
      image.save();
      const comments = await Comment.find({image_id: image._id})
        .sort({'timestamp': 1});
      viewModel.comments = comments;
      viewModel = await sidebar(viewModel);
      res.render('image', viewModel);
    } else {
      res.redirect('/');
    }
  };


controller.createImage =  (req, res) => {
    //console.log("we get the file: ", req.file);
    const saveImage = async () => {
        const imgUrl = randomNumber();
        console.log("IT WILL BE: ",imgUrl); 
        const imagewillbe = Image.find({filename: imgUrl});
        console.log("imagewillbe: ",imagewillbe.length); 
        if(imagewillbe.length>0){
            saveImage();
        }else {
            const imageTempPath = req.file.path;
            const ext = path.extname(req.file.originalname).toLowerCase()
            const tarjetPath = path.resolve(`src/public/upload/${imgUrl}${ext}/`);
            //const tarjetPath = path.resolve(`src/pulic/upload/${req.file.filename}`);
            //console.log("Ext: ", ext); 
            console.log("Img path: ", imageTempPath);
            console.log("tarjetPath", tarjetPath);
            if(ext ==='.png' || ext ==='.jpg' || ext ==='.gif' || ext ==='.jpeg'){
                await fs.copy(imageTempPath, tarjetPath)
                .then(()=> console.log('success!'))
                .catch(err => console.error(err))

                const newImg = new Image({
                    title: req.body.title,
                    filename: imgUrl +ext,
                    description: req.body.description
                });

                const imageSaved= await newImg.save();
                console.log("100: IMG: ", newImg , "SO LITTLE : ", imageSaved);
                res.send('/images');
            }else{
                await fs.unlink(imageTempPath);
                res.status(500).json({error: 'Only Images are allowed'});
            }           
        }        
    }; //saveImage 
    saveImage();
};  //createImage


controller.create = (req, res) => {
    const saveImage = async () => {
      const imgUrl = randomNumber();
      const images = await Image.find({ filename: imgUrl });
      if (images.length > 0) {
        saveImage()
      } else {
        // Image Location
        const imageTempPath = req.file.path;
        const ext = path.extname(req.file.originalname).toLowerCase();
        const targetPath = path.resolve(`src/public/upload/${imgUrl}${ext}`);
  
        // Validate Extension
        if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
          // you wil need the public/temp path or this will throw an error
          await fs.rename(imageTempPath, targetPath);
          const newImg = new Image({
            title: req.body.title,
            filename: imgUrl + ext,
            description: req.body.description
          });
          const imageSaved = await newImg.save();
          res.redirect('/images/' + imageSaved.uniqueId);
        } else {
          await fs.unlink(imageTempPath);
          res.status(500).json({ error: 'Only Images are allowed' });
        }
      }
    };
  
    saveImage();
  };

controller.like = (req, res) => {

};

controller.comment = (req, res) => {

};

controller.remove = (req, res) => {

};

module.exports= controller;