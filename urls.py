from django.conf.urls.defaults import *

urlpatterns = patterns('',
    (r'^family/', include('family.urls')),
    (r'^jqdjangogrid/', include('jqdjangogrid.urls')),
)

from django.conf import settings
if settings.DEBUG:
    urlpatterns += patterns('',
        (r'^static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT, 'show_indexes': True}),
    )
