const express = require('express');
require('./config/database');
const userRouter = require('./routes/userRouter')
const categoryRouter = require('./routes/categoryRouter')
const roomRouter = require('./routes/roomRouter')
const PORT = process.env.PORT;
const lock = process.env.SESSION_SECRET;
const app = express();
const session = require('express-session');
const passport = require('passport')
require('./middlewares/passport');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc')

app.use(express.json());
app.use(session({
    secret: lock,
    resave: false,
    saveUninitialized:false
}))

app.use(passport.initialize());
app.use(passport.session());

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'First Swagger Documentation',
      version: '1.0.0',
      description:
        'Swagger docs usage',
      license: {
        name: 'Licensed Under MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'Etiojoro Emmanuel',
        url: 'https://jsonplaceholder.typicode.com',
      }
    },
    "components":{
        "securitySchemes":{
            "BearerAuth":{
                "type": "http",
                "scheme": "bearer",
                "bearerFormat": "JWT"
            }
        }
    },
    security: [{ BearerAuth: [] }],
    servers: [
        //  render base url link
      {
        url: 'http://localhost:4545',
        description: 'Production server',
      },
    //   localhost url
      {
        url: 'http://localhost:1742',
        description: 'Development server',
      }
    ],
  };
  
  const options = {
    swaggerDefinition,
    // Paths to files containing OpenAPI definitions
    apis: ['./routes/*.js'],
  };
  
  const swaggerSpec = swaggerJSDoc(options);
  app.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  

  

app.use(userRouter);
app.use(categoryRouter);
app.use(roomRouter);

app.listen(PORT, ()=>{
    console.log(`Server is listening to PORT :${PORT}`)
})

 
