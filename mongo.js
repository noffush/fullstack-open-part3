const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2]

const url = `mongodb+srv://chennofar:${password}@cluster0.5btz6.mongodb.net/phnoebookApp?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

const newPerson = new Person({ name: process.argv[3], number: process.argv[4] });

if (newPerson.name === undefined) {
  // get all entries and close connection
  Person.find({}).then(result => {
    console.log('phonebook:');
    result.forEach(person => console.log(person.name, person.number));
    mongoose.connection.close();
  });
} else if (newPerson.number === undefined) {
  console.log('provide phone number');
  process.exit(1);
} else {
  newPerson.save().then(result => {
    console.log(`added ${newPerson.name} number ${newPerson.number} to phonebook`);
    mongoose.connection.close();
  });

}

