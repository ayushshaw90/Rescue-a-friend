if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const accountSid = process.env.ACCOUNT_SID; 
const authToken = process.env.AUTH_TOKEN; 
const client = require('twilio')(accountSid, authToken); 


function sendSMS(msg_body, to){
    client.messages 
      .create({ 
         body: msg_body,  
         messagingServiceSid: process.env.MESSAGE_SERVICE_SID,      
         to: to 
       }) 
      .then(message => console.log(message.sid)) 
      .done();

}
module.exports = sendSMS