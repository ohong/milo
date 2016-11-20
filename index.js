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
            if (text.includes("drink")) {
                drinkCheckin(sender)
                sendTextMessage(sender, "How many have you had?")
                continue
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
