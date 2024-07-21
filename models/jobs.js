const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    logo:{
        type:String,
        required:true
    },
    position:{
        type:String,
        required:true
    },
    salary:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    jobType:{
        type:String,
        enum:["Full Time","Part Time","Remote","Contract","Internship"],
        required:true
    },
    remote:{
        type:String,
        enum:["Remote","Office","Hybrid"],
        required:true
    },
    description:{
        type:String,
        required:true
    },
    about:{
        type:String,
        required:true
    },
    skills:{
        type:[String],
        required:true
    },
    information:{
        type:String,
        required:true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    }

})

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;