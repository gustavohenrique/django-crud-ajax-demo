# -*- coding: utf-8 -*-
from django.views.generic.simple import direct_to_template
from django.http import HttpResponse
from django.db.models import Q

from family.models import People
from family.forms import PeopleForm, ImporterForm


def index(request, form=None, peoples=None, importer_form=None):
    if form is None:
        form = PeopleForm()
    
    if peoples is None:
        peoples = People.objects.all()
        
    if importer_form is None:
        importer_form = ImporterForm()
        
    context = {'form': form, 'importer_form': importer_form, 'peoples': peoples}
    return direct_to_template(request, 'family_tree.html', context)

def add(request):
    if request.POST:
        form = PeopleForm(request.POST)
        if form.is_valid():
            form.save()
            form = PeopleForm()
        
        return index(request, form)
        
    return HttpResponse('Fill the form')

def filter(request):
    if request.GET:
        s = request.GET.get('s')
        peoples = People.objects.filter(Q(first_name__icontains=s) | Q(last_name__icontains=s))
        return index(request, None, peoples)
    
    return HttpResponse('Enter a valid string to search')

def importer(request):
    if request.POST:
        form = ImporterForm(request.POST, request.FILES)
        if form.is_valid():
            form = ImporterForm()
        
        return index(request, None, None, form)
        
    return HttpResponse('Select the file')
