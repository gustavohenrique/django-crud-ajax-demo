# -*- coding: utf-8 -*-
from family.models import People
import csv


class Importer(object):
    
    def from_csv(self, f):
        peoples = []
        try:
            line = csv.reader(f, delimiter=';')
            for item in line:
                data = dict(first_name=item[0],
                            last_name=item[1],
                            dob=[None, item[2]] [item[2] != ''],
                            city=item[3],
                            state=item[4],
                            email=item[5])
                p = People.objects.create(**data)
                self._add_relatives(p, item[6])
                peoples.append(p)
        except Exception as e:
            # log
            pass
        
        return peoples
    
    def _add_relatives(self, p, relatives):
        try:
            names = relatives.split(',')
            for name in names:
                people = People.objects.get(first_name=name)
                p.relatives.add(people)
        except:
            pass
