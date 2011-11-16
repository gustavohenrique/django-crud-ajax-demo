# -*- coding: utf-8 -*-
from django.forms import ModelForm
from django.forms import forms

from family.models import People
from family.utils import Importer

class PeopleForm(ModelForm):
    class Meta:
        model = People

class ImporterForm(forms.Form):
    file  = forms.FileField()
    
    def clean_file(self):
        f = self.cleaned_data['file']
        peoples = Importer().from_csv(f)
        if len(peoples) == 0:
            raise forms.ValidationError(u'Invalid file')

        return f
        
