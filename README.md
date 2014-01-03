# Grunt (MYSQL) Database Deployments

> Push/pull MYSQL databases from one location to another using Grunt. Designed to ease the pain of migrating databases from one environment (local) to another environment (remotes). Automatically updates hardcoded siteurl references and backs up source and target before any modificaitions are made.

**IMPORTANT NOTE**: the authors of this Plugin assume **no responsibility** for any actions which result from the usage of this script. You use it entirely *at your own risk*. It is *strongly* recommended that you test the script in a non-critical environment prior to rolling out for production use. *Always* manually backup your local and remote databases before using the script for the first time. No support can be provided for critical situations.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-deployments --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-deployments');
```

## Documentation

### Overview
In your project's Gruntfile, add a section named `deployments` to the data object passed into `grunt.initConfig()`.

The task expects a series of `targets`, one for each of the locations which you want to move the database to/from.

```js
grunt.initConfig({
  deployments: {
    local: {

    },
    my_target_1: {

    },
    my_target_2: {

    },
    // etc
  }
});
```

**UPDATE:** The task was originally opinionated in that it once assumed you were working on a local machine and pushing/pulling databases from/to that location. Therefore it *was* imperative that you defined a `local` target as part of your configuration. The task has now been updated to allow you to avoid having to utilise a "local" target. We still advise however, that you define a "local" target as a fallback.

Please ensure you read the full Configuration documentation below before proceeding.


### Available Tasks

The Plugin makes use of a **single** task `db_pull`. The interface for this command is as follows:

````grunt db_pull````

There are two flags that should be used each time you run either command:

* `--src` - the source database from which you wish to export your SQL
* `--dest` - the destination database into which you would like to import your SQL

#### Example

````grunt db_pull --src="%%SOURCE_DB%%" --dest="%%DESTINATION_DB%%"````

__Note:__ only `src` is required. If `dest` is not provided the task will automatically assume you wish to use the `local` target defined in your Grunt task configuration. This is for ease of use and also to maintain backwards compatibility with the older CLI.

### Configuration

#### Local Target (required)
Whilst the Plugin task (no longer) forces you to define a "local" target, we still advise that you always define one. This is because the `local` target will be used as the default destination if one is not explicity provided.

Your local target should not require a `ssh_host` parameter and, to avoid complication, should be named exactly as `"local"`.

```js
"local": {
  "title": "Local",
  "database": "local_db_name",
  "user": "local_db_username",
  "pass": "local_db_password",
  "host": "local_db_host",
  "url": "local_db_url",
  "ignoreTables": ["table1","table2",...]
  // note that the `local` target does not have an "ssh_host"
},
```

Again, the "local" target ***must not*** have an `ssh_host` parameter.

#### Other Environment Targets
All other targets may contain valid ssh credentials.

```js
"develop": {
  "title": "Development",
  "database": "development_db_name",
  "user": "development_db_username",
  "pass": "development_db_password",
  "host": "development_db_host",
  "url": "development_db_url",
  "ssh_user": "ssh_user", // UPDATE: user/host now defined separately
  "ssh_host": "ssh_host", // UPDATE: user/host now defined separately
  "ignoreTables": ["table1","table2",...]
},
"stage": {
  "title": "Stage",
  "database": "stage_db_name",
  "user": "stage_db_username",
  "pass": "stage_db_password",
  "host": "stage_db_host",
  "url": "stage_db_url",
  "ssh_user": "ssh_user", // UPDATE: user/host now defined separately
  "ssh_host": "ssh_host", // UPDATE: user/host now defined separately
  "ignoreTables": ["table1","table2",...]
},
"production": {
  "title": "Production",
  "database": "production_db_name",
  "user": "production_db_username",
  "pass": "production_db_password",
  "host": "production_db_host",
  "url": "production_db_url",
  "ssh_user": "ssh_user", // UPDATE: user/host now defined separately
  "ssh_host": "ssh_host", // UPDATE: user/host now defined separately
  "ignoreTables": ["table1","table2",...]
}
```

#### Full Usage Example

The structure below represents an typical usage example for the task configuration. Obviously you should replace the placeholders with your own database/environment configurations.

```js
grunt.initConfig({
  deployments: {
    options: {
      // any should be defined options here
    },
    // "Local" target
    "local": {
      "title": "Local",
      "database": "local_db_name",
      "user": "local_db_username",
      "pass": "local_db_password",
      "host": "local_db_host",
      "url": "local_db_url",
      "ignoreTables": ["table1","table2",...]
      // note that the `local` target does not have an "ssh_host"
    },
    // "Remote" targets
    "develop": {
      "title": "Development",
      "database": "development_db_name",
      "user": "development_db_username",
      "pass": "development_db_password",
      "host": "development_db_host",
      "url": "development_db_url",
      "ssh_host": "ssh_user@ssh_host",
      "ignoreTables": ["table1","table2",...]
    },
    "stage": {
      "title": "Stage",
      "database": "stage_db_name",
      "user": "stage_db_username",
      "pass": "stage_db_password",
      "host": "stage_db_host",
      "url": "stage_db_url",
      "ssh_host": "ssh_user@ssh_host",
      "ignoreTables": ["table1","table2",...]
    },
    "production": {
      "title": "Production",
      "database": "production_db_name",
      "user": "production_db_username",
      "pass": "production_db_password",
      "host": "production_db_host",
      "url": "production_db_url",
      "ssh_host": "ssh_user@ssh_host",
      "ignoreTables": ["table1","table2",...]
    }
  },
})
```

### Configuration

Each target expects a series of configuration options to be provided to enable the task to function correctly. These are detailed below:

#### title
Type: `String`
Description: A proper case name for the target. Used to describe the target to humans in console output whilst the task is running.

#### database
Type: `String`
Description: the name of the database for this target.

#### user
Type: `String`
Description: the database user with permissions to access and modify the database

#### pass
Type: `String`
Description: the password for the database user (above)

#### host
Type: `String`
Description: the hostname for the location in which the database resides. Typically this will be `localhost`

#### port
Type: `Integer`
Description: the port that MySQL is running on. Defaults to `3306`

#### url
Type: `String`
Description: the string to search and replace within the database before it is moved to the target location. Typically this is designed for use with systems such as WordPress where the `siteurl` value is [stored in the database](http://codex.wordpress.org/Changing_The_Site_URL) and is required to be updated upon migration to a new environment. It is however suitable for replacing any single value within the database before it is moved.

#### ssh_user
Type: `String`
Description: any valid ssh user. The task assumes you have ssh keys setup which allow you to remote into your server without requiring the input of a password. As this is an exhaustive topic we will not cover it here but you might like to start by reading [Github's own advice](https://help.github.com/articles/generating-ssh-keys).

#### ssh_host
Type: `String`
Description: any valid ssh host string ~~in the format `SSH_USER@SSH_HOST`~~. The task assumes you have ssh keys setup which allow you to remote into your server without requiring the input of a password. As this is an exhaustive topic we will not cover it here but you might like to start by reading [Github's own advice](https://help.github.com/articles/generating-ssh-keys).

#### ignoreTables
Type: `Array`
Description: a list of tables to ignore in array format. Tables defined here will be ommitted from the dump. Neither their structure nor their content will be included.

### Options

#### options.backups_dir
Type: `String`
Default value: `backups`

A string value that represents the directory path (*relative* to your Grunt file) to which you want your database backups for source and target to be saved prior to modifications.

You may wish to have your backups reside outside the current working directory of your Gruntfile. In which case simply provide the relative path eg: ````../../backups````.

#### options.target (deprecated)

*The task now requires `src` and `dest` parameters. If no `dest` is provided then the `local` target will be preffered.*

~~Type: `String`~~
~~Default value: ``~~

~~A string value that represents the default target for the tasks. You can easily override it using the `--target` option~~

## Contributing

Contributions to this plugin are most welcome. Pull requests are preferred but input on open Issues is also most agreeable!

I still consider this a Beta release and so if you find a problem please help me out by raising a pull request or creating a Issue which describes the problem you are having and proposes a solution.

### Testing
This project uses [Vows](http://vowsjs.org/) for BDD testing. Run the tests via Grunt using

````
grunt test
````

New features should pass all current tests and add new tests as required. Please feel free to contribute new/improved tests.



### Branches and merge strategy
All pull requests should merged into the `develop` branch. __Please do not merge into the `master` branch__.

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Update Guide

### v0.4.0

As of `v0.4.0` the task has received several major updates. If you have used an older version of the Plugin then it's really easy to upgrade. Please check the following:

1) You should only utilise the `db_pull` command. 
2) `--target` is no longer a valid CLI parameter. Instead please pass `--src` and `--dest` which match those defined in your Grunt config.
3) In your Grunt config, check that you have defined `ssh_user` and `ssh_host` separately. `ssh_host` is now only the actual hostname. The `ssh_user` option is provided separately to accept your SSH username (see docs),
4) You are no longer forced to utilise a "Local" target. However we still advise defining one (see docs).

If you notice any other issues please raise and issue or submit a valid pull request.

## Release History

* 2014-01-03   v0.4.0   Major updates to streamline task. See "Update Guide" above.
* 2013-12-09   v0.3.0   Added `ignoreTables` option.
* 2013-11-12   v0.2.0   Fix escaping issues, ability to define `target` via options, README doc fixes, pass host param to mysqldump.
* 2013-06-11   v0.1.0   Minor updates to docs including addtion of Release History section.
* 2013-06-11   v0.0.1   Initial Plugin release.
