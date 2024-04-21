const input = document.getElementById('url');
const shortLinkInput = document.getElementById('shortLinkInput');
const shorten = document.getElementById('shorten');
const shortLinkContainer = document.getElementById('shortLinkContainer');
const showLongLink = document.getElementById('longLink');
const longLinkContainer = document.getElementById('longLinkContainer');
const copyButton = document.getElementById('copyLink');
const invalid = document.getElementById('invalid');
var historyData = JSON.parse(localStorage.getItem('history')) || [];


// Function to print history in a table form
getHistory = () => {
  
    const tbody = document.getElementsByTagName('tbody')[0];
    const regex = /\d{1,2}\/\d{1,2}\/\d{2,4}/

    historyData.forEach((historyTasks) => {
        const tr = document.createElement('tr');
        historyTasks.forEach((task) => {
            if (regex.test(task)) {
                console.log(task)
                const td = document.createElement('td');
                td.textContent = task;
                tr.appendChild(td);
            } else {
                const a = document.createElement('a');
                a.href = task;
                a.textContent = task;
                a.className = "link";
                const i = document.createElement('i');
                i.style.color = "black";
                i.style.marginLeft = "10px";
                i.setAttribute('copy_link', task);
                i.className = "fa-regular fa-copy" 
                i.addEventListener('click', () => {
                    navigator.clipboard.writeText(i.getAttribute("copy_link"));
                })       
                
                const td = document.createElement('td');
                td.appendChild(a);
                td.appendChild(i);
                tr.appendChild(td);
            }

        });
        
        tbody.appendChild(tr);
    });
    
}
getHistory()

getDate = () => {
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    // Format Date
    let currentDate = `${day}/${month}/${year}`;
    return currentDate;
}

shortenLink = () => {

    // invalid.style.display = "none";
    // Get the url from the input tag
    const longLink = input.value;
   
    // Regular epression to determine in input is a valid url
    const regex = /^(https?|ftp):\/\/[^\s\/$.?#].[^\s]*$/;

    // Checking if input link is ok the continue
    if (regex.test(longLink)) {
        const accessToken = "46e58b8ff868db7a49ca1b613194474d1c3f8f46"; 

        // HTTP request to bit.ly
        fetch('https://api-ssl.bitly.com/v4/shorten', {

            // Request method
            method: 'POST',

            // Setting headers
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },

            // Crafting request body
            body: JSON.stringify({
                'long_url' : longLink,
                'domain' : "bit.ly"
            })
        })

        // Getting the response
        .then(response  => {
            // Checking if response is ok (HTTP status code 200) or not
            // if not ok throw an error
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Return response if ok
            return response.json();
        })

        // Processing recieved data
        .then(data => {
            const shortLink = data.link
            shortLinkContainer.style.display = "block";
            longLinkContainer.style.display = "none";
            shortLinkInput.value = shortLink;

            // Pushing data to localstorage
            historyData.push([longLink, shortLink, getDate()]);
            localStorage.setItem('history', JSON.stringify(historyData));
            getHistory();
            showLongLink.textContent = longLink;
    
        })
        
        // Catching any errors that occur
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // If link is invalid
    else {
        invalid.style.color = 'red';
        invalid.style.display = 'block';
        invalid.textContent = "Invalid URL. Please check and try again";
    }
}

let parsedHistories = JSON.parse(localStorage.getItem('history'));



// Function for copying to clipboard
copyLink = () => {
    // Copy link to clipboard
    navigator.clipboard.writeText(shortLinkInput.value);    

    // Create new div element
    var alertDiv = document.getElementById('alertDiv');

    if (alertDiv == undefined) {
        
        alertDiv = document.createElement("alertDiv");
        // Set id of new div
        alertDiv.id = "alertDiv";

        // Create a new p element
        const copyAlertTag = document.createElement('p');

        // Give the p element an id
        copyAlertTag.id = 'copyAlert'

        // Create  text to add to nearly created p tag
        const copyAlert = document.createTextNode('Link successfully copied to clipboard');

        // Append text to p tag
        copyAlertTag.appendChild(copyAlert);

        // Append p tag to new div
        alertDiv.appendChild(copyAlertTag);

        // Append new div tag to parent div
        shortLinkContainer.appendChild(alertDiv);
    } else {
        // do nothing
    }

    setTimeout(() => {
        alertDiv.remove()
    }, 3000)
}
