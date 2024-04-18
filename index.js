const input = document.getElementById('url');
const shortLinkInput = document.getElementById('shortLinkInput');
const shorten = document.getElementById('shorten');
const shortLinkContainer = document.getElementById('shortLinkContainer');
const longLinkContainer = document.getElementById('longLinkContainer');
const copyButton = document.getElementById('copyLink');
const showLongLink = document.getElementById('longLink');

shortenLink = () => {
    // Get the url from the input tag
    const longLink = input.value;
    console.log(longLink)
    const regex = /^(https?|ftp):\/\/[^\s\/$.?#].[^\s]*$/;

    if (regex.test(longLink)) {
        const accessToken = "b0fc0ccac7176b62c9ad9cd2ccba909f01816b6a"; // Replace with your actual access token
        fetch('https://api-ssl.bitly.com/v4/shorten', {
            method: 'POST',
            headers: {
                'Authorization' : `Bearer ${accessToken}`,
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                'long_url' : longLink,
                'domain' : "bit.ly"
            })
        })
        .then(response  => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            shortLinkContainer.style.display = "block";
            longLinkContainer.style.display = "none";
            shortLinkInput.value = data.link;
            showLongLink.textContent = longLink;
            console.log(data.link)
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    else {
        console.error('Invalid URL');
    }
}

function showCustomDialog() {
    document.getElementById("customDialog").style.display = "block";
}

function closeCustomDialog() {
    document.getElementById("customDialog").style.display = "none";
}


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
