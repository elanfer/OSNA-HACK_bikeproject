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


def speed(tags):
    for tag in tags:
        key = ""
        if key == "speed": #TODO set key name
            try:
                int_value = int(value)
            except Exception:
                int_value = 5
            return (int_value - 5)/(160-5)

def workground(tags):
    for tag in tags:
        key = ""
        if key == "workground":
            return value

def way(id, tags):
    # jonin der Tags

    #tags = [("key", "Test"), ("key2", "test2")]
    street_data, not_bike_way_data = street_conditon(tags)
    if street_data !=  None:
        #print(str(id))
        #print(str(not_bike_way_data))
        print('{"' + str(id) + '": ' + str(street_data) + '},')

    return street_data
    #noise_data = noise(tags)
    #speed_data = speed(tags)
    #workground_data = workground(tags)


    #TODO daten in die Datenbank

def main():
    i = 0
    with open('waysExport_new.json') as f:
        data = json.load(f)

        for w in data:
            #print(w["id"])
            #print(w["tags"])
            if w["tags"] != None:
                x = way(w["id"], w["tags"])
            #z = w["tags"]
            #if z != None and 'highway' in z:
            #    print(z["highway"])
                #if x != None:
                #    i = i + x
        #print( str(i))

    #TODO itarieren über die ways

if __name__ == '__main__':
    main()




