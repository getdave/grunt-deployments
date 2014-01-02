/**
 * Lo-Dash Template Helpers
 * http://lodash.com/docs/#template
 * https://github.com/gruntjs/grunt/wiki/grunt.template
 */
var tpls = {

	search_replace: "sed -i '' 's#<%= search %>#<%= replace %>#g' <%= path %>",

    backup_path: "<%= backups_dir %>/<%= env %>/<%= date %>/<%= time %>",

    mysql: "mysql -h <%= host %> -u <%= user %> -p<%= pass %> -P<%= port %> <%= database %>",

    ssh: "ssh <%= host %>",

    mysqldump: "mysqldump -h <%= host %> -u<%= user %> -p<%= pass %> -P<%= port %> <%= database %> <%= ignoreTables %>"
};


module.exports = tpls;