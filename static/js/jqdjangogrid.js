/*
 * The jqDjangoGrid is a jquery's plugin and django app to produce a datagrid easily.
 *
 * @link http://www.gustavohenrique.net/jqdjangogrid
 * @author Gustavo Henrique gustavo@gustavohenrique.net
 * @version 0.2
 *
 * @example:
 * $(function() {
 *    $('#datagrid_client').datagrid({
 *      'appLabel': 'client',
 *      'modelName': 'Client',
 *      'cols': {
 *          "pk": {"label": "", "width": "10px"},
 *          "name": {"label": "Nome", "width": "300px"},
 *      },
 *      'buttons': {
 *          "bt_add": {"type": "button", "label": "New", "onclick": "myfunc()" },
 *      },
 *      'initialFilter': 'pk__gt=0',
 *      'numItensPerPage': 10,
 *      'canShowGenericButtonDelete': true,
 *    });
 *  });
 */


/*
 * Return the pk of the selected object.
 * If not have some selected data the result is zero.
 * @return The PK of selected object
 */
function getDatagridSelected() {
    if ($('.form_datagrid:parent :input:radio:checked').val())
        return $('.form_datagrid:parent :input:radio:checked').val();
    else
        return 0;
}

// Firebug
//function debug($obj) {
//    if (window.console && window.console.log)
//    window.console.log('log: ' + $obj.toString());
//};

(function($) {

/*
 * The main method.
 * @param {array} settings A pair of key/value.
 */
$.fn.datagrid = function(settings) {

    /*
     * Properties of the datagrid
     * the variable "s" is extended from "settings"
     * @extends $.fn.datagrid.defaults
     */
    var s = $.extend({}, $.fn.datagrid.defaults, settings);

    // Apply initial filter
    s._filter = s.initialFilter;

    /*
     * @class dgrid class contains the methods and attributes
     */
    var dgrid = {
        /*
         * Creates the datagrid's structure using tables.
         * target is a html object.
         */
        createDatagrid: function(target) {
            s._datagridId = target.id;
            s._div = $(target);
            s._div.css({'padding-top':'10px'});
            s._div.empty();
            html = '<form id="'+s._datagridId+'_id_form_datagrid_" class="form_datagrid" action="." method="post">';

            // Verify if the search field is going to show
            if (s.canShowSearchField == true)
                html += '<div id="'+s._datagridId+'_div_search_field" class="div_search_field">' +
                   '    <input type="text" id="'+s._datagridId+'_id_search_text" class="id_search_text" name="search_text" value="Find..." onfocus="if (this.value == \'Find...\') this.value=\'\'" onblur="if (this.value == \'\') this.value=\'Find...\'">' +
                        '</div>';

            // Create the datagrid table
            html += '<table id="'+s._datagridId+'_table_datagrid" class="table_datagrid" cellspacing="0" cellpadding="2" border="0">' +
                    '  <thead class="table_datagrid_title"><tr class="sortable">';

            // Create the heads and defines the class according to the order database result
            $.each(s.cols, function(key, value) {
                if (key == s.order)
                    th_class = 'asc';
                else
                    th_class = 'head';
                html += '<th id="' + target.id + '_' + key + '" class="' + th_class + '" title="' + key + '" style="width:' + value.width + '"><h3>' + value.label + '</h3></th>';
            });

            // Begin of the datagrid footer
            html += '</tr></thead><tbody></tbody></table></form>' +
                    '<div id="'+s._datagridId+'_datagrid_footer" class="datagrid_footer">' +
                    '  <div id="'+s._datagridId+'_datagrid_footer_left_buttons" class="datagrid_footer_left_buttons">';

            // Verify which buttons going to show
            if (s.buttons) {
                var b = '';
                $.each(s.buttons, function(key, b) {
                    if (b['type'] == 'button')
                        html += '<input type="button" value="'+b['label']+'" onclick="'+b['onclick']+'">&nbsp;';
                    else if (b['type'] == 'image')
                        html += '<img src="'+b['src']+'" alt="'+b['label']+'" onclick="'+b['onclick']+'">&nbsp;';
                });
            }

            // A generic button to delete objects from database
            if (s.canShowGenericButtonDelete == true)
                if (s.genericButtonDelete['type'] == 'button')
                    html += '<input id="'+s._datagridId+'_button_delete" type="button" value="'+s.genericButtonDelete['label']+'" class="genericButtonDelete">&nbsp;';
                else if (b['type'] == 'image')
                    html += '<img id="'+s._datagridId+'_button_delete" src="'+s.genericButtonDelete['label']+'" class="genericButtonDelete">&nbsp;';

            // Datagrid controls
            html += '</div>' +
            '  <div id="'+s._datagridId+'_datagrid_footer_right_buttons" class="datagrid_footer_right_buttons">'  +
            '    <div id="'+s._datagridId+'_id_totalResult" class="id_totalResult datagrid_nav_text">TOTAL:</div>' +
            '    <div id="'+s._datagridId+'_datagrid_nav_first" class="datagrid_nav_first datagrid_nav_button"></div>' +
            '    <div id="'+s._datagridId+'_datagrid_nav_previous" class="datagrid_nav_previous datagrid_nav_button"></div>' +
            '    <div class="datagrid_nav_text"><input type="text" id="'+s._datagridId+'_id_current_page" class="id_current_page"></div>' +
            '    <div class="datagrid_nav_text">/</div>' +
            '    <div id="'+s._datagridId+'_id_totalPages" class="id_totalPages datagrid_nav_text"></div>' +
            '    <div id="'+s._datagridId+'_datagrid_nav_next" class="datagrid_nav_next datagrid_nav_button"></div>' +
            '    <div id="'+s._datagridId+'_datagrid_nav_last" class="datagrid_nav_last datagrid_nav_button"></div>' +
            '<div style="clear:both"></div></div><div style="clear:both"></div></div><div style="clear:both"></div>';


            // Insert datagrid in document
            s._div.append(html);

            /*
             * Add events
             */

            // Sort the data according to the column selected.
            $('#'+s._datagridId+'_table_datagrid .head,#'+s._datagridId+'_table_datagrid .asc, #'+s._datagridId+'_table_datagrid .desc').click(function() { dgrid.sorter($(this)); });

            // Generic button for delete objects
            $('#'+s._datagridId+'_datagrid_footer_left_buttons .genericButtonDelete').click(function() { dgrid.genericDatagridDelete(); });

            // When the <Enter> key is pressed, will go to the page specific.
            $('#'+s._datagridId+'_id_current_page').keydown(function(event) { return dgrid.goToPage(event, $(this).val()) });

            // The method to fast search
            $('#'+s._datagridId+'_id_search_text').keyup(function(event) { dgrid.fastSearch($(this).val()) });

            // Methods for navigation.
            $('#'+s._datagridId+'_datagrid_nav_first').click(function() { s._page = 1; dgrid.fillDatagrid(); });
            $('#'+s._datagridId+'_datagrid_nav_previous').click(function() { s._page = s._previousPage; dgrid.fillDatagrid(); });
            $('#'+s._datagridId+'_datagrid_nav_next').click(function() { s._page = s._nextPage; dgrid.fillDatagrid(); });
            $('#'+s._datagridId+'_datagrid_nav_last').click(function() { s._page = s._totalPages; dgrid.fillDatagrid(); });

            // Fill the datagrid
            this.fillDatagrid();
        },

        /*
         * Fill the datagrid
         */
        fillDatagrid: function() {
            columns = ''
            $.each(s.cols, function(k, v) {
                columns += '"'+k+'": "'+v+'",';

            });

            // strCols is cols in the string format. It's in JSON format.
            s._strCols = '{'+columns.slice(0,-1)+'}';

            // JQuery method for ajax. async needs is false to work with more of one datagrid in the same page.
            $.ajax({
                type: 'GET',
                url: s.url,
                dataType: 'json',
                data: s,
                async: false,
                success: function(r) {

                    // Update the navigation bar and info about page showed.
                    var item = r[0];
                    s._previousPage = item.previous_page;
                    s._nextPage = item.next_page;
                    s._current_page = item.current_page;
                    s._totalPages = item.total_pages;
                    s._totalResult = item.total_result;
                    s.order = item.order;
                    $('#'+s._datagridId+'_id_current_page').val(item.current_page);
                    $('#'+s._datagridId+'_id_totalPages').text(item.total_pages);
                    $('#'+s._datagridId+'_id_totalResult').text('TOTAL: '+item.total_result);

                    // Fill the datagrid according to result
                    $('#'+s._datagridId+'_table_datagrid > tbody').empty();
                    for (var i=0; i<item.queryset.length; i++) {
                        var q = item.queryset[i];
                        if (i % 2) row = 'row2'; else row = 'row1';
                        $('#'+s._datagridId+'_table_datagrid > tbody').append('<tr class="'+row+'" onmouseover="$(this).attr(\'class\',\'row0\')" onmouseout="$(this).attr(\'class\',\''+row+'\')" onclick="$(\'#'+s._datagridId+'_datagrid_row_pk_'+i+'\').attr(\'checked\',\'checked\'); '+s.tdExtraClick+'">');

                        // If the column name is "pk", show a radiobox
                        $.each(s.cols, function(k, v) {
                            value = q[k];
                            if (k == 'pk')
                                value = '<input type="radio" id="'+s._datagridId+'_datagrid_row_pk_'+i+'" name="'+k+'" value="'+value+'">'
                            $('#'+s._datagridId+'_table_datagrid > tbody tr:last').append('<td>'+value+'</td>');
                        });
                        $('#'+s._datagridId+'_table_datagrid > tbody').append('</tr>');
                    };
                },
                error: function(error) {
                    s._div.html(error.responseText);
                }
            });

        },

        /*
         * Sort the datagrid result according the cols clicked.
         */
        sorter: function(td) {
            var td_class, order = $(td).attr('title');
            td_class = $(td).attr('class');
            $('.asc').attr('class','head');
            $('.desc').attr('class','head');

            if (td_class == 'head' || td_class == 'desc')
                $(td).attr('class','asc');
            else
                if (td_class == 'asc') {
                    $(td).attr('class','desc');
                    order = '-'+order;
                }

            s.order = order;
            dgrid.fillDatagrid();
        },

        /*
         * Replaces %s in the searchFilter for the value typed and refreshes
         * the datagrid with the results of the search.
         */
        fastSearch: function(value) {
            if (value && value != '' && value != 'Find...') {
                filter = s.searchFilter;
                s._filter = filter.replace('%s',value);
            } else
                s._filter = s.initialFilter;
            dgrid.fillDatagrid();
        },

        /*
         * Going to page specified by user.
         * This methdo allow only numbers in the input text object.
         */
        goToPage: function(event, value) {
            var KEYS_ALLOWED = {
                 8 : 'BACKSPACE',
                13 : 'ENTER',
                37 : 'LEFT_ARROW',
                39 : 'RIGHT_ARROW',
                46 : 'DELETE',
                48 : '0',
                49 : '1',
                50 : '2',
                51 : '3',
                52 : '4',
                53 : '5',
                54 : '6',
                55 : '7',
                56 : '8',
                57 : '9',
                96 : '0',
                97 : '1',
                98 : '2',
                99 : '3',
                100 : '4',
                101 : '5',
                102 : '6',
                103 : '7',
                104 : '8',
                105 : '9',
            };

            if (value && value != '')
                if (KEYS_ALLOWED[event.keyCode]) {
                    if (event.keyCode == 13) {
                        s._page = value;
                        dgrid.fillDatagrid();
                    }
                    return true;
                } else
                    return false;
        },

        /*
         * A generic method for deletion of the objects in django.
         */
        genericDatagridDelete: function() {
            pk = getDatagridSelected();
            if (pk > 0) {
                data = {
                    'pk': pk,
                    'modelName': s.modelName,
                    'appLabel': s.appLabel,
                };
                $.ajax({
                    type: 'GET',
                    url: s.url+'delete/',
                    dataType: 'text',
                    data: data,
                    success: function(r) {
                      if (r == 'ok')
                          dgrid.fillDatagrid();
                      else
                          alert(r);
                    },
                    error: function(error) {
                        s._div.html(error.responseText);
                    }
                });
            } else
                alert('Nenhum item selecionado.');
        }

    }

    if (settings)
        if (! settings['appLabel'] || ! settings['modelName'] || ! settings['cols'])
            alert('Necessário informar appLabel, modelName e cols');
        else
            return this.each(function() { dgrid.createDatagrid(this); });
    else
        alert('Configuracao nao definida');
};

/**
 * The default values of the datagrid.
 */
$.fn.datagrid.defaults = {
    // ID of the element div container
    _datagridId: '',

    // App name generated by manage.py
    appLabel: '',

    // Name of model in models.py
    modelName: '',

    // The initial filter used in model.objects.filter()
    initialFilter: 'pk__gt=0',

    // The filter used for search
    searchFilter: 'pk__icontains="%s"',

    // Private atribute sent to datagrid app
    _filter: '',

    // Order show
    order: 'pk',

    // URL of the datagrid app
    url: '/jqdjangogrid/',

    // Dict contain the fields of model
    cols: {},

    // Private attribute contain the cols in the string format
    _strCols: '',

    // About generic button delete
    genericButtonDelete: { 'label': 'Delete', 'type': 'button' },
    canShowGenericButtonDelete: false,

    // Page number of previous, current and next. Also the total pages and total results
    _previousPage: '',
    _current_page: '',
    _nextPage: '',
    _totalPages: '',
    _totalResult: '',
    _page: 1,

    // Total of lines in the datagrid
    numItensPerPage: '10',

    // Permission for show the search field
    canShowSearchField: true,

    // Buttons in the navigation bar
    buttons: {},

    // A extra function to execute when td is clicked
    tdExtraClick: '',

    // Private attribute contains the id of element container
    _div: '',
};
})(jQuery);
