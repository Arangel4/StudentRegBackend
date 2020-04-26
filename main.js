import mongoose from 'mongoose'; // Import your packages at the top of your code.
// Be sure to include in your package.json, the following key:value = "type": "module"

// For Mongoose, you need to 'expose' the Promise functionality to the rest of your project.
mongoose.Promise = global.Promise;

// Also for Mongoose, you need to 'expose' the Mongoose Schema type in your code.
const Schema = mongoose.Schema;

// create constants to hold necessary information regarding the connection to MongoDB.

const mongoDBUrl = "localhost";
const mongoDBPort = "27017";
const mongoDBDatabase = "Module3";

// Create a Schema object representing students.
const studentSchema = new Schema({
    studentID: { type: "Number", required: true },  // "Float" should be a defined MongoDB datatype. UPDATE: Float is not a valid Mongoose type, Number is the type for float.
    firstName: { type: "String", required: true },
    lastName: { type: "String", required: true },
    email: { type: "String", required: true },
    major: { type: "String", required: true },
    registrationStatus: { type: "Boolean", required: true }
});

// set the defined schema as a model for Mongoose to use
const Student = mongoose.model("Student", studentSchema, "Students");   // "name of model", schemaObject, "name of Collection in DB"


// For all database (or 10-type functions), they really should be written as asynchronous function.
// Asynchronous functins will execute and let other Javascript code execute simultaneously.
const connectToDB = async() => {    // The async keyword makes this function an asynchronous function.
    // This function will establish the connection to the MongoDB DBMS
    // When working with IO code (in this case connecting to a DB), try to surround that code with error handling (usually a try/catch block)
    try {
        // Code that could cause an exception (or error) is written here.
        const connectionInfo = `mongodb://${mongoDBUrl}:${mongoDBPort}/${mongoDBDatabase}`;
        const mongoDBConfigObject = {
            useNewUrlParser: true, 
            useUnifiedTopology: true
        };
        await mongoose.connect(connectionInfo, mongoDBConfigObject);    // await makes this part of JavaScript wait until this gets resolved. You can only use await within async functions.
    }
    catch (err) {
        // Code to execute if an exception is raised (or thrown)
        // Usually some kind of error recording code.
        console.log(err);
    }
}


// Write a function that can read all Tree documents
const getAll = async() => {
    // use a try/catch because of IO code
    try {
        // the modelObject.find() will return a document or documents if no filter is specified.
        await Student.find().exec((err, StudentCollection) => {
            if (err) {
                console.log(err);
            }
            // If we don't have an error, do something with your documents.
            console.log({StudentCollection });
        });
    }
    catch (err) {
        console.log(err);
    }
}

// addStudent adds a new student's data into my MongoDB database.
const addStudent = async(studentObj) => { // studentObj is a JSON object conforming to our defined schema
    try {
        const newStudent = new Student(studentObj); // this create a new Student document based on studentObj, but doesn't add it just yet.
        newStudent.save((err, savedObj) => {
            if (err) {
                console.log(err);
            }
            console.log(savedObj);
        });
    }
    catch (err) {
        console.log(err);    }
}

// async functions can be called in the top-level of your code, but they CANNOT USE await.
// To get around that, create an entry point function that is async and then call your other async functions in that.
const main = async() => {
    // Call your other async functions here
    // You can also write regular JS code here as well.
    await connectToDB();

    // New student data added.
    let aNewStudent = {
        studentID: 9845670,
        firstName: "April",
        lastName: "Hoover",
        email: "ahoover@email.com",
        major: "Accounting",
        registrationStatus: true
    }
    await addStudent(aNewStudent);

    await getAll();
}

// calling the main entry point.
main();