#!/usr/bin/env python3

import json


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




def noise(tags):
    for tag in tags:
        key = ""
        if key == "noise": #TODO set key name
            return (value - 1)/(5-1)


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

def workground(tags):
    for tag in tags:
        key = ""
        if key == "workground":
            return value

def way(id, tags):
    # jonin der Tags

    #tags = [("key", "Test"), ("key2", "test2")]
    street_data, not_bike_way_data = street_conditon(tags)
    speed_data = speed(tags)
    #if street_data !=  None:
    if speed_data !=  None and street_data != None:

        #print('{"' + str(id) + '": ' + str(street_data) + '},')
        print('{"' + str(id) + '": {"speed":' + str(speed_data) + ', "street": ' + str(street_data) + '}},')

    return street_data

def gewichtet(weg, geschwin, lautst=0, baust=0):
    return (3*weg + 5*geschwin + 1*lautst + 1*baust)/8 # 10


def main():
    i = 0
    dic = {}

    with open('waysExport_new.json') as f:
        data = json.load(f)

    for w in data:
        items = {}
        id = w["id"]
        tags = w["tags"]

        if tags != None:
            street_data, not_bike_way_data = street_conditon(tags)
            speed_data = speed(tags)
            if speed_data !=  None and street_data != None:
                items["street_data"] = str(street_data)
                items["speed"] = str(speed_data)
                items["calc"] = str(gewichtet(street_data, speed_data))

                dic[id] =items

    print(json.dumps(dic))

    #TODO daten in die Datenbank

if __name__ == '__main__':
    main()




