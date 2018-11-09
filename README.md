TwiventGeo
==========

### Description
A visualization system build on Node.js for Twitter trends propagation and topic geotagging.

### Dependencies
* ejs: We use ejs as the default template engine. It's simple.
* express: The lightweight web framework we use.
* mongodb: All the tweets raw data are stored in MongoDB. Here we choose 
[node-mongodb-native](https://github.com/mongodb/node-mongodb-native) as the connect module. 
Since the raw json format of one tweet is too complex, we avoid using [mongoose](https://github.com/learnboost/mongoose/) 
to model it.
* socket.io: For passing some import data between client and server.

### Other Useful Libraries
* d3.js
* Leaflet
* Leaflet-heat
* Bootstrap 3.x

### Deploy
For deploying this project on some cloud application platforms, like [Heroku](https://www.heroku.com/). you can follow [this guide](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction). For restoring mongodb in cloud, [this article](https://devcenter.heroku.com/articles/mongolab) is helpful. *Don't forget to change your client socket host to your application host.*
