from django.conf.urls.defaults import *

urlpatterns = patterns('family.views',
    url(r'^$', 'index', name='people_index'),
    url(r'^filter/$', 'filter', name='people_filter'),
    url(r'^add/$', 'add', name='people_add'),
    url(r'^importer/$', 'importer', name='family_importer'),
)
