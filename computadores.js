const { readFile, writeFile } = require('./src/files.js');

const app = express();
const FILE_NAME = './db/computers.txt';


appl.post('/computers', (req, res) => {
    try{
        const data = readFile(FILE_NAME);
        console.log(req.body)
        data.push(req.body);

        FileSystemWritableFileStream(FILE_NAME, data);
        res.json ({message: 'el computador fue creado con exito'});
    }catch (error){
        console.error(error);
        res.json({message: 'Error al al almacenar el computador'+ error});
    }
});