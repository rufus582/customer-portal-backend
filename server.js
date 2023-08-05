const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const customerRouter = require('./routes/customer_router')
const userRouter = require('./routes/user_router')

app.use(customerRouter)
app.use(userRouter)

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
