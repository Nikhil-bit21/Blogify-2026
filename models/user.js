const {Schema , model} = require('mongoose');
const {createHmac , randomBytes} = require('node:crypto');

const userSchema = new Schema({
    fullName : {
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    salt:{
        type:String,
    },
    password:{
        type:String,
        required:true,
    },
    profileImageUrl:{
        type:String,
        default:'./images/default.png'
    },
    role:{
        type:String,
        enum:['USER','ADMIN'],
        default:"USER"
    }
},{timestamps:true}); 

userSchema.pre('save', async function () {
    const user = this;
    if (!user.isModified('password')) return;
    const salt = randomBytes(16).toString('hex');
    //const salt = "MyRandomSalt"
    const hashedPassword = await createHmac('sha256', salt).update(user.password).digest('hex');

    this.salt = salt;
    this.password = hashedPassword;
})

userSchema.static('matchPassword',async function(email,password){
    const user = await this.findOne({email});
    if(!user) throw new Error('User not Found');
    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedPassword = await createHmac('sha256',salt).update(password).digest('hex');
    // console.log(hashedPassword + " " + userProvidedPassword);
    if(hashedPassword !== userProvidedPassword) throw new Error('Incorrect Password');
    
    return user;
})

const User = model('user',userSchema);

module.exports = {User};