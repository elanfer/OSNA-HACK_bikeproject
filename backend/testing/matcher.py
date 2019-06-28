import psycopg2
import xml.etree.ElementTree as ET
root = ET.parse('backend/data/converted/baustellen_quelle_stadt_osnabrueck.osm').getroot()
coords = root.findall('node')
nodemap = {}
for elem in coords:
    nodemap[elem.get('id')] = [elem.get('lat'), elem.get('lon')]

ways = []
tags = {}
for way in root.findall('way'):         
    nodes = []
    for node in way:   
        try:
            nodes.append(nodemap[node.get('ref')])            
        except KeyError as e:
            tag_name = node.get('k')
            tag_value = node.get('v')
    min_lat = float(nodes[0][0])
    max_lat = float(nodes[0][0])
    min_long = float(nodes[0][1])
    max_long = float(nodes[0][1])
    query_string = ''
    for elem in nodes:
        elem[0] = float(elem[0])
        elem[1] = float(elem[1])
        if len(query_string) < 1:
            query_string = query_string + str(elem[1]) + ' ' + str(elem[0])
        else:
            query_string = query_string + ',' +  str(elem[1]) + ' ' + str(elem[0])
        if max_lat < elem[0]:
            max_lat = elem[0]
        if min_lat > elem[0]:
            min_lat = elem[0]
        if min_long > elem[1]:
            min_long = elem[1]
        if max_long < elem[1]:
            max_long = elem[1]

    # calc bounding box
    # by add or subtract 00.00000000500
    max_lat = max_lat + 00.00000000500
    max_long = max_long + 00.00000000500
    min_lat = min_lat - 00.00000000500
    min_long = min_long - 00.00000000500

    try:
        conn = psycopg2.connect("dbname='postgres' user='postgres' host='10.229.54.121' port='15432' password='mysecretpassword'")
    except:
        print('I am unable to connect to the database')

    cur = conn.cursor()
    cur.execute('SELECT osm_id, the_geom, st_distance(the_geom, ST_GeomFromText(\'LINESTRING('+query_string+')\',4326)) as dist FROM osm_ways WHERE the_geom && ST_MakeEnvelope('+str(min_long)+', '+str(min_lat)+', '+str(max_long)+',  '+str(max_lat)+') AND name is not null AND tag_value not in (\'footway\',  \'service\') order by dist asc;') 
    result = cur.fetchall() 
    if(len(result)>3):
        cur.execute('SELECT ST_GeomFromText(\'LINESTRING('+query_string+')\',4326)')
        new_geom = cur.fetchall()
        new_geom = new_geom[0][0]

        highscore = result[0][2]
        for item in result:
            if(highscore == item[2]):
                ways.append(item[0])
                cur.execute('INSERT INTO custom_tags (way_id, tag_name, tag_value) VALUES (%s, %s, %s);', (str(item[0]), tag_name, tag_value))
            else:
                break
    conn.commit()
    conn.close()
