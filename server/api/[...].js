import app from "~/server/utils/app";
import router from "~/server/utils/router";

app.use("/api", router);

/* router.post('/trainer', (req, res) => {
    console.log(req.body);
    res.send("wait");
}) */

router.get('/test', (req, res) => {
    res.send("test page")
})


export default fromNodeMiddleware(app);
