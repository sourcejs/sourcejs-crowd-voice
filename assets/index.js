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
    'sourceModules/innerNavigation',

    'sourceModules/couch'
    ], function ($, module, utils, sections, Css, innerNavigation, couch) {

    function CrowdVoice() {
        var _this = this;

        var moduleCss = new Css("/node_modules/sourcejs-crowd-voice/assets/css/crowd-voice.css");

        this.options.pluginsOptions.crowdVoice = $.extend(true, {

            remoteDB: 'crowd-voice',
            remoteSpecDataField: 'voice-spec',
            remoteSectionDataField: 'voice-section',

            remoteObj: {},

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
            formInited: false


        }, this.options.pluginsOptions.crowdVoice);

        $(function(){
            _this.init();
        });
    }

    CrowdVoice.prototype = module.createInstance();
    CrowdVoice.prototype.constructor = CrowdVoice;

    CrowdVoice.prototype.init = function () {
        var _this = this;

        this.initDB(function(){
            _this.drawExisting();
            _this.addMenuItem();
        });

    };

    CrowdVoice.prototype.initDB = function (handler) {
        var _this = this,
            dbName = _this.options.pluginsOptions.crowdVoice.remoteDB,
            startingRemoteObj = {},
            specPath = utils.getPathToPage();

        $.when( couch.prepareRemote(dbName,startingRemoteObj,specPath) ).then(
            function(data) {

                _this.options.pluginsOptions.crowdVoice.remoteObj = data;

                handler();

            }
        );

    };

    CrowdVoice.prototype.drawExisting = function () {
        var _this = this,
            actualData = _this.options.pluginsOptions.crowdVoice.remoteObj,
            remoteSpecDataField = _this.options.pluginsOptions.crowdVoice.remoteSpecDataField,

            txtData = actualData[remoteSpecDataField];

        if (typeof txtData !== 'undefined' && txtData !== '') {
            _this.initDOM(txtData);
        }

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

    //fn([data to insert as description text])
    CrowdVoice.prototype.initDOM = function (inputData) {
        var _this = this,

            dfd = new $.Deferred(),

            txtData = inputData,

            CLASS_TEXT = _this.options.pluginsOptions.crowdVoice.CLASS_TEXT,
            CLASS_TEXT_ADD_DATA = _this.options.pluginsOptions.crowdVoice.CLASS_TEXT_ADD_DATA,
            CLASS_TEXT_SEND = this.options.pluginsOptions.crowdVoice.CLASS_TEXT_SEND,
            CLASS_TEXT_ADD_DELETE = this.options.pluginsOptions.crowdVoice.CLASS_TEXT_ADD_DELETE,

            RES_UPDATE_TEXT = this.options.pluginsOptions.crowdVoice.RES_UPDATE_TEXT,
            RES_DELETE_TEXT = this.options.pluginsOptions.crowdVoice.RES_DELETE_TEXT,
            RES_TXT_PLACEHOLDER = this.options.pluginsOptions.crowdVoice.RES_TXT_PLACEHOLDER;

        require(['text!node_modules/sourcejs-crowd-voice/assets/templates/submit-form.inc.html'], function(submitFormInc){

            var SECTION_CLASS = _this.options.SECTION_CLASS;

            //Inserting DOM before first section
            $('.'+SECTION_CLASS+':first').before(submitFormInc);

            //Init text
            $('.'+CLASS_TEXT_SEND).text(RES_UPDATE_TEXT);
            $('.'+CLASS_TEXT_ADD_DELETE).text(RES_DELETE_TEXT);
            $('.'+CLASS_TEXT_ADD_DATA).attr('placeholder',RES_TXT_PLACEHOLDER);

            //Push existing text to textarea
            if (txtData !== 'undefined' && txtData !== '') {
                $('.'+CLASS_TEXT).text(txtData);
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

            dbName = _this.options.pluginsOptions.crowdVoice.remoteDB,
            actualData = _this.options.pluginsOptions.crowdVoice.remoteObj,
            remoteSpecDataField = _this.options.pluginsOptions.crowdVoice.remoteSpecDataField,

            CLASS_SECTION = _this.options.pluginsOptions.crowdVoice.CLASS_SECTION,
                LINK_CLASS_SECTION = $('.'+CLASS_SECTION),

            CLASS_TEXT = _this.options.pluginsOptions.crowdVoice.CLASS_TEXT,

            CLASS_TEXT_ADD = this.options.pluginsOptions.crowdVoice.CLASS_TEXT_ADD,
                LINK_CLASS_TEXT_ADD = $('.'+CLASS_TEXT_ADD),

                CLASS_TEXT_ADD_DATA = this.options.pluginsOptions.crowdVoice.CLASS_TEXT_ADD_DATA,
                    LINK_CLASS_TEXT_ADD_DATA = $('.'+CLASS_TEXT_ADD_DATA),

            CLASS_TEXT_SEND = this.options.pluginsOptions.crowdVoice.CLASS_TEXT_SEND,

            CLASS_TEXT_ADD_DELETE = this.options.pluginsOptions.crowdVoice.CLASS_TEXT_ADD_DELETE;

        LINK_CLASS_TEXT_ADD.submit(function(e) {
            e.preventDefault();

            var txtData = LINK_CLASS_TEXT_ADD_DATA.val();

            var updateRemoteData = {};
            updateRemoteData[remoteSpecDataField] = txtData;

            $('.'+CLASS_TEXT_SEND).attr('disabled', 'disabled');

            $.when( couch.updateRemote(dbName, actualData, updateRemoteData) ).then(
                function(data) {

                    $('.'+CLASS_TEXT_SEND).removeAttr('disabled', 'disabled');

                    //TODO: add markdown support
                    $('.'+CLASS_TEXT).text(txtData);
                    _this.updateStatus('success');

                }
            ).fail(function(){

                $('.'+CLASS_TEXT_SEND).removeAttr('disabled', 'disabled');

                _this.updateStatus('fail');

                //TODO: save text in textarea in case of database error
            });

        });

        var CLASS_MOD_TEXTAREA_FOCUSED = '__textarea-focused';

        //TODO: add autoresize
        LINK_CLASS_TEXT_ADD_DATA.on('focus',function() {
            LINK_CLASS_SECTION.addClass(CLASS_MOD_TEXTAREA_FOCUSED);
        });

        LINK_CLASS_TEXT_ADD_DATA.on('blur',function() {
            LINK_CLASS_SECTION.removeClass(CLASS_MOD_TEXTAREA_FOCUSED);
        });

        $('.'+CLASS_TEXT_ADD_DELETE).on('click', function(){
            var CLASS_TOGGLER = _this.options.pluginsOptions.crowdVoice.CLASS_TOGGLER;

            actualData[remoteSpecDataField]='';

            $.when( couch.updateRemote(dbName, actualData) ).then(
                function(data) {

                    $('.'+CLASS_TEXT).text('');
                    _this.turnEditModeOFF();

                    innerNavigation.toggleMenuItem(CLASS_TOGGLER);

                }
            ).fail(function(){
                _this.updateStatus('fail');
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
