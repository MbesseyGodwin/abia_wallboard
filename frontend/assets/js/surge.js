const blink = document.getElementById('blink');
setInterval(function () {
  blink.style.opacity = (blink.style.opacity == 0 ? 1 : 0);
}, 1500);

function fyRemainingTime() {
  const currentDate = new Date();
  const targetDate = new Date("September 30, 2023");
  const timeDiff = targetDate.getTime() - currentDate.getTime();

  const seconds = Math.floor(timeDiff / 1000) % 60;
  const minutes = Math.floor(timeDiff / 1000 / 60) % 60;
  const hours = Math.floor(timeDiff / 1000 / 60 / 60) % 24;
  const days = Math.floor(timeDiff / 1000 / 60 / 60 / 24);

  const daysStr = days.toString().padStart(3, "0");
  const hoursStr = hours.toString().padStart(2, "0");
  const minutesStr = minutes.toString().padStart(2, "0");
  const secondsStr = seconds.toString().padStart(2, "0");

  const daysSpan = document.getElementById("days");
  const hoursSpan = document.getElementById("hours");
  const minutesSpan = document.getElementById("minutes");
  const secondsSpan = document.getElementById("seconds");

  daysSpan.textContent = daysStr;
  hoursSpan.textContent = hoursStr;
  minutesSpan.textContent = minutesStr;
  secondsSpan.textContent = secondsStr;
}

setInterval(fyRemainingTime, 1000);

/*Custom script*/
const arraw = document.querySelector("#arraw");
let expected = 67483;
let SpectrumEstimate = 67488;
let spectrumAchieved;
let stateTxcurr;

setInterval(function () {
  expected -= Math.round(Math.random() * 10);
}, Math.round(Math.random() * 10000));

// Fetch data from "assets/json/SpectrumEstimate.json"
fetch("assets/json/SpectrumEstimate.json")
  .then(response => response.json())
  .then(spectrumData => {
    // Fetch data from abiaBaseUrl + "GetSpectrumModel"
    fetch(abiaBaseUrl + "GetSpectrumModel")
      .then(response => response.json())
      .then(data => {
        // Merge the data from both JSON files
        const mergedData = data.map((item, index) => {
          if (spectrumData[index]) {
            return {
              ...item,
              PLHIVSpectrumEstimate: spectrumData[index].PLHIVSpectrumEstimate
            };
          }
          return item;
        });

        // Use the merged data for further processing or rendering
        console.log(mergedData);
        let i = 0;

        setInterval(function () {
          if (i == mergedData.length) {
            i = 0;
          }

          const currentItem = mergedData[i];
          const stateElement = document.querySelector("[data-state]");
          const pendingElement = document.querySelector("[data-pending]");
          const percentageElement = document.querySelector("[data-percentage]");

          stateElement.textContent = currentItem.lga;
          // Calculate priority based on tx_curr and PLHIVSpectrumEstimate
          const priority = (currentItem.tx_curr / currentItem.PLHIVSpectrumEstimate) * 100;
          pendingElement.textContent = numeral(parseInt(currentItem.tx_curr)).format("0,0");

          // Determine border color based on priority
          if (priority < 50) {
            stateElement.style.borderBottom = "solid 16px red";
          } else if (priority < 100) {
            stateElement.style.borderBottom = "solid 16px yellow";
          } else {
            stateElement.style.borderBottom = "solid 16px green";
          }

          pendingElement.textContent = numeral(parseInt(currentItem.tx_curr)).format("0,0");

          let percent;
          if (currentItem.tx_curr == 0) {
            percentageElement.textContent = numeral(0).format("0");
            percent = 0;
          } else if (currentItem.tx_curr_expected == 0) {
            percentageElement.textContent = numeral(currentItem.tx_curr).format("0");
            percent = 100;
          } else {
            percentageElement.textContent = numeral((parseInt(currentItem.tx_curr) / parseInt(currentItem.tx_curr_expected)) * 100).format("0.0");
            percent = (currentItem.tx_curr / currentItem.tx_curr_expected) * 100;
          }

          if (percent >= 50.0) {
            arraw.classList.add("green-text");
            arraw.classList.add("mdi-arrow-up-thick");
            arraw.classList.remove("red-text");
            arraw.classList.remove("mdi-arrow-down-thick");
            arraw.classList.remove("yellow-text");
          } else if (percent == 0.0) {
            arraw.classList.add("yellow-text");
            arraw.classList.remove("green-text");
            arraw.classList.remove("mdi-arrow-up-thick");
            arraw.classList.remove("red-text");
            arraw.classList.remove("mdi-arrow-down-thick");
          } else {
            arraw.classList.add("red-text");
            arraw.classList.add("mdi-arrow-down-thick");
            arraw.classList.remove("green-text");
            arraw.classList.remove("mdi-arrow-up-thick");
            arraw.classList.remove("yellow-text");
          }

          if (i < data.length) {
            i++;
          }
        }, 5000);
      });

    async function fetchAndProcessData() {
      try {
        const response = await fetch(abiaBaseUrl + "GetNumberToReach");
        const data = await response.json();

        console.log(data);
        const stateTxcurr = SpectrumEstimate - data;
        const spectrumAchieved = (stateTxcurr / SpectrumEstimate) * 100;
        const formatedSpectrumAchieved = spectrumAchieved.toFixed(1);

        console.log(formatedSpectrumAchieved);
        console.log(stateTxcurr);

        document.querySelector("[data-countdown]").textContent = numeral(data).format("0,0");
        document.querySelector("[SpectrumEstimate]").textContent = numeral(SpectrumEstimate).format("0,0");

        const spectrumAchievedElement = document.querySelector("[spectrum-achieved]");
        spectrumAchievedElement.textContent = `(${formatedSpectrumAchieved}%)`;

        if (formatedSpectrumAchieved < 50) {
          spectrumAchievedElement.style.color = "red";
        } else if (formatedSpectrumAchieved < 100) {
          spectrumAchievedElement.style.color = "yellow";
        } else {
          spectrumAchievedElement.style.color = "green";
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchAndProcessData();

  });

function GetmeDate() {
  return new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}