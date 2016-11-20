'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'helloworld') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

// adding API endpoint
app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id
        if (event.message && event.message.text) {
            let text = event.message.text
            if (text.includes("hey")){
                greeting(sender)
                continue
            }
            if (text === "YES") {
                sendTextMessage(sender, "Cool! Before you head out, I'm going to ask you a few questions to keep safe throughout the night.")
                checkSex(sender)
                continue
            }
            if (text.includes("ale")){
                sendTextMessage(sender, "Thanks, can you tell me how much you weigh?")
                continue
            }
            if (text.includes("1")){
                sendTextMessage(sender, "Got it. In case you ever need help, can you share with me the contact of a trusted friend?")
                continue
            }
            if (text.includes("Joe")){
                sendTextMessage(sender, "Okay, I'll let Joe (919-519-6442) know if you need help during the night.")
                getReturnTime(sender)
                continue
            }
            if (text.includes("AM")){
                sendTextMessage(sender, "Just to make sure, have you had something to eat tonight?")
                continue
            }
            if (text.includes("dinner")){
                sendTextMessage(sender, "That's good to hear! It's important to eat something before you drink so the absorbtion of alcohol into your bloodstream is slower. We'll keep in touch throughout the night. Have fun, Oscar!")
                continue
            }
            if (text.includes("drink")) {
                drinkCheckin(sender)
                sendTextMessage(sender, "How many have you had?")
                continue
            }
            if (text === "Beer"){
                sendTextMessage(sender, "How many beers have you had?")
            }
            sendTextMessage(sender, "You said: " + text.substring(0, 200))
        }
    }
    res.sendStatus(200)
})

// function to echo back messages
function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function greeting(sender){
    let messageData = {
        "text":"Hey, I'm Milo! Are you going out tonight?",
        "quick_replies":[
          {
            "content_type":"text",
            "title":"YES",
            "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_YES"
          },
          {
            "content_type":"text",
            "title":"NO",
            "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_NO"
          }
        ]
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function checkSex(sender){
    let messageData = {
        "text":"Are you male or female?",
        "quick_replies":[
          {
            "content_type":"text",
            "title":"Male",
            "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_MALE"
          },
          {
            "content_type":"text",
            "title":"Female",
            "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_FEMALE"
          }
        ]
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function getReturnTime(sender){
    let messageData = {
        "text":"What time do you plan on getting home?",
        "quick_replies":[
          {
            "content_type":"text",
            "title":"12 AM",
            "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_12_AM"
          },
          {
            "content_type":"text",
            "title":"1 AM",
            "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_1_AM"
          },
          {
            "content_type":"text",
            "title":"2 AM",
            "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_2_AM"
          },
          {
            "content_type":"text",
            "title":"3 AM",
            "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_3_AM"
          },
          {
            "content_type":"text",
            "title":"4 AM",
            "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_4_AM"
          },
          {
            "content_type":"text",
            "title":"5 AM",
            "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_5_AM"
          }
        ]
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function drinkCheckin(sender) {
    let messageData = {
        "text":"How much more have you had to drink in the past hour?",
        "quick_replies":[
          {
            "content_type":"text",
            "title":"Beer",
            "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_DRINKING_BEER"
          },
          {
            "content_type":"text",
            "title":"Hard Liqour",
            "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_DRINKING_HARD_LIQOUR"
          },
          {
            "content_type":"text",
            "title":"Wine",
            "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_DRINKING_WINE"
          }
        ]
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

const token = "EAAEEIHQCDYwBAN2ZCDDyUI1ILmc84jOhojOZB13tNZBeZCnel2n1pTccUTnXbS3m0JhNTUSbyolEEdZC8asc29jYRgqP4HebaZBIhtniOYx60AbxO0sXID7DiICUIGZCtuehwUHdhvQXaLgn8ZA22NfFxZC0nBRZBt2mn1STl9px3SFwZDZD"
