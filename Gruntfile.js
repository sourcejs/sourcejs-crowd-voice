module.exports = function(grunt) {
    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Tasks
    grunt.initConfig({
        uglify: {
            main: {
                files: {
                    'js/crowdVoice.js': [
                        'js/lib/*.js'
                    ]
                }
            }
        },

        less: {
            development: {
                options: {
                    paths: ["css/less"]
                },
                files: {
                    "css/crowd-voice.css": "css/less/crowdVoice.less"
                }
            }
        },

//        concat: {
//            main: {
//                files: {
//                    'js/crowdVoice.js': [
//                        'js/lib/*.js'
//                    ]
//                }
//            }
//        },

        watch: {
            main: {
                files: [
                    'js/lib/*.js'
                ],
                tasks: ['uglify:main'],
                options: {
                    nospawn: true
                }
            },
            styles: {
                files: ['css/less/*.less'],
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
