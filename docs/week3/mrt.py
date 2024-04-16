import json
import csv
from urllib.request import urlopen
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

def load_json_data_from_url(url):
    with urlopen(url) as response:
        data = response.read().decode('utf-8')
        json_data = json.loads(data)
        return json_data['data'] if isinstance(json_data['data'], list) else json_data['data']['results']

def create_serial_to_title_mapping(data):
    return {item['SERIAL_NO']: item['stitle'] for item in data}

def map_mrt_to_spots(data, serial_to_title):
    mrt_to_spots = {}
    for item in data:
        mrt_station = item['MRT']
        serial_no = item['SERIAL_NO']
        if serial_no in serial_to_title:
            if mrt_station not in mrt_to_spots:
                mrt_to_spots[mrt_station] = []
            mrt_to_spots[mrt_station].append(serial_to_title[serial_no])
    return mrt_to_spots

def write_spots_to_csv(mrt_to_spots, output_csv_path):
    with open(output_csv_path, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        for mrt, spots in mrt_to_spots.items():
            row = [mrt] + spots  
            writer.writerow(row)

def main():
    url1 = 'https://padax.github.io/taipei-day-trip-resources/taipei-attractions-assignment-1'
    url2 = 'https://padax.github.io/taipei-day-trip-resources/taipei-attractions-assignment-2'
    
    data1 = load_json_data_from_url(url1)
    data2 = load_json_data_from_url(url2)

    serial_to_title = create_serial_to_title_mapping(data1)
    mrt_to_spots = map_mrt_to_spots(data2, serial_to_title)

    output_csv_path = 'mrt.csv'
    write_spots_to_csv(mrt_to_spots, output_csv_path)

if __name__ == '__main__':
    main()