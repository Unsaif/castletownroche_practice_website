document.addEventListener('DOMContentLoaded', () => {
    const data = window.practiceDetails;

    if (!data) {
        console.error("Could not load practice details.");
        return;
    }

    // Header
    setText('practice-name', data.practiceName);
    setText('practice-address', data.address);
    document.title = data.practiceName;

    // Notice
    const noticeCard = document.getElementById('notice-card');
    if (data.notice && data.notice.active) {
        noticeCard.classList.add('active');
        setText('notice-title', data.notice.title);
        setText('notice-message', data.notice.message);
    }

    // Appointment Policy
    setText('policy-text', data.appointmentPolicy);

    // Opening Hours
    const hoursContainer = document.getElementById('hours-container');
    if (hoursContainer && data.openingHours) {
        data.openingHours.forEach(item => {
            const row = document.createElement('div');
            row.className = 'hours-row';
            row.innerHTML = `<span>${item.days}</span><span>${item.hours}</span>`;
            hoursContainer.appendChild(row);
        });
    }

    // Team
    fillList('gps-list', data.team.gps);
    fillList('nurses-list', data.team.nurses);
    fillList('secretaries-list', data.team.secretaries);

    // Services
    fillList('services-list', data.services);

    // Contact
    setText('phone-display', data.contact.phone);
    setHref('phone-link', `tel:${data.contact.phone}`);

    setText('fax-display', data.contact.fax);

    setText('email-display', data.contact.email);
    setHref('email-link', `mailto:${data.contact.email}`);

    // Footer
    setText('copyright-year', new Date().getFullYear());
    setText('footer-name', data.practiceName);
});

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function setHref(id, href) {
    const el = document.getElementById(id);
    if (el) el.href = href;
}

function fillList(id, items) {
    const list = document.getElementById(id);
    if (list && items) {
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            list.appendChild(li);
        });
    }
}
