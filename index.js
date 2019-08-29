const express = require('express')
const multer = require('multer')
const path = require('path')

const app = express()

// Set Storage Engine
const storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init Upload: 'myFile' is the name in the form [input name="myFile" type="file"]
const upload = multer({
   storage : storage,
   // 1mb = 1,000,000
   limits: {fileSize: 5000000},
   fileFilter: function(req, file, callback){
     checkFileType(file, callback)
   }
 }).single('file');

 // Check file type: extension and mimetype
 const checkFileType = (file, callback) => {
   // Allowed Ext
   const filetypes = /jpeg|jpg|png/;
   // Check Ext
   const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
   // Check mimetype
   const mimetype = filetypes.test(file.mimetype)
   // If correct filetype
   if(extname && extname){
     return callback(null,true)
   } else {
     return callback('Error:images only!')
   }
 }

// Handle Upload Route
app.post('/upload-multer', (req,res) => {
  upload(req, res, (err) => {
      if(err) {
        res.status(401).send(err)
      } else {
        res.status(200).send(req.file)
      }
  })
})

// Download with Express
app.get('/download-express/:file', (req,res) => {
  const file = req.params.file;
  const fileLocation = path.join('download', file);
  console.log(fileLocation);
  try {
      res.download(fileLocation, file);
  } catch(e) {
    console.error(e)
  }
})

app.get('/download-multer/:filename', (req,res) => {

})

// Server Listen
app.listen('5000', () => {
  console.log('app running on port 5000')
})
