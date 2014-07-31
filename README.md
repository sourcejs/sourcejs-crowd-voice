Crowd Voice
===============

Crowd Voice [SourceJS](http://sourcejs.com) plugin for adding user custom info on spec page from browser.

![image](http://d.pr/i/ahq4+)

To install, run npm in `sourcejs/user` folder:

```
npm install git://github.com/sourcejs/sourcejs-crowd-voice --save
```

Then run Grunt update in SourceJS root:

```
cd sourcejs
grunt update
```

After installation, all your Specs pages will have "Add description" tumbler in inner menu, that will active the plugin.

## Dependencies

### [CouchDB](http://couchdb.apache.org/)

Install it, run locally or remotely and configure your SourceJS in `/user/options.js`:

```
assets: {
  modulesOptions: {
    couch: {
      server: 'http://couch-db.url:5984'
    },
  }
}
```

Compatible with SourceJS v0.4+, for v0.3.* use [previous release](https://github.com/sourcejs/sourcejs-crowd-voice/archive/v0.1.0.zip).