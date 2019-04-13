#Steps to run the program
`npm install`
`npm app.js`

DATABASE engine :mongoDB. 
Database name : stitcodingChallenge
Table name : users

# Api Design:
All the request type are JSON and response type are JSON expect the getEvents. getEvents will return Array of JSON  

NOTE: After login put token in authorization tab in postman 
Use Type = bearer token, put token and click on Preview request.
Now you can call setPreferences and getEvents. Otherwise, you will get  the error invalid token

/register:
Method: post
Body:` {
"username":"vrajesh978",        ←- required
	"password" : "Vrajesh@978",   ←- required
	"firstName" : "Vrajesh",        ←- required
	"lastName" : "Mehta",	   ←- required
"Preferences":[
{
"category":"Music",
"genreID":"R&B"
},
{
"category":"Film",
"genreID":"Comedy"
}
]
}`
 Response:
on Success : `{ message:"User is added to database" }`
error :
if username is already taken :
`{  "message": "Username \"vrajesh978\" is already taken”}`
If any one of the required field is empty:
`{
"message": "User validation failed: preferences: Path `preferences` is required., lastName: Path `lastName` is required., firstName: Path `firstName` is required., hash: Path `hash` is required., username: Path `username` is required."
}`

/login:
Method: post
Body : 
`{
	"username":"vrajesh978",
	"password" : "Vrajesh@978"
}`
Response:
OnSuccess: json response →  user’s details and token for the user so that user can make other api calls using that token.
On Error: 
If username or password is wrong:
`{
    "message": "Username or password is incorrect"
}`
/getEvents:
Method: GET
Requires token to call this method
Body: no body needed since user has set the preferences while registering to our system or user can set the preferences by calling the setPreferences/{id}.
Response:
onSuccess: Array of the JSON response from the API https://yv1x0ke9cl.execute-api.us-east-1.amazonaws.com/prod/events
If the user has more than one preferences, it will fetch the events from the above API endpoint and return the array of the JSON response.
Array[0] contains the first preference data, array[1] contains second preference data and so on.

onError: Json response from the API
 If token is missing :
`{
“message”:”invalid token”
}`




/setPreferences/{id}:
Method: PUT
Body: 
`{
	"Preferences":[
{"category":"Music","genreID":"R&B"},
{"category":"Film","genreID":"Comedy"}
]
}`

Response (json):
onSuccess:
 `{
  "message": "user has setPreferences"
}`
onError:
 If token is missing :
`{
“message”:”invalid token”
}`




