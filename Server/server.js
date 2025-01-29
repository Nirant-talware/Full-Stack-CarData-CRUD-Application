const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const carRoutes = require('./routes/Routes'); 


const app = express();
const port = 3000;


app.use(cors());
app.use(bodyParser.json());

app.use('/api/cars', carRoutes);
app.use('/api/cars/uploads', express.static('uploads'));


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
