# Twig Test Server

A Twig rendering server, for testing twig files against a json data source. Simply drop a twig file and json file in the same directory and run the server to see the results.

By default the server runs on port 9999 and looks for index.twig and data.json in the current folder. You can overide these settings by passing in command line options:

`-t --template` [path-to-index-file]

`-d --data` [path-to-data-file]

`--port` [localhost-port]

## Installation

`npm install -g cmincarelli/twig-test-server`

## Usage

`tts [--port] ( [path] or [--template] [--data] )`

## Example

```bash
$ npm install -g cmincarelli/twig-test-server
$ tts --port 8888 . # Use 8888, look for default files in the current directory

$ tts ./data # look for default files in the data directory

$ tts -t ~/Documents/index.twig -d ~/Documents/data.json # Use file from ~/Documents
```

## Requires

###JSON File: [data.json]

A well formatted [JSON object](http://www.json.org/)

######  /data.json

```json
{ "foo": "bar" }
```

###Twig File: [index.twig]

A well formatted [Twig template](http://twig.sensiolabs.org/documentation)

###### /index.twig

```twig
<html>
<body>
	{{foo}}
</body>
</html>
```

##Notes for Windows users:

###Install NodeJS

See the instructions here: [https://desktop.github.com/](https://desktop.github.com/)

###Install GitHub Desktop

See the instructions here: [https://nodejs.org/en/download/](https://nodejs.org/en/download/)

###Open GitHub Shell

```bash
$ npm install -g cmincarelli/twig-test-server

$ tts -p 8888 ./data # Where data is a folder containing and index.twig and data.json file
```

***Comments, suggestions? Contact me!***

