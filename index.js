const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const userRouter = require("./routes/userRouter");
app.use("/api/users", userRouter);

const orderRouter = require("./routes/orderRouter");
app.use("/api/orders", orderRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
