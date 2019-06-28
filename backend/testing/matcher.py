import psycopg2
import xml.etree.ElementTree as ET
root = ET.parse('backend/data/converted/Velorouten.osm').getroot()
coords = root.findall('node')
nodemap = {}
for elem in coords:
    nodemap[elem.get('id')] = [elem.get('lat'), elem.get('lon')]
    

ways = []
for way in root.findall('way'):         
    nodes = []
    for node in way:   
        try:
            nodes.append(nodemap[node.get('ref')])
        except KeyError as e:
            print('nothing...')
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
        conn = psycopg2.connect("dbname='bike_db' user='bike_user' host='127.0.0.1' password='bikemap'")
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
            else:
                break
print(ways)