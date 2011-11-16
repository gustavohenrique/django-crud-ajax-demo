# -*- coding: utf-8 -*-
from django.db import models
#from django.core.urlresolvers import reverse


class People(models.Model):
    relatives = models.ManyToManyField('self', related_name='relatives_family', blank=True, null=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    dob = models.DateField(blank=True, null=True)
    city = models.CharField(max_length=50, blank=True, null=True)
    state = models.CharField(max_length=50, blank=True, null=True)
    email = models.EmailField(max_length=200, blank=True, null=True)
    
    def __unicode__(self):
        return '%s %s' % (self.first_name, self.last_name)
    
    @property
    def relative_peoples(self):
        s = ''
        for p in self.relatives.select_related():
            s += '%s ' % p
        return s
