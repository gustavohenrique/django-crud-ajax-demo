from django.conf.urls.defaults import patterns,  url

urlpatterns = patterns('jqdjangogrid.views',
    url(r'^$', 'datagrid',  name='datagrid'),
    url(r'^delete/$', 'delete',  name='datagrid_delete'),
)
