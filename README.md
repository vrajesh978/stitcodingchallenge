# Steps to run the program
```
npm install
npm app.js
```
**DATABASE engine :mongoDB** <br/>
**Database name : stitcodingChallenge** <br/>
**Table name : users** <br/>

# Api Design:
All the request type are JSON and response type are JSON expect the getEvents. getEvents will return Array of JSON <br/>  

NOTE: After login put token in authorization tab in postman 
Use Type = bearer token, put token and click on Preview request.
Now you can call setPreferences and getEvents. Otherwise, you will get  the error invalid token <br/>

- **`/register:` **<br/>
&nbsp;**`Method`**: `POST`<br/>
&nbsp; **`Body`**:
```json
{
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
}
```
&nbsp; **`Response`**:
`on Success` : 
```json
{ 
	"message":"User is added to database" 
}
```
&nbsp;**`error`** :
&nbsp;&nbsp;`if username is already taken :` <br/>
```json
{  
	"message": "Username \"vrajesh978\" is already taken”
}
```
&nbsp;&nbsp;`If any one of the required field is empty:` <br/>
```json
{
	"message": "User validation failed: preferences: Path `preferences` is required., lastName: Path `lastName` is required., firstName: Path `firstName` is required., hash: Path `hash` is required., username: Path `username` is required."
}
```

- **`/login`:** <br/>
&nbsp;**`Method`**`: POST` <br/>
&nbsp; **`Body :`** <br/> 
```json
{
	"username":"vrajesh978",
	"password" : "Vrajesh@978"
}
```
&nbsp; **`Response:`**
&nbsp;**`OnSuccess`**: `json response →  user’s details and token for the user so that user can make other api calls using that token.`
&nbsp;**`OnError`** : 
&nbsp;&nbsp;`If username or password is wrong:` 
```json
{
    "message": "Username or password is incorrect"
}
```
- **`/getEvents`**: <br/>
&nbsp;**`Method`**`: GET` <br/>
**Requires token to call this method** <br/>
**`Body`** `: no body needed since user has set the preferences while registering to our system or user can set the preferences by calling the setPreferences/{id}.` <br/>
&nbsp;**`Response:`**
&nbsp;**`onSuccess`: `Array of the JSON response from the API https://yv1x0ke9cl.execute-api.us-east-1.amazonaws.com/prod/events
If the user has more than one preferences, it will fetch the events from the above API endpoint and return the array of the JSON response.
Array[0] contains the first preference data, array[1] contains second preference data and so on.`** <br/>
&nbsp;**`onError: Json response from the API`**
&nbsp;&nbsp;`If token is missing :`
```json
{
	"message":"invalid token"
}
```

- `/setPreferences/{id}`: <br/>
&nbsp;`Method: PUT` <br/>
**Requires token to call this method** <br/>
`Body:`  
```json
{
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
}
```

&nbsp;**`Response (json):`** <br/>
**`onSuccess:`** <br/>
 ```json
 {
  "message": "user has setPreferences"
}
```
**`onError:`** <br/>
 `If token is missing :`
```json
{
	"message":"invalid token"
}
```




