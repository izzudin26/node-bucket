import express, { Express, Request, Response } from "express";
import multer from "multer";
import path from "path";

class Application {
  public app: Express;
  private storage: multer.StorageEngine;
  constructor() {
    this.app = express();
    this.storage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, path.join(__dirname + "/../storage"));
        },
        filename: (req, file, cb) => {
          cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
          );
        },

      });
    this.plugin()
    this.routes()
  }
  plugin() {
    
  }

  routes() {
    this.app.post("/upload", multer({storage: this.storage}).single("file"), (req: Request, res: Response) => {
        const file = req.file
        if(!file?.path){
            res.status(400).json({
                status: 400,
                message: "No File Selected"
            })
        }
        res.status(200).json({
            status: 200,
            message: "Success upload",
            filename: `${file?.filename}`
        })
    });

    this.app.get("/:fileName", (req: Request, res: Response) => {
        const {fileName} = req.params
        res.sendFile(path.join(__dirname + `/../storage/${fileName}`))
    })
  }
}

const port = 8080
const app: Express = new Application().app
app.listen(port, () => {
    console.log(`Running on port ${port}`)
})