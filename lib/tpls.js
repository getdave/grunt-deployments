/**
 * Lo-Dash Template Helpers
 * http://lodash.com/docs/#template
 * https://github.com/gruntjs/grunt/wiki/grunt.template
 */
var tpls = {

	search_replace: "node_modules/search-replace-db/srdb.cli.php -h <%= host %> -u <%= user %> -p <%= pass %> -n <%= database %> -s '<%= search %>' -r '<%= replace %>' -z",

	//search_replace: "sed -i '' 's#<%= search %>#<%= replace %>#g' <%= path %>",

    backup_path: "<%= backups_dir %>/<%= env %>/<%= date %>/<%= time %>",

    mysql: "mysql -h <%= host %> -u <%= user %> -p<%= pass %> -P<%= port %> <%= database %>",

    ssh: "ssh -p <%= port %> <%= user %>@<%= host %>",

    mysqldump: "mysqldump -h <%= host %> -u<%= user %> -p<%= pass %> -P<%= port %> <%= database %> <%= ignoreTables %>"
};


module.exports = tpls;