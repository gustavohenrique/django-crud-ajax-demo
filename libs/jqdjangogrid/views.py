# -*- coding: utf-8 -*-
from django.db.models import Q
from django.db.models import get_model
from django.core.paginator import Paginator, EmptyPage, InvalidPage
from django.http import HttpResponse
from django.core import serializers
from django.utils import simplejson
from django.views.generic.simple import direct_to_template


def datagrid(request):
    """
    Returns the datas in JSON format.
    """

    if request.method == 'GET':
        # get all data in the GET
        P = request.GET

        # info to mount queryset
        model = get_model(P.get('appLabel'), P.get('modelName'))
        cols = eval(P.get('_strCols'))
        order = P.get('order')
        if '.' in order: order = order.split('.')[0]

        if P.get('_filter'):
            filter = P.get('_filter')
        else:
            filter = P.get('initialFilter')


        # the page
        page = int(P.get('_page'))
        try:
            show_per_page = int(P.get('numItensPerPage'))
        except:
            show_per_page = 10

        # run the query
        try:
            query = eval('model.objects.filter(%s).order_by("%s")' % (filter, order))
        except:
            query = model.objects.all().order_by(order)

        # paginate the result
        paged = Paginator(query, show_per_page)
        try:
            result_paged = paged.page(page)
        except (EmptyPage, InvalidPage):
            result_paged = paged.page(paged.num_pages)

        # converts the queryset result to a dict and preserves the order of the cols specified in P.get('cols')
        data_list = []
        temp_list = []
        for obj in result_paged.object_list:
            for c in cols.keys():
                temp_list.append((c, unicode(eval('obj.'+c))))
            data_list.append(dict(temp_list))

        # adds other data in the result
        data = [{
            'previous_page': result_paged.previous_page_number(),
            'next_page': result_paged.next_page_number(),
            'current_page': result_paged.number,
            'show_per_page': show_per_page,
            'total_pages': paged.num_pages,
            'total_result': query.count(),
            'order': order,
            'queryset': data_list
        }]

        # returns a json object
        json = simplejson.dumps(data)
        return HttpResponse(json, mimetype='application/json')


def delete(request):
    """
    Delete the object from database.
    Returns the result in string format.
    """

    if request.method == 'GET':
        try:
            P = request.GET
            pk = int(P.get('pk'))
            model = get_model(P.get('appLabel'), P.get('modelName'))
            model.objects.get(pk=pk).delete()
            status = 'ok'
        except:
            status = u'Object not found in database.'

        return HttpResponse(status)
