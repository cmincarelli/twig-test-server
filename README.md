# Twig Test Server

A Twig rendering server, for testing twig files against a json data source. Simply drop a twig file and json file in the same directory and run the server to see the results.

By default the server runs on port 9999 and looks for index.twig and data.json in the current folder. You can overide these setting by passing in command line options:

`-t --template` [path-to-index-file]

`-d --data` [path-to-data-file]

`--port` [localhost-port]

#### Installation

`npm install -g cmincarelli/twig-test-server`

#### Usage

`twig-test-server [--port] ( [path] or [--template] [--data] )`

#### Example

```bash
$ npm install -g chrism-dp/twig-template-server
$ twig-test-server --port 8888 .
```

### Requires

**JSON File: [data.json]**

A well formatted json object.

```json
{ "foo": "bar" }
```

**Twig File: [index.twig]**

A well formatted TWIG template.

```twig
<html>
<body>
	{{Foo}}
</body>
</html>
```

Comments, suggests? Contact me!

