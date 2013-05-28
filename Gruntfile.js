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
		},
		jshint: {		
			all: ['public/js/**/*.js'],
			options: {
				laxbreak : true
			}
		},
		clean: { 
			default: {
				src : ['target/*']
			}
		},
		copy: {
			default: {
				files: [{
						expand: true, 
						cwd: 'public/', 
						src: ['**/index.html'], 
						dest: 'target/'
					}, {
						expand: true, 
						cwd: 'public/', 
						src: ['**/server.js'], 
						dest: 'target/'
					}, {
						expand: true, 
						cwd: 'public/<%= pkg.paths.scriptsBase %>', 
						src: ['**/*'], 
						dest: 'target/<%= pkg.paths.scriptsBase %>'
					}, {
						expand: true, 
						cwd: 'public/<%= pkg.paths.cssBase %>', 
						src: ['**/*'], 
						dest: 'target/<%= pkg.paths.cssBase %>'
					}, {
						expand: true, 
						cwd: 'public/<%= pkg.paths.imagesBase %>', 
						src: ['**/*'], 
						dest: 'target/<%= pkg.paths.imagesBase %>'
				}]
			}
		},
		smushit: {
			default: {
				src: ['target/images/**/*.png', 'target/images/**/*.jpg']
			}
		},
		requirejs: {
			default: {
				options: {
					baseUrl: "public/js",
					name: "client",
					out: "target/js/client.js",
					mainConfigFile: "public/js/client.js"
				}
			}
		},
	});

	grunt.loadNpmTasks('grunt-contrib-clean');	
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-smushit');
	
	grunt.registerTask('test', ['jshint', 'jasmine']);
	grunt.registerTask('build', ['clean', 'jasmine', 'copy', 'requirejs', 'smushit']);
};