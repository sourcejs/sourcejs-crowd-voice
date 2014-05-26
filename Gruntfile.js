module.exports = function(grunt) {
    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Tasks
    grunt.initConfig({
//        uglify: {
//            main: {
//                files: {
//                    'js/crowdVoice.js': [
//                        'js/lib/*.js'
//                    ]
//                }
//            }
//        },

        concat: {
            main: {
                files: {
                    'js/crowdVoice.js': [
                        'js/lib/*.js'
                    ]
                }
            }
        },

        watch: {
            main: {
                files: [
                    'js/crowdVoice.js',
                    'js/lib/main.js',
                    'js/lib/test.js'
                ],
                tasks: ['uglify:main'],
                options: {
                    nospawn: true
                }
            }
        }
    });
    grunt.registerTask('runWatch', ['watch']);
    grunt.registerTask('default', ['concat:main']);

};
