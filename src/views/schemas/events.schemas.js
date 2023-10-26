const Joi = require("joi");

const id = Joi.string().uuid();

const Marca = Joi.string().min(1).max(100);
const Modelo = Joi.string().min(1).max(100);
const Sn = Joi.string().min(1).max(100);
const cpu = Joi.string().min(1).max(50);
const ram = Joi.string().min(1).max(100);
const almacenamiento = Joi.array().items(Joi.string()).min(1).max(100);
const año = Joi.date();
const precio = Joi.number().precision(2).min(0);

//Crear un computador
const createComputerSchema = Joi.object({
    Marca: Marca.required(),
    Model: Modelo.required(),
    Sn: Sn.required(),
    cpu: cpu.optional(),
    ram: ram.optional(),
    almacenamiento: almacenamiento.required(),
    año: año.required(),
    precio: precio.required(),
  });

  //Actualizar un computador
const updateComputerSchema = Joi.object({ 
    Marca: Marca.optional(),
    Model: Modelo.optional(),
    Sn: Sn.optional(),
    cpu: cpu.optional(),
    ram: ram.optional(),
    almacenamiento: almacenamiento.optional(),
    año: año.optional(),
    precio: precio.optional(),

});
  
  const getComputerSchema = Joi.object({
    id: id.required(),
  });
  
  module.exports = {
    createComputerSchema,
    updateComputerSchema,
    getComputerSchema,
  }