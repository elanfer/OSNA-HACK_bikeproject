#!/usr/bin/env python3




def street_conditon(tags):

    not_bike_way = True # In die Datenbank
    conditon = None

    for tag in tags: # Tag: (Key, value)
        key, value = tag

        # Kein Radweg
        if key == "highway":
            if value == "motorway" or value == "trunk" or value == "motorway_link" or value == "trunk_link" or value == "steps":
                not_bike_way = False
                break
            elif key == "primary" or value == "tertiary":
                for t in tags:
                    k, v = t
                    if k == "sideway":
                        if v == "no":
                            not_bike_way = False
                            break

        # Daten von der Stadt Osnabrueck
        elif key == "biketracktype":
            if value == "Freizeitrouten" or value == "Hauptrouten" or value == "Nebenrouten" or value == "Radschnellrouten" or value == "Veloruten":
                conditon == 1
                break
            elif value == "Netzluecke":
                conditon == 0.7
                break

        # Date OSM Radwege
        elif key == "cycleway":
            if value == "track" or value == "opposite_track":
                conditon = 0.9
                break
            elif value == "share_busway":
                conditon = 0.8
                break
            elif value == "opposite_lane":
                conditon = 0.7
                break
            elif value == "opposite":
                conditon = 0.6
                break
            elif value == "lane":
                conditon = 0.4
                break


        # Daten der Radstrassen
        elif key == "bicycle_road":
            if value == "yes":
                conditon = 1
                break


        # Daten von der highway
        elif key == "highway":
            if value == "cycleway":
                conditon = 1
                break
            if value == "living_street" or value == "unclassified":
                conditon = 0.9
                break
            elif value == "primary" or value == "residential":
                conditon = 0.8
                break
            elif value == "footway":
                for t in tags:
                    if t == "bicycle":
                        if value == "yes" or value == "desigated":
                            conditon = 0.8
                            break
                        else:
                            conditon = 0.3
                            break
            elif value == "track" or value == "path":
                conditon = 0.7
                break
            elif value == "secondary" or value == "tertiary_link":
                conditon = 0.5
                break
            elif value == "pedestrian":
                conditon = 0.3
                break
            elif value == "primary_link":
                conditon = 0.1
                break

        return conditon, not_bike_way




def noise(tags):
    for tag in tags:
        key, value = tag
        if key == "noise": #TODO set key name
            return (value - 1)/(5-1)


def speed(tags):
    for tag in tags:
        key, value = tags
        if key == "speed": #TODO set key name
            try:
                int_value = int(value)
            except Exception:
                int_value = 5
            return (int_value - 5)/(160-5)

def workground(tags):
    for tag in tags:
        key, value = tags
        if key == "workground":
            return value

def way(id):
    # jonin der Tags

    tags = [("key", "Test"), ("key2", "test2")]
    street_data, not_bike_way_data = street_conditon(tags)
    noise_data = noise(tags)
    speed_data = speed(tags)
    workground_data = workground(tags)


    #TODO daten in die Datenbank

def main():
    way(1)
    #TODO itarieren über die ways

if __name__ == '__main__':
    main()




