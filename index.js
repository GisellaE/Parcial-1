const { validatorHandler } = require("./src/middlewares/validator.handler"); 
const {
  getComputerSchema,
  createComputerSchema,
  updateComputerSchema,
} = require("./src/schemas/events.schemas");


//Librerias externas
const express = require('express');
const fs = require('fs');
const {v4: uuidv4} = require('uuid');
const moment = require('moment')
const time = moment().format('YYYY-MM-DD HH:mm:ss')
const log = JSON.parse(fs.readFileSync('access_log.json', 'utf8'))


//Modulos internos

const { readFile, writeFile } = require('./src/files.js');
const { get } = require("http");

const app = express();
const PORT = process.env.PORT || 3000;
const APP_NAME = process.env.APP_NAME || 'My App';
const FILE_NAME = './db/computers.txt';
const FILE_NAME_ACCESS = "./db/acces.json";


//Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


//Usar el motor de plantillas de EJS
app.set('views', './src/views');
app.set('view engine', 'ejs');

// Ruta- listar computadores
app.get('/read-file', (req, res) => {
    const data = readFile(FILE_NAME);
    res.send(data);
});

//WEB
// Listar Mascotas
app.get('/computers', (req, res)=>{
    const data = readFile(FILE_NAME);
    res.render('computers/index', { computers: data });

    log.insert_request_dates.push(
        new_record = {"date": time})
        fs.writeFileSync('access_log.json', JSON.stringify(log))
});


app.get('/computers/create', (req,res) =>{
    //Mostrar el formulario
    res.render('computers/create');
})

//eliminar computador
app.post('/computers/delete/:id', (req, res) => {
    console.log(req.params.id);
    //Guardar el ID
    const id = req.params.id
    //Leer el contenido del archivo
    const computers = readFile(FILE_NAME)
    // Buscar la mascota con el ID que recibimos
    const ComputerIndex = computers.findIndex(computer => computer.id === id )
    if( ComputerIndex < 0 ){// Si no se encuentra la mascota con ese ID
        res.status(404).json({'ok': false, message:"Pet not found"});
        return;
    }
    //Eliminar la mascota que esté en la posición petIndex
    computers.splice(ComputerIndex, 1);
    writeFile(FILE_NAME, computers)
    res.redirect('/computers');
})



//Crear Computador
app.post('/computers',validatorHandler(createComputerSchema, "body"), async (req, res) => {
    try{
        //leer archivo de computadores
  const data = readFile(FILE_NAME);
  //agregar nuevo computador
  const newComputer = req.body;
  newComputer.id = uuidv4();
  console.log (newComputer)
  data.push(newComputer);//agregar nuevo elemento

  //escribir en el archivo

  writeFile(FILE_NAME, data);
    //res.json({message: 'El computador fue creado'});
    res.redirect('/computers');
  }catch (error){
      console.error(error);
      res.json({message: ' Error al almacenar '});
  }

});

//Obtener un solo computador (usamos los dos puntos por que es un path param)
app.get('/computers/:id', validatorHandler(getComputerSchema,"params" ), async(req, res) =>{
    console.log(req.params.id);
    //guardar el ID
    const id = req.params.id
    //leer el contenido del archivo
    const computers = readFile(FILE_NAME)
    //Buscar el computador con el ID que recibimos por la url
    const computersFound = computers.find(computer => computer.id === id)
    if(!computersFound){
        res.status(404).json({'ok': false, message: "computer not found"})
    }

    res.send({'ok': true, computer: computersFound});
});
//pregunta 1
//filtrar un computador por marca, etc
app.get('/Computersfilter', (req, res) => {
    const data = readFile(FILE_NAME);
    const { filterKey, filterValue } = req.query;

    if (!filterKey || !filterValue) {
        // Si no se proporcionó un parámetro de consulta, enviar todos los registros
        res.json(data);
        return;
    }

    // Filtrar los registros según la clave y el valor especificados en el parámetro de consulta
    const filteredData = data.filter(computers => computers[filterKey] === filterValue);

    if (filteredData.length === 0) {
        // Si no se encontraron registros que coincidan con el filtro, responder con un mensaje
        res.status(404).json({ message: 'No se encontraron registros que coincidan con el filtro.' });
    } else {
        // Responder con los registros filtrados
        res.json(filteredData);
    }
});

//pregunta 2

app.get('/computers', (req, res) => {
    // Obtener el valor del parámetro de consulta
    const filterValue = req.query.filter;
  
    // Filtrar los registros si se proporcionó un valor
    if (filterValue) {
      const filteredData = data.filter(computer => computer.Modelo === filterValue);
      res.json(filteredData);
    } else {
      // Mostrar todos los registros
      res.json(data);
    }
  });
  

 
  

//Actualizar un computador
app.put('/computers/:id', validatorHandler(updateComputerSchema,"body" ), async(req, res) =>{
    console.log(req.params.id);
    //guardar el ID
    const id = req.params.id
    //leer el contenido del archivo
    const computers = readFile(FILE_NAME)
    //Buscar el computador con el ID que recibimos por la url
    const computerIndex = computers.findIndex(computer => computer.id === id)
    if(computerIndex <0){ // Si no se encuentra la mascota con ese id 

        res.status(404).json({'ok': false, message: "computer not found"})
        return;
    
    }
    let computer = computers[computerIndex]; // Sacar del arrelgo
    computer = {...computer, ...req.body }
    computers[computerIndex] = computer //poner el computador en el mismo lugar 
    writeFile(FILE_NAME, computers);


    //si el computador existe, modificar sus datos y almacenarlo nuevamente

    res.send({'ok': true, computer: computer});
})

//Eliminar un computador
app.delete('/computers/:id',validatorHandler(getComputerSchema, "params"), async (req, res) =>{
    console.log(req.params.id);
    //guardar el ID
    const id = req.params.id
    //leer el contenido del archivo
    const computers = readFile(FILE_NAME)
    //Buscar el computador con el ID que recibimos por la url
    const computerIndex = computers.findIndex(computer => computer.id === id)
    if(computerIndex <0 ){ //si no se encuentra el computador con ese id
        res.status(404).json({'ok': false, message: "computer not found"})
        return;
    }
    //eliminar el computador que este en posicion computerIndex
    computers.splice (computerIndex, 1)
    writeFile (FILE_NAME, computers)


    res.json({'ok': true});
})


app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
});


    








