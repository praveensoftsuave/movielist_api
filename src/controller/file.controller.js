import Router from "express-promise-router";
import firebaseAdmin from "firebase-admin";

const router = new Router();


router.post("/upload", async (req, res) => {
    try {
       
        const bucket = firebaseAdmin.storage().bucket();
        const remoteFile = bucket.file(new Date() + req?.file?.originalname);
        await remoteFile.save(req?.file?.buffer);

        const url = await remoteFile.getSignedUrl({action: 'read', expires: new Date("2024/12/01")});
        res.status(200).send({ message: "Upload Success", data: {url} });
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Unable to upload file", error: error?.message});
    }

});


export default router;