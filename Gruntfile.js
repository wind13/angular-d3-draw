module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        compass: {
            dist: {
                options: {
                    sassDir: 'src/scss',
                    cssDir: 'build/css',
                    environment: 'development',
                    outputStyle: 'compressed'
                }
            }
        },
        concat: {
            options: {
                separator: '\r\n'
            },
            dist: {
                src: ['src/directives/*.js', 'src/angular-d3-draw.js'],
                dest: 'src/angular-d3-draw-all.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/<%= pkg.name %>.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        },
        jshint: {
            files: ['gruntfile.js', 'src/*.js'],
            options: {
                globals: {
                    jQuery: true,
                    console: true,
                    module: true
                }
            }
        },
        karma: {
            /* chrome: {
              configFile: 'karma.conf.js'
            }, */
            //continuous integration mode: run tests once in PhantomJS browser.
            console: {
                configFile: 'karma.conf.js',
                singleRun: true,
                browsers: ['PhantomJS']
            }
        }
    });

    // Load the plugin that provides the "compass" task.
    grunt.loadNpmTasks('grunt-contrib-compass');
    // Load the plugin that provides the "concat" task.
    grunt.loadNpmTasks('grunt-contrib-concat');
    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    // Load the plugin that provides the "jshint" task.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    // Load the plugin that provides the "karma" task.
    grunt.loadNpmTasks('grunt-karma');

    // Default task(s).
    grunt.registerTask('default', ['compass', 'concat', 'uglify', 'jshint', 'karma']);

    // A very basic default task.
    // grunt.registerTask('default', 'Log some stuff.', function() {
    //  grunt.log.write('Logging some stuff...').ok();
    // });


};
