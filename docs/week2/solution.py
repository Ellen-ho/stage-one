# 第一題

stations_map = [
    "Songshan",
    "Nanjing Sanmin",
    "Taipei Arena",
    "Nanjing Fuxing",
    "Songjiang Nanjing",
    "Zhongshan",
    "Beimen",
    "Ximen",
    "Xiaonanmen",
    "Chiang Kai-Shek Memorial Hall",
    "Guting",
    "Taipower Building",
    "Gongguan",
    "Wanlong",
    "Jingmei",
    "Dapinglin",
    "Qizhang",
    "Xiaobitan",
    "Xindian City Hall",
    "Xindian",
]

main_stations = [
    "Songshan",
    "Nanjing Sanmin",
    "Taipei Arena",
    "Nanjing Fuxing",
    "Songjiang Nanjing",
    "Zhongshan",
    "Beimen",
    "Ximen",
    "Xiaonanmen",
    "Chiang Kai-Shek Memorial Hall",
    "Guting",
    "Taipower Building",
    "Gongguan",
    "Wanlong",
    "Jingmei",
    "Dapinglin",
    "Qizhang",
    "Xindian City Hall",
    "Xindian",
]

branch_stations = [
    "Songshan",
    "Nanjing Sanmin",
    "Taipei Arena",
    "Nanjing Fuxing",
    "Songjiang Nanjing",
    "Zhongshan",
    "Beimen",
    "Ximen",
    "Xiaonanmen",
    "Chiang Kai-Shek Memorial Hall",
    "Guting",
    "Taipower Building",
    "Gongguan",
    "Wanlong",
    "Jingmei",
    "Dapinglin",
    "Qizhang",
    "Xiaobitan",
]

def find_and_print(messages, current_station):
    people = list(messages.keys())

    current_index = -1
    if current_station in main_stations:
        current_index = main_stations.index(current_station)
    elif current_station in branch_stations:
        current_index = branch_stations.index(current_station)

    if current_index == -1:
        print("Station not found in the array.")
        return

    min_distance = float('inf')
    nearest_friend = ""

    for person in people:
        message = messages[person]
        station_name = extract_station_name(message)
        station_index = -1  

        if station_name in main_stations:
            station_index = main_stations.index(station_name)
        elif station_name in branch_stations:
            station_index = branch_stations.index(station_name)

     
        if station_index != -1:
           
            if ((current_station == "Xiaobitan" and 
                 (station_name == "Xindian City Hall" or station_name == "Xindian")) or 
                (current_station == "Xindian City Hall" and station_name == "Xiaobitan") or 
                (current_station == "Xindian" and station_name == "Xiaobitan")):
                distance = abs(current_index - station_index) + 2
            else:
                distance = abs(current_index - station_index)

            if distance < min_distance:
                min_distance = distance
                nearest_friend = person

    print(nearest_friend)

def extract_station_name(message):
    import re
    regex = re.compile("|".join(stations_map))
    match = regex.search(message)
    if match:
        return match.group()
    return None

messages={
"Leslie":"I'm at home near Xiaobitan station.",
"Bob":"I'm at Ximen MRT station.",
"Mary":"I have a drink near Jingmei MRT station.",
"Copper":"I just saw a concert at Taipei Arena.",
"Vivian":"I'm at Xindian station waiting for you."
}

find_and_print(messages, "Wanlong") # print Mary
find_and_print(messages, "Songshan") # print Copper
find_and_print(messages, "Qizhang") # print Leslie
find_and_print(messages, "Ximen") # print Bob
find_and_print(messages, "Xindian City Hall") # print Vivian

# 第二題

consultants_schedule = {}

def book(consultants, hour, duration, criteria):
    endTime = hour + duration

    available_consultants = [
        consultant for consultant in consultants if all(
            endTime <= bookedStart or hour >= bookedEnd
            for bookedStart, bookedEnd in consultants_schedule.get(consultant["name"], [])
        )
    ]

    if not available_consultants:
        print("No Service")
        return

    if criteria == "price":
        selected_consultant = sorted(available_consultants, key=lambda x: x["price"])[0]
    elif criteria == "rate":
        selected_consultant = sorted(available_consultants, key=lambda x: x["rate"], reverse=True)[0]

    if selected_consultant["name"] not in consultants_schedule:
        consultants_schedule[selected_consultant["name"]] = []
    consultants_schedule[selected_consultant["name"]].append([hour, endTime])

    print(selected_consultant["name"])

consultants = [
    {"name": "John", "rate": 4.5, "price": 1000},
    {"name": "Bob", "rate": 3, "price": 1200},
    {"name": "Jenny", "rate": 3.8, "price": 800}
]

book(consultants, 15, 1, "price") # Jenny
book(consultants, 11, 2, "price") # Jenny
book(consultants, 10, 2, "price") # John
book(consultants, 20, 2, "rate") # John
book(consultants, 11, 1, "rate") # Bob
book(consultants, 11, 2, "rate") # No Service
book(consultants, 14, 3, "price") # John

# 第三題

def func(*data):
    middle_names_count = {}

    for name in data:
        middle_name = name[len(name) // 2]
        middle_names_count[middle_name] = middle_names_count.get(middle_name, 0) + 1

    unique_middle_name = ""
    for name, count in middle_names_count.items():
        if count == 1:
            unique_middle_name = name
            break
    
    if unique_middle_name:
        for name in data:
            if unique_middle_name in name:
                print(name)
                break
    else:
        print("沒有")

func("彭大牆", "陳王明雅", "吳明") # print 彭大牆
func("郭靜雅", "王立強", "郭林靜宜", "郭立恆", "林花花") # print 林花花
func("郭宣雅", "林靜宜", "郭宣恆", "林靜花") # print 沒有
func("郭宣雅", "夏曼藍波安", "郭宣恆") # print 夏曼藍波安

#第四題

def get_number(index):
    sequence = generate_sequence(index + 1)
    print(sequence[index])

def generate_sequence(length):
    result = []
    current = 0
    for i in range(length):
        result.append(current)
        if i % 3 < 2:
            current += 4
        else:
            current -= 1
    return result

get_number(1) # print 4
get_number(5) # print 15
get_number(10) # print 25
get_number(30) # print 70

# 第五題

def find(spaces, stat, n):
    best_fit_index = -1
    min_difference = float('inf')

    for i in range(len(spaces)):
        if stat[i] == 1 and spaces[i] >= n:
            difference = spaces[i] - n
            if difference < min_difference:
                min_difference = difference
                best_fit_index = i

    print(best_fit_index)

find([3, 1, 5, 4, 3, 2], [0, 1, 0, 1, 1, 1], 2) # print 5
find([1, 0, 5, 1, 3], [0, 1, 0, 1, 1], 4) # print -1
find([4, 6, 5, 8], [0, 1, 1, 1], 4) # print 2