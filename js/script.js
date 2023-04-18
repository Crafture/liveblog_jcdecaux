document.addEventListener('DOMContentLoaded', function () {
    const messagesContainer = document.getElementById('messages');
    const lastUpdateContainer = document.getElementById('last-update');
    const backendUrl = 'http://0.0.0.0:8000/messages/ricky-gervais/';

    function updateMessages() {
        fetchMessages(backendUrl).then(messages => {
            messagesContainer.innerHTML = '';
            console.log(messages);
            const firstSevenMessages = messages.slice(0, 7);
            displayMessages(firstSevenMessages, messagesContainer);
            displayLastUpdate(firstSevenMessages, lastUpdateContainer);
            displayLastBorder();
        }).catch(error => {
            console.error('Error fetching messages:', error);
        });
    }


    updateMessages();

    setInterval(updateMessages, 5000);
});

async function fetchMessages(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return await response.json();
}

function displayLastUpdate(messages, container) {
    const latestMessage = messages.reduce((latest, message) => {
        if (!latest || new Date(message.updated_at) > new Date(latest.updated_at)) {
            return message;
        }
        return latest;
    }, null);

    const latestTime = new Date(latestMessage.updated_at);
    const formatLatestTime = latestTime.toLocaleDateString("nl-NL", { month: "short", day: "numeric", hour: "numeric", minute: "numeric", hourCycle: "h24" })

    container.innerHTML = `<p class="text-xs">Last Update: ${formatLatestTime}</p>`;
}

function displayLastBorder() {
    const elements = document.querySelectorAll('.message');
    const lastElement = elements[elements.length - 1];
    console.log(elements, lastElement)

    lastElement.classList.add('border-b', 'border-w');
}

function displayMessages(messages, container) {
    messages.forEach(message => {
        var updatedAt = new Date(message.updated_at);
        var formatUpdatedAt = updatedAt.toLocaleDateString("nl-NL", { month: "short", day: "numeric", hour: "numeric", minute: "numeric", hourCycle: "h24" })
        const messageHTML =
            `
            <div class="flex">
                <p class="text-xs border-r border-white min-w-20 max-w-20">${formatUpdatedAt}</p>
                <div class="flex flex-col pl-8 pb-6 message">
                    <h1 class="font-bold text-xl">${message.title}</h1>
                    <p class="text-sm">${message.message}</p>
                    <div class="flex text-xs mt-1">
                        <img src="https://go.arena.im/public/imgs/icon-thumbs-up.svg">
                        <p class="ml-2 mr-4">${message.likes}</p>
                        <img src="https://go.arena.im/public/imgs/icon-thumbs-down.svg">
                        <p class="ml-2">${message.dislikes}</p>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', messageHTML);
    });
}

