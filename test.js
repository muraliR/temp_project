var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('./config');
var mongo_url = config.db_url;

var mongoose_connection = mongoose.connect(mongo_url);

var personSchema = Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  age: Number,
  stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }]
});

var storySchema = Schema({
  author: { type: Schema.Types.ObjectId, ref: 'Person' },
  title: String,
  fans: [{ type: Schema.Types.ObjectId, ref: 'Person' }]
});

var Story = mongoose.model('Story', storySchema);
var Person = mongoose.model('Person', personSchema);



// var author = new Person({
//   _id: new mongoose.Types.ObjectId(),
//   name: 'Ian Fleming',
//   age: 50
// });

// author.save(function (err) {
//   if (err) return handleError(err);

//   var story1 = new Story({
//     title: 'Casino Royale',
//     author: author._id    // assign the _id from the person
//   });

//   story1.save(function (err) {
//     if (err) return handleError(err);
//     // thats it!
//   });

//   author.stories.push(story1);
//   author.save(function(){
//   	console.log("saved!!");
//   });
// });


Story.
  findOne({ title: 'Casino Royale' }).
  populate('author').
  exec(function (err, story) {
    if (err) return handleError(err);
    //console.log('The author is %s', story.author.name);
    // prints "The author is Ian Fleming"

    //console.log(story);
  });


Person.findOne().populate('stories').exec(function (err, author) {
    if (err) return handleError(err);
    //console.log('The author is %s', story.author.name);
    // prints "The author is Ian Fleming"

    console.log(author.stories);
  });