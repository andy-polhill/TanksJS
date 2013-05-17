module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jasmine: {
			default : {
				options: {
					specs: ['spec/js/**/*.js'],
					template: require('grunt-template-jasmine-requirejs'),
					templateOptions: {
						requireConfig: {
							baseUrl:'./public/js',
							paths: {
								jquery: "lib/jquery",
								underscore: "lib/underscore",
								backbone: "lib/backbone",
								text: "lib/text",
								io : "/socket.io/socket.io",
								template: "../template"
							}
						}
					}
				}
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-jasmine');
};