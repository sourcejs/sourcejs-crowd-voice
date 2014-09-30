Crowd Voice
===============

Crowd Voice [SourceJS](http://sourcejs.com) plugin for adding user custom info on spec page from browser.

![Crowd Voice](https://monosnap.com/image/5Kh7zC879twOFA0Q8YzqcsDKnHvwIZ.png)

___

To install, run npm in `sourcejs/user` folder:

```
npm install sourcejs-crowd-voice --save
```

Then run Grunt update in SourceJS root:

```
cd sourcejs
grunt update
```

After installation, all your Specs pages will have "Add description" tumbler in inner menu, that will active the plugin.

## Dependencies

### [MongoDB](http://www.mongodb.org/)

Install it, run locally or remotely and configure your SourceJS in `/user/options.js`:

```
core: {
  "production": {
    "host": "mongo-db.host",
    "dbName": "mongo-db.name"
  },
  ...
}
```

## Updates

**0.3.0** release:
 - markdown syntax support based on [Pagedown converter](https://code.google.com/p/pagedown/);
 - migratation from CouchDB to MongoDB;
 - some design improvements

___

Compatible with SourceJS v0.4+, for v0.3.* use [previous release](https://github.com/sourcejs/sourcejs-crowd-voice/archive/v0.1.0.zip).
