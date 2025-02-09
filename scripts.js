document.addEventListener('DOMContentLoaded', () => {
    const calendar = document.querySelector('.calendar');
    const improvementDisplay = document.getElementById('improvement-percentage');
    const progressBar = document.getElementById('progress-bar');
    const userNameInput = document.getElementById('user-name');
    const projectNameInput = document.getElementById('project-name');
    const daysInYear = 365; // Assuming a non-leap year
    const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const maxImprovement = Math.pow(1.01, 365);
    let improvement = 0;

    // Load saved data from localStorage
    const savedData = JSON.parse(localStorage.getItem('incrementalData'));
    if (savedData) {
        userNameInput.value = savedData.userName;
        projectNameInput.value = savedData.projectName;
        savedData.days.forEach((dayState, index) => {
            if (dayState) {
                const dayDiv = document.querySelector(`.day[data-index="${index}"]`);
                if (dayDiv) {
                    dayDiv.classList.add(dayState);
                }
            }
        });
        updateImprovement();
    }

    monthNames.forEach((monthName, monthIndex) => {
        const monthContainer = document.createElement('div');
        monthContainer.classList.add('month-container');

        const monthLabel = document.createElement('div');
        monthLabel.classList.add('month-label');
        monthLabel.textContent = monthName;
        monthContainer.appendChild(monthLabel);

        const monthDiv = document.createElement('div');
        monthDiv.classList.add('month');
        monthContainer.appendChild(monthDiv);

        calendar.appendChild(monthContainer);

        for (let day = 0; day < daysPerMonth[monthIndex]; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('day');
            dayDiv.dataset.index = monthIndex * 31 + day; // Simplified indexing
            dayDiv.addEventListener('click', handleDayClick);
            monthDiv.appendChild(dayDiv);
        }
    });

    function handleDayClick(event) {
        const clickedDay = event.target;

        if (clickedDay.classList.contains('green')) {
            clickedDay.classList.remove('green');
            clickedDay.classList.add('red');
        } else if (clickedDay.classList.contains('red')) {
            clickedDay.classList.remove('red');
        } else {
            clickedDay.classList.add('green');
        }

        // Save data to localStorage
        saveData();
        updateImprovement();
    }

    function saveData() {
        const days = Array.from(document.querySelectorAll('.day')).map(day => {
            if (day.classList.contains('green')) {
                return 'green';
            } else if (day.classList.contains('red')) {
                return 'red';
            }
            return '';
        });
        const data = {
            userName: userNameInput.value,
            projectName: projectNameInput.value,
            days: days
        };
        localStorage.setItem('incrementalData', JSON.stringify(data));
    }

    function updateImprovement() {
        const greenDays = document.querySelectorAll('.day.green').length;
        improvement = Math.min(Math.round((Math.pow(1.01, greenDays) - 1) * 100), maxImprovement);
        improvementDisplay.textContent = improvement;
        progressBar.style.width = `${improvement / maxImprovement * 100}%`;
    }

    // Save data when user inputs change
    userNameInput.addEventListener('input', saveData);
    projectNameInput.addEventListener('input', saveData);
});

function shareOnTwitter() {
    const text = "Check out my progress with Incremental!";
    const url = "https://yourwebsite.com";
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
}

function shareOnFacebook() {
    const url = "https://yourwebsite.com";
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
}
