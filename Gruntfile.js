module.exports = function (grunt) {

	/*
		Grunt installation:
		-------------------
			npm install -g grunt-cli
			npm install -g grunt-init
			npm init (creates a `package.json` file)

		Project Dependencies:
		---------------------
			npm install grunt --save-dev
			npm install grunt-contrib-watch --save-dev
			npm install grunt-contrib-jshint --save-dev
			npm install grunt-contrib-uglify --save-dev
			npm install grunt-contrib-requirejs --save-dev
			npm install grunt-contrib-sass --save-dev
			npm install grunt-contrib-imagemin --save-dev
			npm install grunt-contrib-htmlmin --save-dev
			npm install grunt-contrib-connect --save-dev

		Simple Dependency Install:
		--------------------------
			npm install (from the same root directory as the `package.json` file)

		Gem Dependencies:
		-----------------
			gem install image_optim
	*/

	// Project configuration.
	grunt.initConfig({

		// Store your Package file so you can reference its specific data whenever necessary
		pkg: grunt.file.readJSON('package.json'),

		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> | <%= pkg.version %> | <%= grunt.template.today("yyyy-mm-dd") %> /\n'
			},
			dist: {
				src: './<%= pkg.name %>.js',
				dest: './<%= pkg.name %>.min.js'
			}
		},

		// Used to connect to a locally running web server (so Jasmine can test against a DOM)
		connect: {
			server:{
				options:{
					base:'./app/',
					port: process.env.PORT || 8000
				}
			}
		},

		jshint: {
			/*
				Note:
				In case there is a /release/ directory found, we don't want to lint that 
				so we use the ! (bang) operator to ignore the specified directory
			*/
			files: ['!Gruntfile.js', 'app/**/*.js', '!app/lib/*.js', '!app/release/**', 'modules/**/*.js', 'specs/**/*Spec.js'],
			options: {
				curly:   true,
				eqeqeq:  true,
				immed:   true,
				latedef: true,
				newcap:  true,
				noarg:   true,
				sub:     true,
				undef:   true,
				boss:    true,
				eqnull:  true,
				browser: true,

				globals: {
					// AMD
					module:     true,
					require:    true,
					requirejs:  true,
					define:     true,

					// Environments
					console:    true,

					// General Purpose Libraries
					$:          true,
					jQuery:     true,

					// Testing
					sinon:      true,
					describe:   true,
					it:         true,
					expect:     true,
					beforeEach: true,
					afterEach:  true
				}
			}
		},

		requirejs: {
			compile: {
				options: {
					baseUrl: './app',
					mainConfigFile: './app/main.js',
					dir: './app/release/',
					fileExclusionRegExp: /^\.|node_modules|Gruntfile|\.md|package.json/,
					// optimize: 'none',
					modules: [
						{
							name: 'main'
							// include: ['module'],
							// exclude: ['module']
						}
					]
				}
			}
		},

		sass: {
			dist: {
				options: {
					style: 'compressed',
					require: ['./app/styles/sass/helpers/url64.rb']
				},
				expand: true,
				cwd: './app/styles/sass/',
				src: ['*.scss'],
				dest: './app/styles/',
				ext: '.css'
			},
			dev: {
				options: {
					style: 'expanded',
					debugInfo: true,
					lineNumbers: true,
					require: ['./app/styles/sass/helpers/url64.rb']
				},
				expand: true,
				cwd: './app/styles/sass/',
				src: ['*.scss'],
				dest: './app/styles/',
				ext: '.css'
			}
		},

		// `optimizationLevel` is only applied to PNG files (not JPG)
		imagemin: {
			png: {
				options: {
					optimizationLevel: 7
				},
				files: [
					{
						expand: true,
						cwd: './app/images/',
						src: ['**/*.png'],
						dest: './app/images/compressed/',
						ext: '.png'
					}
				]
			},
			jpg: {
				options: {
					progressive: true
				},
				files: [
					{
						expand: true,
						cwd: './app/images/',
						src: ['**/*.jpg'],
						dest: './app/images/compressed/',
						ext: '.jpg'
					}
				]
			}
		},

		htmlmin: {
			dist: {
				options: {
					removeComments: true,
					collapseWhitespace: true,
					removeEmptyAttributes: true,
					removeCommentsFromCDATA: true,
					removeRedundantAttributes: true,
					collapseBooleanAttributes: true
				},
				files: {
					// Destination : Source
					'./app/release/about.html':'./app/about.html',
					'./app/release/index.html': './app/index.html'
				}
			}
		},

		// Run: `grunt watch` from command line for this section to take effect
		watch: {
			css:{
				files: '**/*.scss',
				tasks:'sass:dev',
				options:{
					livereload:false
				}
			},
			js:{
				files: ['<%= jshint.files %>', '<%= sass.dev.src %>'],
				tasks: 'jshint',
				options:{
					livereload:false
				}
			}
		}

	});

	// Load NPM Tasks
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-connect');

	// Default Task
	grunt.registerTask('default', ['jshint', 'connect', 'sass:dev']);

	grunt.registerTask('dev',['jshint','connect','sass:dev','watch']);

	// Unit Testing Task
	//grunt.registerTask('test', ['connect', 'jasmine:run']);

	// Release Task
	grunt.registerTask('release', ['jshint', 'requirejs', 'sass:dist', 'imagemin', 'htmlmin']);

};
