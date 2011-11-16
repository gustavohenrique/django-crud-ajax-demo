from django.test import TestCase
from family.models import People

from django.test.client import Client
from django.core.urlresolvers import reverse

from django.conf import settings
from family.utils import Importer


def mock():
    p1 = factory(first_name='Linus', last_name='Torvalds')
    p1.save()
    
    p2 = factory(first_name='Eric', last_name='Raymond')
    p2.save()
    p2.relatives.add(p1)

def factory(**kwargs):
    params = dict(first_name='Steve',
                  last_name='Jobs',
                  dob='1960-11-12',
                  city='Rio de Janeiro',
                  state='RJ',
                  email='steve@apple.com')
    params.update(**kwargs)
    return People(**params)


class TestModels(TestCase):  
    def test_create_people_related(self):
        p1 = factory(first_name='Linus', last_name='Torvalds')
        p1.save()
        
        p2 = factory(first_name='Eric', last_name='Raymond')
        p2.save()
        p2.relatives.add(p1)
        
        p3 = People.objects.get(first_name='Eric')
        related = p3.relatives.select_related()[0]
        
        self.assertEquals(p1, related)


class TestViews(TestCase):
    def test_add_people(self):
        c = Client(enforce_csrf_checks=False)
        data = {'first_name': 'Ed', 'last_name': 'Garcia'}
        response = c.post(reverse('people_add'), data)
        
        peoples = response.context['peoples']
        self.assertEquals(1, len(peoples))
    
    def test_fail_when_add_people_without_last_name(self):
        c = Client(enforce_csrf_checks=False)
        data = {'first_name': 'Ed'}
        response = c.post(reverse('people_add'), data)
        
        peoples = response.context['peoples']
        self.assertEquals(0, len(peoples))
    
    def test_simple_search(self):
        mock()
        response = Client().get(reverse('people_filter'), {'s': 'ric'})
        
        peoples = response.context['peoples']
        self.assertEquals(1, len(peoples))
    
    def test_simple_search_without_pass_string(self):
        mock()
        response = Client().get(reverse('people_filter'))
        
        self.assertEquals('Enter a valid string to search', response.content)


class TestImporter(TestCase):
    
    def test_importer_using_valid_csv(self):
        f = open('%s/mock_family.csv' % getattr(settings, 'MEDIA_ROOT'), 'rb')
        peoples = Importer().from_csv(f)
        self.assertEquals(3, len(peoples))
    
    def test_importer_fails_on_not_found_file(self):
        peoples = Importer().from_csv('mock_family.csv')
        self.assertEquals(0, len(peoples))
        
