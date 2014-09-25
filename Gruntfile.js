module.exports = function(grunt) {
    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Tasks
    grunt.initConfig({
        uglify: {
            main: {
                src: 'assets/lib/crowdvoice.js',
                dest:'assets/index.js'
            }
        },

        less: {
            development: {
                options: {
                    paths: ["assets/css/less"]
                },
                files: {
                    "assets/css/crowd-voice.css": "assets/css/less/crowdVoice.less"
                }
            }
        },

        autoprefixer: {
            options: {
                cascade: false,
                browsers: ['last 2 version']
            },
            main: {
                expand: true,
                flatten: true,
                src: 'assets/css/*.css',
                dest: 'assets/css/'
            }
        },

        watch: {
            main: {
                files: ['assets/lib/crowdvoice.js'],
                tasks: ['uglify'],
                options: {
                    nospawn: true
                }
            },
            styles: {
                files: ['assets/css/less/*.less','assets/css/*.css'],
                tasks: ['less','autoprefixer'],
                options: {
                    nospawn: true
                }
            }
        }
    });
    grunt.registerTask('runWatch', ['watch']);
    grunt.registerTask('default', ['uglify','less','autoprefixer']);

};
