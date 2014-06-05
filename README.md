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

**IMPORTANT NOTE:** The task is opinionated in that it assumes you are working on a local machine and pushing/pulling databases from/to that location. Thus it is imperative that you define a `local` target as part of your configuration.


### Available Tasks

The Plugin makes two new tasks available via Grunt. These are `db_pull` and `db_push`. The interface for both commands is identical:

````grunt db_pull --target="%%TARGET%%" // replace %%TARGET%% with the target you've defined in your config ````

There is a single argument `--target` that is required each time you run either command.

#### Task: db_push

The `db_push` command moves your **local** database to a **remote** database location. The following process is observed:

1. Takes a dump of your local database
2. Runs a search and replace on the local dump file
3. Backups up the target database (remote)
4. Imports the local dump into the target database

The `target` argument represents the remote target to which you wish to push your database.

````grunt db_push --target="develop"````

#### Task: db_pull

The `db_pull` command pulls a **remote** database into your **local** environment. The following process is observed:

1. Takes a dump of the remote database
2. Runs a search and replace on the dump file
3. Backups up your local database
4. Imports the remote dump into your local database

The `target` argument represents the remote target whose database you wish to pull into your local environment. Eg:

````grunt db_pull --target="stage"````


### Usage

#### Local Target (required)
As above, the Plugin task is opinionated. It *expects* that you are working locally and pushing/pulling from/to that location.

As a result, it is essential that you define a *single* target *without* an `ssh_host` parameter. This is typically named "local" for convenience.

```js
"local": {
  "title": "Local",
  "database": "local_db_name",
  "user": "local_db_username",
  "pass": "local_db_password",
  "host": "local_db_host",
  "url": "local_db_url"
  // note that the `local` target does not have an "ssh_host"
},
```

The task will assume that this target is equivilant to your `local` environment. You can call it anything you wish but it ***must not*** have an `ssh_host` parameter.

#### Other Environment Targets
All other targets *must* contain a valid `ssh_host` parameter.

```js
"develop": {
  "title": "Development",
  "database": "development_db_name",
  "user": "development_db_username",
  "pass": "development_db_password",
  "host": "development_db_host",
  "url": "development_db_url",
  "ssh_host": "ssh_user@ssh_host"
},
"stage": {
  "title": "Stage",
  "database": "stage_db_name",
  "user": "stage_db_username",
  "pass": "stage_db_password",
  "host": "stage_db_host",
  "url": "stage_db_url",
  "ssh_host": "ssh_user@ssh_host"
},
"production": {
  "title": "Production",
  "database": "production_db_name",
  "user": "production_db_username",
  "pass": "production_db_password",
  "host": "production_db_host",
  "url": "production_db_url",
  "ssh_host": "ssh_user@ssh_host"
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
      "url": "local_db_url"
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
      "ssh_host": "ssh_user@ssh_host"
    },
    "stage": {
      "title": "Stage",
      "database": "stage_db_name",
      "user": "stage_db_username",
      "pass": "stage_db_password",
      "host": "stage_db_host",
      "url": "stage_db_url",
      "ssh_host": "ssh_user@ssh_host"
    },
    "production": {
      "title": "Production",
      "database": "production_db_name",
      "user": "production_db_username",
      "pass": "production_db_password",
      "host": "production_db_host",
      "url": "production_db_url",
      "ssh_host": "ssh_user@ssh_host"
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

#### url
Type: `String`
Description: the string to search and replace within the database before it is moved to the target location. Typically this is designed for use with systems such as WordPress where the `siteurl` value is [stored in the database](http://codex.wordpress.org/Changing_The_Site_URL) and is required to be updated upon migration to a new environment. It is however suitable for replacing any single value within the database before it is moved.

#### ssh_host
Type: `String`
Description: ssh connection string in the format `SSH_USER@SSH_HOST`. The task assumes you have ssh keys setup which allow you to remote into your server without requiring the input of a password. As this is an exhaustive topic we will not cover it here but you might like to start by reading [Github's own advice](https://help.github.com/articles/generating-ssh-keys).

### Options

#### options.backups_dir
Type: `String`
Default value: `backups`

A string value that represents the directory path (*relative* to your Grunt file) to which you want your database backups for source and target to be saved prior to modifications.

You may wish to have your backups reside outside the current working directory of your Gruntfile. In which case simply provide the relative path eg: ````../../backups````.

#### options.target

Type: `String`
Default value: ``

A string value that represents the default target for the tasks. You can easily override it using the `--target` option

## Troubleshooting

### Deploying to cPanel servers

In some cases, you may receive this error:
```
stdin: is not a tty
```
To fix this go to the etc/ folder and edit the bashrc file.

If you have a line that reads:
```
mesg y
```
Comment it out, and this should get rid of the error.

If you do not see mesg y in your bashrc file, place the following into it and save:
```
if `tty -s`; then
 mesg n
fi
```


### MAMP & Local Stacks

If you are using MAMP, AMPPS or other local stacks you may run into a couple of errors. This happens because MySQL is not in the expected server directory for these applications. 
This issue can produce errors such as:
```
ERROR 1064 (42000) at line 1: You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near '/bin/sh: mysqldump: command not found' at line 1
```
```
/bin/sh command not found
```

There are two ways to point to the correct directory for MAMP's MySQL. 

1. Create a symlink for mysql & mysqldump
2. Export the path in .bash_profile

#### Symlink on OSX

First, confirm the path to mysql within your local stack.
You'll then open the terminal and enter:
```
sudo ln -s /Applications/MAMP/Library/bin/mysqldump /usr/local/bin/mysqldump
```
& then:

```
sudo ln -s /Applications/MAMP/Library/bin/mysql /usr/local/bin/mysql
```

The path used above is an example for MAMP. Be sure that the first path is correct, and that it contains mysql & mysqldump on your system.

#### Bash Profile on OSX

First, confirm the directory within your local stack that contains mysql.

1. In the terminal, cd to ~/
2. List out the directory to check for a .bash_profile file
3. If you do not have one, run:
```
touch .bash_profile
```
to create the file.
4. You now need to edit the file. You can do this any number of ways, through vim, nano or your own choice of editor. I will use nano as the example here. Enter:
```
nano .bash_profile
```

4. Add the following (substituting your specific path to mysql - this example is for MAMP) to the .bash_profile file:
```
export PATH=$PATH:/Applications/MAMP/Library/bin
```
Then save and exit the editor (in nano by pressing CTRL+O, and CTRL+X) then restart the terminal.

## Contributing

Contributions to this plugin are most welcome. This is very much a Alpha release and so if you find a problem please consider raising a pull request or creating a Issue which describes the problem you are having and proposes a solution.

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

* 2013-11-12   v0.2.0   Fix escaping issues, ability to define `target` via options, README doc fixes, pass host param to mysqldump.
* 2013-06-11   v0.1.0   Minor updates to docs including addtion of Release History section.
* 2013-06-11   v0.0.1   Initial Plugin release.
