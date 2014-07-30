module.exports = function(grunt) {
    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Tasks
    grunt.initConfig({
        uglify: {
            main: {
                files: {
                    'assets/index.js': [
                        'assets/lib/*.js'
                    ]
                }
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

        watch: {
            main: {
                files: [
                    'assets/js/lib/*.js'
                ],
                tasks: ['uglify:main'],
                options: {
                    nospawn: true
                }
            },
            styles: {
                files: ['assets/css/less/*.less'],
                tasks: ['less'],
                options: {
                    nospawn: true
                }
            }
        }
    });
    grunt.registerTask('runWatch', ['watch']);
    grunt.registerTask('default', ['uglify:main','less']);

};
