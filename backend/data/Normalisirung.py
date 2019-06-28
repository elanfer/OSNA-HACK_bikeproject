#!/usr/bin/env python3

import json
import psycopg2


def street_conditon(tag):

    not_bike_way = True # In die Datenbank
    conditon = None


    # Kein Radweg
    if 'highway' in tag:
        value = tag["highway"]
        if value == "motorway" or value == "trunk" or value == "motorway_link" or value == "trunk_link" or value == "steps":
            not_bike_way = False
        elif value == "primary" or value == "tertiary":
            if 'sideway' in tag:
                v = tag["sideway"]
                if v == "no":
                    not_bike_way = False

    # Daten von der Stadt Osnabrueck
    if 'biketracktype' in tag:
        value = tag["biketracktype"]
        if value == "Freizeitrouten" or value == "Hauptrouten" or value == "Nebenrouten" or value == "Radschnellrouten" or value == "Veloruten":
            conditon = 1
        elif value == "Netzluecke":
            conditon = 0.7

    # Date OSM Radwege
    elif 'cycleway' in tag:
        value = tag["cycleway"]
        if value == "track" or value == "opposite_track":
            conditon = 0.9
        elif value == "share_busway":
            conditon = 0.8
        elif value == "opposite_lane":
            conditon = 0.7
        elif value == "opposite":
            conditon = 0.6
        elif value == "lane":
            conditon = 0.4


    # Daten der Radstrassen
    elif 'bicycle_road' in tag:
        value = tag["bicycle_road"]
        if value == "yes":
            conditon = 1


    # Daten von der highway
    elif 'highway' in tag:
        value = tag["highway"]
        if value == "cycleway":
            conditon = 1
        if value == "living_street" or value == "unclassified":
            conditon = 0.9
        elif value == "primary" or value == "residential":
            conditon = 0.8
        elif value == "footway":
            #import ipdb; ipdb.set_trace()
            if 'bicycle' in tag:
                v = tag["bicycle"]
                if v == "yes" or v == "desigated":
                    conditon = 0.8
                else:
                    conditon = 0.3
        elif value == "track" or value == "path":
            conditon = 0.7
        elif value == "secondary" or value == "tertiary_link":
            conditon = 0.5
        elif value == "pedestrian":
            conditon = 0.3
        elif value == "primary_link":
            conditon = 0.1

    return conditon, not_bike_way




def noise(tag):
    if "noise" in tag:
        value = tag["noise"] #TODO set key name
        return 1 - (float(value) - 1)/(5-1)


def speed(tag):
    if "maxspeed" in tag:
        value = tag["maxspeed"]
        try:
            int_value = int(value)
        except Exception:
            int_value = 5
        if int_value > 70:
            int_value = 70
        return 1 - (int_value - 5)/(70-5)

def construction(tag):
    if "BEEINTRAEC" in tag:
        value = tag["BEEINTRAEC"]
        if value == "Vollsperrung":
            return 0.1
        elif value == "Halbseitige Fahrbahnsperrung, Einsatz Lichtsignalanlage" or value == "Einsatz Lichtsignalanlage" or value == "Einsatz Lichtanlage, Spurverlegung":
            return 0.2
        elif value == "Verengung 2 auf 1":
            return 0.3


def gewichtet(weg, geschwin, lautst, baust=0):
    if not weg:
        weg = 0
    if not geschwin:
        geschwin = 0
    if not lautst:
        lautst = 0
    if not baust:
        baust = 0
    return (3*weg + 5*geschwin + 2*lautst + 1*baust)/8 # 11


def count(dic):
    i = 0
    n0 = 0
    n1 = 0
    n2 = 0
    n3 = 0
    n4 = 0

    street = 0
    speed = 0
    noise = 0
    construction = 0
    for d in dic.values():
        i = i + 1
        n = 0
        if not d["street"] == None:
            street = street + 1
            n = n + 1
        if not d["speed_car"] == None:
            n = n + 1
            speed = speed + 1
        if not d["noise"] == None:
            n = n + 1
            noise = noise + 1
        if not d["construction"] == None:
            n = n + 1
            construction = construction + 1

        if n == 0:
            n0 = n0 + 1
        if n == 1:
            n1 = n1 + 1
        if n == 2:
            n2 = n2 + 1
        if n == 3:
            n3 = n3 + 1
        if n == 4:
            n4 = n4 + 1

    print("Anzahl: " , i)
    print("#################")
    print("street: " , street)
    print("speed: " , speed)
    print("noise: " , noise)
    print("#################")
    print("0 Daten " , n0)
    print("1 Daten: " , n1)
    print("2 Daten: " , n2)
    print("3 Daten: " , n3)
    print("4 Daten: " , n4)



def main():
    i = 0
    dic = {}

    with open('waysExport_new.json') as f:
        data = json.load(f)


    # Lautstaerke bekommen
    filename = 'laerm/laermkartierung.csv'
    lines = [line.rstrip('\n') for line in open(filename)]
    laerm = {}
    for l in lines:
        y = l.split(", ")
        laerm[y[0]] = y[1]

    # durch alle Way gehen
    for w in data:
        items = {}
        id = w["id"]
        tags = w["tags"]

        if tags != None:

            # Lautstaerke hinzufügen
            if "name" in tags:
                if tags["name"] in laerm.keys():
                    tags["noise"] = laerm[tags["name"]]

            street_data, not_bike_way_data = street_conditon(tags)
            speed_data = speed(tags)
            construction_data = construction(tags)
            noise_data = noise(tags)
            if speed_data !=  None or street_data != None or workground_data != None or noise_data != None:
                items["street"] = street_data
                items["speed_car"] = speed_data
                items["construction"] = construction_data
                items["noise"] = noise_data
                items["default_calc"] = gewichtet(street_data, speed_data, noise_data)

                dic[id] =items


    count(dic)
    #print(json.dumps(dic))

    try:
        conn = psycopg2.connect("dbname='postgres' user='postgres' host='10.229.54.121' port='15432' password='mysecretpassword'")
    except:
        print('I am unable to connect to the database')
    cur = conn.cursor()
    for key, value in dic.items():
        if value['street'] is not None:
            cur.execute('INSERT INTO public.custom_tags (way_id, tag_name, tag_value) VALUES (%s, \'street\', %s);', (key, value['street']))
        if value['speed_car'] is not None:
            cur.execute('INSERT INTO custom_tags (way_id, tag_name, tag_value) VALUES (%s, \'speed_car\', %s);', (key, value['street']))
        if value['construction'] is not None:
            cur.execute('INSERT INTO custom_tags (way_id, tag_name, tag_value) VALUES (%s, \'construction\', %s);', (key, value['construction']))
        if value['noise'] is not None:
            cur.execute('INSERT INTO custom_tags (way_id, tag_name, tag_value) VALUES (%s, \'noise\', %s);', (key, value['noise']))
        if value['default_calc'] is not None:
            cur.execute('INSERT INTO custom_tags (way_id, tag_name, tag_value) VALUES (%s, \'street\', %s);', (key, value['default_calc']))
    conn.commit()
    conn.close
    #TODO daten in die Datenbank

if __name__ == '__main__':
    main()




