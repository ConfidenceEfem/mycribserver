import multer from "multer"

const storage = multer.memoryStorage()

 export const uploader = multer({
    storage: storage, 
    limits: {
        fileSize: 2 * 1024 * 1024 // 2 MB
    }
})

