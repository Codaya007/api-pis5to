// const { NORMAL_ROLE_NAME } = require("../constants");
const Pronostic = require("../models/Pronostic");
const NotExist = require("../errors/NotExit");
const ValidationError = require("../errors/ValidationError");
const { isValidObjectId } = require("mongoose");

const prueba = async ({ mensaje }) => {

    // const role = await Role.findOne({ name: NORMAL_ROLE_NAME });
    // if (role) newInfo.role = role._id;

    // const user = await User.create({
    //     ...newInfo,
    //     settings: {
    //         nofitication: true,
    //         spam: true,
    //     },
    // });

    return `${mensaje} hola`;
};

const createPronostic = async (pronosticData) => {
    console.log({ pronosticData });

    const pronostic = await Pronostic.create(pronosticData);

    console.log({ pronostic });

    return pronostic;
};

//TODO: Realizar para botar una respuesta cuando no encuentre el pronostic por id
const getPronosticById = async (id) => {
    if (!isValidObjectId(id))
        throw new ValidationError("El id debe ser un ObjectId");

    let pronosticData = await Pronostic.findById(id)
        // .populate("")
        .lean();

    if (!pronosticData) throw new NotExist("No se encontro el pronostico");

    return pronosticData;
};

//TODO: Realizar para botar una respuesta cuando no encuentre el pronostic por id
const getPronosticByDate = async (initDate, endDate) => {

    let pronosticData = await Pronostic.find({
        dateTime: {
            $gte: initDate,
            $lte: endDate,
        },
    }).exec();

    if (!pronosticData) throw new NotExist("No se encontro el pronostico");

    return pronosticData;
};

module.exports = {
    prueba,
    createPronostic,
    getPronosticById,
    getPronosticByDate
};