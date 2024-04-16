import json
import csv
from urllib.request import urlopen
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

def load_json_data_from_url(url):
    with urlopen(url) as response:
        data = response.read().decode('utf-8')
        json_data = json.loads(data)
        if 'results' in json_data['data']: 
            return json_data['data']['results']
        return json_data['data']  

def extract_district(address, districts):
    for district in districts:
        if district in address:
            return district
    return None

def make_district_mapping(data, districts):
    return {item['SERIAL_NO']: extract_district(item['address'], districts) for item in data}

def make_data_row(spot, serial_to_district):
    serial_no = spot['SERIAL_NO']
    title = spot['stitle']
    longitude = spot['longitude']
    latitude = spot['latitude']
    image_urls = spot['filelist'].split('https://')
    image_url = 'https://' + image_urls[1] if len(image_urls) > 1 else ''
    district = serial_to_district.get(serial_no, '未註明區域')
    return [title, district, longitude, latitude, image_url]

def write_to_csv(data1, serial_to_district, output_csv_path):
    with open(output_csv_path, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(['SpotTitle', 'District', 'Longitude', 'Latitude', 'ImageURL'])
        for spot in data1:
            writer.writerow(make_data_row(spot, serial_to_district))

def main():
    url1 = 'https://padax.github.io/taipei-day-trip-resources/taipei-attractions-assignment-1'
    url2 = 'https://padax.github.io/taipei-day-trip-resources/taipei-attractions-assignment-2'
    districts = ["中正區", "萬華區", "中山區", "大同區", "大安區", "松山區", "信義區", "士林區", "文山區", "北投區", "內湖區", "南港區"]

    data1 = load_json_data_from_url(url1)
    data2 = load_json_data_from_url(url2)
    serial_to_district = make_district_mapping(data2, districts)

    output_csv_path = 'spot.csv'
    write_to_csv(data1, serial_to_district, output_csv_path)

if __name__ == '__main__':
    main()