/*
 *
 * Crowd Voice - Sourcejs plugin for adding user custom info on spec page from browser.
 *
 * @author Robert Haritonov (http://rhr.me)
 *
 * */
"use strict";

define([
    'jquery',
    'sourceModules/module',
    'sourceModules/utils',
    'sourceModules/sections',
    'sourceModules/css',
    'sourceModules/innerNavigation'
], function ($, module, utils, sections, Css, innerNavigation) {

    function CrowdVoice() {
        var _this = this;

        var moduleCss = new Css("sourcejs-crowd-voice/css/crowd-voice.css");

        this.options.pluginsOptions.crowdVoice = $.extend(true, {

            crowdVoiceData: [],

            specPath: utils.getPathToPage(),

            RES_MENU_TOGGLER: "Add description",
            RES_UPDATE_TEXT: "Update",
            RES_DELETE_TEXT: "Delete",
            RES_TXT_PLACEHOLDER: "Add text...",

            RES_UPDATED: "Data successfully updated",
            RES_UPDATE_ERR: "Data update failed",

            CLASS_SECTION: 'crowd-voice_section',
            MOD_SECTION_EDIT: '__edit-mode',

            CLASS_TEXT: 'crowd-voice_text',

            CLASS_TEXT_ADD: 'crowd-voice_text-add',
            CLASS_MOD_TEXT_ADD_STATUS: '__status-',

            CLASS_TEXT_ADD_DATA: 'crowd-voice_text-add_txt',
            CLASS_TEXT_ADD_STATUS: 'crowd-voice_text-add_status',
            CLASS_TEXT_ADD_DELETE: 'crowd-voice_text-add_delete',

            CLASS_TEXT_SEND: 'crowd-voice_text-add_send',

            CLASS_TOGGLER: 'crowd-voice_toggler',

            domInited: false,
            formInited: false,

            converter: new Markdown.Converter()


        }, this.options.pluginsOptions.crowdVoice);

        $(function(){
            _this.init();
        });
    }

    CrowdVoice.prototype = module.createInstance();
    CrowdVoice.prototype.constructor = CrowdVoice;

    CrowdVoice.prototype.init = function () {
        var _this = this,
            domInited = _this.options.pluginsOptions.crowdVoice.domInited;

        if (!domInited) {
            _this.getData();
        }

        _this.addMenuItem();
    };

    CrowdVoice.prototype.getData = function() {
        var _this = this;

        $.ajax({
            url: '/getCrowdVoice',
            //dataType: 'jsonp',
            jsonpCallback: 'callback',
            context: _this,
            data: {
                pathToDataFile: _this.getPathToSpec()
            },
            success: function(data){
                this.setCrowdVoiceData(data);
                this.initDOM();
            },
            error: function(error, message){
                console.log(error, message);
            }
        });

        _this.options.pluginsOptions.crowdVoice.domInited = true;
    };

    CrowdVoice.prototype.setCrowdVoice = function(data, callback, errorHandler) {
        var _this = this;

        $.extend(data, {pathToDataFile:_this.getPathToSpec()});

        $.when(
            $.ajax({
                url: '/setCrowdVoice',
                //dataType: 'jsonp',
                jsonpCallback: 'callback',
                timeout: 4000,
                context: _this,
                data: data,

                success: function(data) {
                    console.log('setDescription success!')
                }
            })
        )
            .done(function(){
                if (callback && typeof callback == 'function') callback();
            })
            .fail(function( data ) {
                if (errorHandler && typeof errorHandler == 'function') errorHandler(data);
            });
    };

    CrowdVoice.prototype.getPathToSpec = function () {
        var _this = this,
            uri = _this.options.pluginsOptions.crowdVoice.specPath;

        return uri+'/';
    };

    CrowdVoice.prototype.addMenuItem = function () {
        var _this = this,
            RES_MENU_TOGGLER = this.options.pluginsOptions.crowdVoice.RES_MENU_TOGGLER,
            CLASS_TOGGLER = this.options.pluginsOptions.crowdVoice.CLASS_TOGGLER;

        innerNavigation.addMenuItem(RES_MENU_TOGGLER, function(){
            _this.turnEditMoteON();
        }, function(){
            _this.turnEditModeOFF();
        }, CLASS_TOGGLER);
    };

    CrowdVoice.prototype.setCrowdVoiceData = function (data) {
        var _this = this;

        _this.options.pluginsOptions.crowdVoice.crowdVoiceData = data;

        console.log(_this.options.pluginsOptions.crowdVoice.crowdVoiceData);

    };

    CrowdVoice.prototype.pushCrowdVoiceData = function (description) {
        var _this = this;

        _this.options.pluginsOptions.crowdVoice.crowdVoiceData.push(description);
    };

//    CrowdVoice.prototype.getCrowdVoiceData = function () {
//        return this.options.pluginsOptions.crowdVoice.crowdVoiceData;
//    };

    //fn([data to insert as description text])
    CrowdVoice.prototype.initDOM = function (txtData) {
        var _this = this,

            dfd = new $.Deferred(),

            CLASS_TEXT = _this.options.pluginsOptions.crowdVoice.CLASS_TEXT,
            CLASS_TEXT_ADD_DATA = _this.options.pluginsOptions.crowdVoice.CLASS_TEXT_ADD_DATA,
            CLASS_TEXT_SEND = this.options.pluginsOptions.crowdVoice.CLASS_TEXT_SEND,
            CLASS_TEXT_ADD_DELETE = this.options.pluginsOptions.crowdVoice.CLASS_TEXT_ADD_DELETE,

            RES_UPDATE_TEXT = this.options.pluginsOptions.crowdVoice.RES_UPDATE_TEXT,
            RES_DELETE_TEXT = this.options.pluginsOptions.crowdVoice.RES_DELETE_TEXT,
            RES_TXT_PLACEHOLDER = this.options.pluginsOptions.crowdVoice.RES_TXT_PLACEHOLDER;

        require(['text!npmPlugins/sourcejs-crowd-voice/templates/submit-form.inc.html'], function(submitFormInc){

            var SECTION_CLASS = _this.options.SECTION_CLASS,
                CONVERTER = _this.options.pluginsOptions.crowdVoice.converter;

            //Inserting DOM before first section
            $('.'+SECTION_CLASS+':first').before(submitFormInc);

            //Init text
            $('.'+CLASS_TEXT_SEND).text(RES_UPDATE_TEXT);
            $('.'+CLASS_TEXT_ADD_DELETE).text(RES_DELETE_TEXT);
            $('.'+CLASS_TEXT_ADD_DATA).attr('placeholder',RES_TXT_PLACEHOLDER);

            //Push existing text to textarea
            if (_this.options.pluginsOptions.crowdVoice.crowdVoiceData.length != 0) {
                var txtData = _this.options.pluginsOptions.crowdVoice.crowdVoiceData[0].text;

                $('.'+CLASS_TEXT).html(CONVERTER.makeHtml(txtData));
                $('.'+CLASS_TEXT_ADD_DATA).val(txtData);
            }

            //Ready
            _this.options.pluginsOptions.crowdVoice.domInited = true;

            dfd.resolve();

        });

        return dfd.promise();

    };

    CrowdVoice.prototype.turnEditMoteON = function () {
        var _this = this,
            domInited = this.options.pluginsOptions.crowdVoice.domInited,
            formInited = this.options.pluginsOptions.crowdVoice.formInited,

            CLASS_SECTION = this.options.pluginsOptions.crowdVoice.CLASS_SECTION,
            MOD_SECTION_EDIT = this.options.pluginsOptions.crowdVoice.MOD_SECTION_EDIT;

        var turnOn = function(){
            $('.'+CLASS_SECTION).addClass(MOD_SECTION_EDIT);

            if (!formInited) {
                _this.formEvents();
            }
        };

        if (domInited) {
            //If plugin DOM inited, then activate form controls
            turnOn();
        } else {
            //Init DOM, then activate controls
            $.when( _this.initDOM() ).then(function(){
                turnOn();
            });
        }

    };

    CrowdVoice.prototype.turnEditModeOFF = function () {
        var _this = this,

            CLASS_SECTION = this.options.pluginsOptions.crowdVoice.CLASS_SECTION,
            MOD_SECTION_EDIT = this.options.pluginsOptions.crowdVoice.MOD_SECTION_EDIT;

        $('.'+CLASS_SECTION).removeClass(MOD_SECTION_EDIT);
        this.removeFormStatus();

    };

    CrowdVoice.prototype.formEvents = function () {
        var _this = this,

            CLASS_SECTION = _this.options.pluginsOptions.crowdVoice.CLASS_SECTION,
            LINK_CLASS_SECTION = $('.'+CLASS_SECTION),

            CLASS_TEXT = _this.options.pluginsOptions.crowdVoice.CLASS_TEXT,

            CLASS_TEXT_ADD = this.options.pluginsOptions.crowdVoice.CLASS_TEXT_ADD,
            LINK_CLASS_TEXT_ADD = $('.'+CLASS_TEXT_ADD),

            CLASS_TEXT_ADD_DATA = this.options.pluginsOptions.crowdVoice.CLASS_TEXT_ADD_DATA,
            LINK_CLASS_TEXT_ADD_DATA = $('.'+CLASS_TEXT_ADD_DATA),

            CLASS_TEXT_SEND = this.options.pluginsOptions.crowdVoice.CLASS_TEXT_SEND,

            CLASS_TEXT_ADD_DELETE = this.options.pluginsOptions.crowdVoice.CLASS_TEXT_ADD_DELETE,

            CONVERTER = this.options.pluginsOptions.crowdVoice.converter;

        LINK_CLASS_TEXT_ADD.submit(function(e) {
            e.preventDefault();

            var txtData = LINK_CLASS_TEXT_ADD_DATA.val();

            $('.'+CLASS_TEXT_SEND).attr('disabled', 'disabled');

            _this.pushCrowdVoiceData({
                text: txtData
            });

            var descr = {
                specURI: _this.getPathToSpec(),
                text: txtData
            };

            _this.setCrowdVoice(
                descr,
                function(){
                    $('.'+CLASS_TEXT_SEND).removeAttr('disabled', 'disabled');
                    $('.'+CLASS_TEXT).html(CONVERTER.makeHtml(txtData));
                },
                function(data){
                    $('.'+CLASS_TEXT_SEND).removeAttr('disabled', 'disabled');
                    _this.updateStatus('fail');
                }
            );

        });

        var CLASS_MOD_TEXTAREA_FOCUSED = '__textarea-focused';

        LINK_CLASS_TEXT_ADD_DATA.autosize();

        LINK_CLASS_TEXT_ADD_DATA.on('focus',function() {
            LINK_CLASS_SECTION.addClass(CLASS_MOD_TEXTAREA_FOCUSED);
        });

        LINK_CLASS_TEXT_ADD_DATA.on('blur',function() {
            LINK_CLASS_SECTION.removeClass(CLASS_MOD_TEXTAREA_FOCUSED);
        });

        LINK_CLASS_TEXT_ADD_DATA.on('keydown',function(e){

            var e = e || window.event,
                key = e.keyCode || e.which,
                txtData = LINK_CLASS_TEXT_ADD_DATA[0];

            this.getCaretPosition = function() {
                return this.selectionStart;
            }

            this.setCaretPosition = function(position) {
                this.selectionStart = position;
                this.selectionEnd = position;
                this.focus();
            }

            //tab support
            if (key == 9) {
                var newCaretPosition = txtData.getCaretPosition() + "    ".length;
                txtData.value = txtData.value.substring(0, txtData.getCaretPosition()) + "    " + txtData.value.substring(txtData.getCaretPosition(), txtData.value.length);
                txtData.setCaretPosition(newCaretPosition);
                return false;
            }

            //backspace must remove one tab at a time
            if (key == 8) {
                if (txtData.value.substring(txtData.getCaretPosition() - 4, txtData.getCaretPosition()) == "    ") {
                    var newCaretPosition = txtData.getCaretPosition() - 3;
                    txtData.value = txtData.value.substring(0, txtData.getCaretPosition() - 3) + txtData.value.substring(txtData.getCaretPosition(), txtData.value.length);
                    txtData.setCaretPosition(newCaretPosition);
                }
            }
        });

        $('.'+CLASS_TEXT_ADD_DELETE).on('click', function(e){
            e.preventDefault();
            var CLASS_TOGGLER = _this.options.pluginsOptions.crowdVoice.CLASS_TOGGLER;

            $.ajax({
                url: '/removeCrowdVoice',
                //dataType: 'jsonp',
                jsonpCallback: 'callback',
                data: {
                    pathToDataFile: _this.getPathToSpec()
                },

                success: function(data) {
                    console.log(data + 'after remove');
                    $('.'+CLASS_TEXT).text('');
                    _this.turnEditModeOFF();
                    innerNavigation.toggleMenuItem(CLASS_TOGGLER);
                },

                fail: function() {
                    _this.updateStatus('fail');
                }
            });

        });

        this.options.pluginsOptions.crowdVoice.formInited = true;

    };

    //fn('success' || 'fail')
    CrowdVoice.prototype.updateStatus = function (status) {
        var updateStatus = status,

            RES_UPDATED = this.options.pluginsOptions.crowdVoice.RES_UPDATED,
            RES_UPDATE_ERR = this.options.pluginsOptions.crowdVoice.RES_UPDATE_ERR,

            CLASS_TEXT_ADD = this.options.pluginsOptions.crowdVoice.CLASS_TEXT_ADD,
            LINK_CLASS_TEXT_ADD = $('.'+CLASS_TEXT_ADD),

            CLASS_MOD_TEXT_ADD_STATUS = this.options.pluginsOptions.crowdVoice.CLASS_MOD_TEXT_ADD_STATUS,

            CLASS_TEXT_ADD_STATUS = this.options.pluginsOptions.crowdVoice.CLASS_TEXT_ADD_STATUS,

            statusText = '';

        //Removing modifiers
        this.removeFormStatus();

        //Adding status modifier
        var setMod = function() {
            LINK_CLASS_TEXT_ADD.addClass(CLASS_MOD_TEXT_ADD_STATUS + updateStatus);
        };

        switch (updateStatus) {
            case 'success':
                statusText = RES_UPDATED;

                //setTimoout needed fo CSS animation rerun
                setTimeout(function(){ setMod(); }, 0);

                break;

            default:
                statusText = RES_UPDATE_ERR;
                setMod();
        }

        $('.'+CLASS_TEXT_ADD_STATUS).text(statusText);

    };

    CrowdVoice.prototype.removeFormStatus = function () {
        var CLASS_TEXT_ADD = this.options.pluginsOptions.crowdVoice.CLASS_TEXT_ADD,
            LINK_CLASS_TEXT_ADD = $('.'+CLASS_TEXT_ADD),

            CLASS_MOD_TEXT_ADD_STATUS = this.options.pluginsOptions.crowdVoice.CLASS_MOD_TEXT_ADD_STATUS;

        var modifiers = LINK_CLASS_TEXT_ADD.attr("class").split(" ").filter(function(item) {
            return item.indexOf(CLASS_MOD_TEXT_ADD_STATUS) === -1 ? item : "";
        });
        LINK_CLASS_TEXT_ADD.attr("class", modifiers.join(" "));
    };

    return new CrowdVoice();

});