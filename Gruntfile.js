module.exports = function (grunt) {

    grunt.initConfig({
        pkg:grunt.file.readJSON('package.json'),
        vars:{
            destdir: 'www-root',
            destappjs: 'gapp.js',
            destcss: 'style.css'
        },
        jshint:{
            options: {
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true
                }
            },
            gruntfile: ['Gruntfile.js'],
            appjs:['assets/js/**/*.js']
        },
        concat:{
            appjs:{
                src:'<%= jshint.appjs %>',
                dest:'<%= vars.destdir %>/assets/js/gapp.js'
            }
        },
        uglify: {
            appjs: {
                files: {
                    '<%= vars.destdir %>/assets/js/<%= vars.destappjs %>': ['<%= jshint.appjs %>']
                }
            }
        },
        cssmin: {
            combine: {
                files: {
                    '<%= vars.destdir %>/assets/css/<%= vars.destcss %>': ['assets/css/*.css']
                }
            }
        },
        copy:{
            main:{
                files:[
                    {src:['assets/css/*'], dest:'<%= vars.destdir %>/'},
                    {src:['index.html'], dest:'<%= vars.destdir %>/'}
                ]
            }
        },
        watch:{
            files:['<%= jshint.gruntfile %>','<%= jshint.appjs %>', 'index.html'],
            tasks:['jshint', 'concat', 'copy']
        },
        connect:{
            server:{
                options:{
                    port:4000,
                    base:'./<%= vars.destdir %>'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // Default task.
    grunt.registerTask('default', ['jshint', 'concat', 'copy']);
    grunt.registerTask('prod', ['jshint', 'uglify', 'copy', 'cssmin']);
    grunt.registerTask('live', ['connect', 'watch']);

};