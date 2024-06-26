'use strict';

async function fetchAllUsers() {
    try {
        const response = await fetch('https://randomuser.me/api/?results=4');
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

async function displayAllUsers() {
    const users = await fetchAllUsers();
    const userContainer = document.getElementById('userContainer');
    users.forEach(user => {
        const userCard = document.createElement('div');
        userCard.classList.add('user-card');
        userCard.style.backgroundColor = '#f9f5f5';
        userCard.style.boxShadow = '0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)';
        userCard.style.color = '#242424';

        const profilePicture = document.createElement('img');
        profilePicture.src = user.picture.large;
        profilePicture.alt = 'Profile Picture';
        profilePicture.classList.add('profile-picture');
        userCard.appendChild(profilePicture);

        const userDetails = document.createElement('div');
        userDetails.classList.add('user-details');

        const fullName = document.createElement('h3');
        fullName.textContent = `${user.name.first} ${user.name.last}`;
        fullName.classList.add('full-name');
        userDetails.appendChild(fullName);

        const city = document.createElement('p');
        city.textContent = `${user.location.city}`;
        city.classList.add('city');
        userDetails.appendChild(city);

        userCard.appendChild(userDetails);
        userContainer.appendChild(userCard);
    });
}

function initOptions() {
    const postInput = document.querySelector('.post-here input');
    const postButton = document.querySelector('.fa-circle-arrow-right');
    const feelingsButton = document.querySelector('.feeling');
    const feelingsList = document.querySelector('.feeling-list');
    let tempMediaContent = null;
    const mediaPreviewContainer = document.querySelector('.post-here .media-preview');
    let selectedFeeling = '';

    feelingsButton.addEventListener('click', function (event) {
        feelingsList.style.display = feelingsList.style.display === 'none' ? 'block' : 'none';
        event.stopPropagation(); 
    });

    feelingsList.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function (event) {
            selectedFeeling = `Feeling ${button.textContent}`;
            postInput.value = selectedFeeling;
            feelingsList.style.display = 'none'; 
            event.stopPropagation(); 
        });
    });

    document.addEventListener('click', function (event) {
        if (!feelingsButton.contains(event.target) && !feelingsList.contains(event.target)) {
            feelingsList.style.display = 'none';
        }
    });

    postButton.addEventListener('click', function () {
        if (tempMediaContent || postInput.value.trim() || selectedFeeling) {
            createPost({ text: postInput.value.trim(), media: tempMediaContent, feeling: selectedFeeling }, new Date());
            postInput.value = '';
            selectedFeeling = ''; 
            tempMediaContent = null;
            mediaPreviewContainer.innerHTML = '';
        }
    });

    const photoButton = document.querySelector('.photo');
    photoButton.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*, video/*';
        fileInput.onchange = e => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = function (ev) {
                tempMediaContent = { src: ev.target.result, type: file.type.startsWith('image') ? 'image' : 'video' };
                displayMediaPreview(tempMediaContent, mediaPreviewContainer);
            };
            reader.readAsDataURL(file);
        };
        fileInput.click();
    });
}



function displayMediaPreview(mediaContent, container) {
    container.innerHTML = ''; 
    if (mediaContent.type === 'image') {
        const img = document.createElement('img');
        img.src = mediaContent.src;
        img.alt = "Image Preview";
        img.style.width = '50px'; 
        img.style.weight = '50px';
        img.style.borderRadius = '5px';
        container.appendChild(img);
    } else if (mediaContent.type === 'video') {
        const icon = document.createElement('i');
        icon.className = 'fa fa-video';
        icon.style.fontSize = '24px'; 
        container.appendChild(icon);
    }
}

function createPost(content, timestamp) {
    const postsContainer = document.querySelector('.posts');
    const postHereSection = document.querySelector('.post-here');
    const postElement = document.createElement('div');
    postElement.className = 'friends-post';

    let dateFormatted = formatDate(timestamp);

    let innerHTMLContent = `
        <div class="post-heading">
            <div class="heading-profile">
                <div class="profile-pic"><a href="#"><img src="./assets/img/pfp.jpg" alt="user"></a></div>
                <div class="profile-info">
                    <h3>Your Post ${feelingDisplay}</h3>
                    <p class="time-posted">${dateFormatted}</p>
                </div>
            </div>
        <div>
            <i class="fa-solid fa-ellipsis"></i>
        </div>
        </div>
        <div class="post-content">
            ${content.text ? `<p>${content.text}</p>` : ''}
            ${content.media ? (content.media.type === 'image' ? `<img src="${content.media.src}" alt="Posted Image"/>` : `<video controls src="${content.media.src}"></video>`) : ''}
        </div>
        <div class="post-actions">
            <a class="interactive" href="#"><i class="far fa-thumbs-up"></i> Like</a>
            <a class="interactive" href="#"><i class="fa-regular fa-message"></i> Comment</a>
            <a class="interactive" href="#"><i class="fa-regular fa-share-from-square"></i> Share</a>
            <a class="interactive" href="#"><i class="fa-regular fa-bookmark"></i> Save</a>
        </div>`;

    postElement.innerHTML = innerHTMLContent;
    postsContainer.insertBefore(postElement, postHereSection.nextSibling);
}


function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

document.addEventListener('DOMContentLoaded', function () {
    displayAllUsers();
    initOptions();
});