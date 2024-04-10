//第一題

const stationsMap = [
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
];

const mainStations = [
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
];

const branchStations = [
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
];

function findAndPrint(messages, currentStation) {
  const messagesPeople = Object.keys(messages);

  let currentIndex = mainStations.indexOf(currentStation);
  const XiaobitanIndex = branchStations.indexOf("Xiaobitan");
  if (currentStation === "Xiaobitan") {
    currentIndex = XiaobitanIndex;
  }
  if (currentIndex === -1) {
    console.log("Station not found in the array.");
    return;
  }

  let minDistance = Infinity;
  let nearestFriend = "";

  for (let i = 0; i < messagesPeople.length; i++) {
    const message = messages[messagesPeople[i]];
    const stationName = extractStationName(message);
    let stationIndex;
    if (stationName && stationName !== "Xiaobitan") {
      stationIndex = mainStations.indexOf(stationName);
    } else if (stationName && stationName === "Xiaobitan") {
      stationIndex = branchStations.indexOf(stationName);
    }

    if (stationIndex !== -1) {
      let distance;

      if (
        (currentStation === "Xiaobitan" &&
          (stationName === "Xindian City Hall" || stationName === "Xindian")) ||
        (currentStation === "Xindian City Hall" &&
          stationName === "Xiaobitan") ||
        (currentStation === "Xindian" && stationName === "Xiaobitan")
      ) {
        distance = Math.abs(currentIndex - stationIndex) + 2;
      } else {
        distance = Math.abs(currentIndex - stationIndex);
      }

      if (distance < minDistance) {
        minDistance = distance;
        nearestFriend = messagesPeople[i];
      }
    }
  }
  console.log(nearestFriend);
}

function extractStationName(message) {
  const regex = new RegExp(stationsMap.join("|"), "g");
  const match = regex.exec(message);

  if (match) {
    return match[0];
  } else {
    return null;
  }
}

const messages = {
  Bob: "I'm at Ximen MRT station.",
  Mary: "I have a drink near Jingmei MRT station.",
  Copper: "I just saw a concert at Taipei Arena.",
  Leslie: "I'm at home near Xiaobitan station.",
  Vivian: "I'm at Xindian station waiting for you.",
};

findAndPrint(messages, "Wanlong"); // print Mary
findAndPrint(messages, "Songshan"); // print Copper
findAndPrint(messages, "Qizhang"); // print Leslie
findAndPrint(messages, "Ximen"); // print Bob
findAndPrint(messages, "Xindian City Hall"); // print Vivian

//第二題

let consultantsSchedule = {};

function book(consultants, hour, duration, criteria) {
  const endTime = hour + duration;

  const availableConsultants = consultants.filter((consultant) => {
    const schedule = consultantsSchedule[consultant.name] || [];
    return schedule.every(
      ([bookedStart, bookedEnd]) => endTime <= bookedStart || hour >= bookedEnd
    );
  });

  if (availableConsultants.length === 0) {
    console.log("No Service");
    return;
  }

  let selectedConsultant;
  if (criteria === "price") {
    selectedConsultant = availableConsultants.sort(
      (a, b) => a.price - b.price
    )[0];
  } else if (criteria === "rate") {
    selectedConsultant = availableConsultants.sort(
      (a, b) => b.rate - a.rate
    )[0];
  }

  if (!consultantsSchedule[selectedConsultant.name]) {
    consultantsSchedule[selectedConsultant.name] = [];
  }
  consultantsSchedule[selectedConsultant.name].push([hour, endTime]);

  console.log(selectedConsultant.name);
}

const consultants = [
  { name: "John", rate: 4.5, price: 1000 },
  { name: "Bob", rate: 3, price: 1200 },
  { name: "Jenny", rate: 3.8, price: 800 },
];

book(consultants, 15, 1, "price"); // Jenny
book(consultants, 11, 2, "price"); // Jenny
book(consultants, 10, 2, "price"); // John
book(consultants, 20, 2, "rate"); // John
book(consultants, 11, 1, "rate"); // Bob
book(consultants, 11, 2, "rate"); // No Service
book(consultants, 14, 3, "price"); // John

//第三題

function func(...data) {
  const middleNamesCount = new Map();

  for (let i = 0; i < data.length; i++) {
    let middleName = data[i][Math.floor(data[i].length / 2)];
    middleNamesCount.set(
      middleName,
      (middleNamesCount.get(middleName) || 0) + 1
    );
  }

  let uniqueMiddleName = "";
  for (const [name, count] of middleNamesCount) {
    if (count === 1) {
      uniqueMiddleName = name;
      break;
    }
  }
  if (uniqueMiddleName) {
    const uniqueName = data.find((name) => name.includes(uniqueMiddleName));
    console.log(uniqueName);
  } else {
    console.log("沒有");
  }
}

func("彭大牆", "陳王明雅", "吳明"); // print 彭大牆
func("郭靜雅", "王立強", "郭林靜宜", "郭立恆", "林花花"); // print 林花花
func("郭宣雅", "林靜宜", "郭宣恆", "林靜花"); // print 沒有
func("郭宣雅", "夏曼藍波安", "郭宣恆"); // print 夏曼藍波安

//第四題

function getNumber(index) {
  const sequence = generateSequence(index + 1);
  console.log(sequence[index]);
}

function generateSequence(length) {
  const result = [];
  let current = 0;
  for (let i = 0; i < length; i++) {
    result.push(current);
    if (i % 3 < 2) {
      current += 4;
    } else {
      current -= 1;
    }
  }
  return result;
}

getNumber(1); // print 4
getNumber(5); // print 15
getNumber(10); // print 25
getNumber(30); // print 70

//第五題

function find(spaces, stat, n) {
  let bestFitIndex = -1;
  let minDifference = Infinity;

  for (let i = 0; i < spaces.length; i++) {
    if (stat[i] === 1 && spaces[i] >= n) {
      const difference = spaces[i] - n;
      if (difference < minDifference) {
        minDifference = difference;
        bestFitIndex = i;
      }
    }
  }

  console.log(bestFitIndex);
}

find([3, 1, 5, 4, 3, 2], [0, 1, 0, 1, 1, 1], 2); // print 5
find([1, 0, 5, 1, 3], [0, 1, 0, 1, 1], 4); // print -1
find([4, 6, 5, 8], [0, 1, 1, 1], 4); // print 2
