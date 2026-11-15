/**
 * Fills the page from details.js.
 * To change what the site says, edit details.js - not this file.
 */

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0]; // Monday first
const SEPARATOR = /\s*(?:-|–|—|\bto\b)\s*/i; // "9am - 1pm", "Mon to Fri"
const LIST_SPLIT = /\s*(?:,|&|\band\b)\s*/i; // "Mon, Tues and Weds"

document.addEventListener('DOMContentLoaded', () => {
    const data = window.practiceDetails;

    if (!data) {
        console.error("Could not load practice details.");
        return;
    }

    // Header and footer
    setText('practice-name', data.practiceName);
    setText('practice-address', data.address);
    setText('find-us-address', data.address);
    setText('footer-name', data.practiceName);
    setText('footer-address', data.address);
    document.title = data.practiceName;

    // Notice
    const noticeCard = document.getElementById('notice-card');
    if (noticeCard && data.notice && data.notice.active) {
        noticeCard.classList.add('active');
        setText('notice-title', data.notice.title);
        // innerHTML so the message can contain <p> and <br> tags
        const noticeMsg = document.getElementById('notice-message');
        if (noticeMsg) noticeMsg.innerHTML = data.notice.message;
    }

    // Appointment policy
    setText('policy-text', data.appointmentPolicy);

    // Opening hours and the open / closed status
    const schedule = buildSchedule(data.openingHours);
    renderHours(data.openingHours, schedule);
    if (schedule) {
        updateStatus(schedule);
        setInterval(() => updateStatus(schedule), 60 * 1000);
    }

    // Team
    fillList('gps-list', data.team.gps);
    fillList('nurses-list', data.team.nurses);
    fillList('secretaries-list', data.team.secretaries);

    // Services
    fillList('services-list', data.services);

    // Contact
    if (data.contact) {
        const tel = `tel:${data.contact.phone}`;
        setText('hero-phone-display', data.contact.phone);
        setHref('hero-phone-link', tel);
        setText('phone-display', data.contact.phone);
        setHref('phone-link', tel);
        setText('footer-phone', data.contact.phone);

        setText('fax-display', data.contact.fax);

        setText('email-display', data.contact.email);
        setHref('email-link', `mailto:${data.contact.email}`);
    }

    // Directions
    setHref('directions-link', 'https://www.google.com/maps/dir/?api=1&destination=' +
        encodeURIComponent(`${data.practiceName}, ${data.address}`));
});

/* ---------- Opening hours ---------- */

// "Mon, Tues, Weds" or "Mon - Fri" -> [1, 2, 3]. Returns null if not understood.
function parseDays(text) {
    const days = [];
    for (const part of String(text).split(LIST_SPLIT)) {
        if (!part.trim()) continue;
        const ends = part.split(SEPARATOR).filter(Boolean).map(dayNumber);
        if (ends.includes(-1) || ends.length > 2) return null;
        if (ends.length === 1) {
            days.push(ends[0]);
        } else {
            for (let d = ends[0]; ; d = (d + 1) % 7) {
                days.push(d);
                if (d === ends[1]) break;
            }
        }
    }
    return days.length ? days : null;
}

function dayNumber(word) {
    return DAY_KEYS.indexOf(word.trim().toLowerCase().slice(0, 3));
}

// "9am" / "9.30am" / "1:15 pm" / "14:00" -> minutes after midnight, or null.
function parseTime(text) {
    const m = /^(\d{1,2})(?:[:.](\d{2}))?\s*(am|pm)?$/i.exec(text.trim());
    if (!m) return null;
    let hour = Number(m[1]);
    const minute = m[2] ? Number(m[2]) : 0;
    const half = m[3] ? m[3].toLowerCase() : null;
    if (minute > 59 || hour > 23 || (half && (hour < 1 || hour > 12))) return null;
    if (half === 'pm' && hour !== 12) hour += 12;
    if (half === 'am' && hour === 12) hour = 0;
    return hour * 60 + minute;
}

// "9am - 1pm, 2pm - 4pm" -> [[540, 780], [840, 960]]. "Closed" -> []. null if not understood.
function parseSlots(text) {
    if (/^\s*closed\s*$/i.test(text)) return [];
    const slots = [];
    for (const part of String(text).split(LIST_SPLIT)) {
        if (!part.trim()) continue;
        const ends = part.split(SEPARATOR).filter(Boolean).map(parseTime);
        if (ends.length !== 2 || ends.includes(null) || ends[1] <= ends[0]) return null;
        slots.push(ends);
    }
    return slots.length ? slots.sort((a, b) => a[0] - b[0]) : null;
}

// Turns the openingHours list into { dayNumber: { hours, slots } }.
// Returns null if any line can't be understood, so the page falls back
// to showing the hours exactly as written, without the open/closed status.
function buildSchedule(openingHours) {
    if (!Array.isArray(openingHours) || !openingHours.length) return null;
    const schedule = {};
    for (const item of openingHours) {
        const days = parseDays(item.days);
        const slots = parseSlots(item.hours);
        if (!days || !slots) return null;
        for (const d of days) schedule[d] = { hours: item.hours, slots };
    }
    return schedule;
}

function renderHours(openingHours, schedule) {
    const container = document.getElementById('hours-container');
    if (!container || !openingHours) return;
    container.textContent = '';

    if (!schedule) {
        // Couldn't read the hours as times - show them as written.
        openingHours.forEach(item => container.appendChild(hoursRow(item.days, item.hours, null)));
        return;
    }

    WEEK_ORDER.filter(d => schedule[d]).forEach(d => {
        container.appendChild(hoursRow(DAY_NAMES[d], schedule[d].hours, d));
    });
}

function hoursRow(dayText, hoursText, dayNum) {
    const row = document.createElement('div');
    row.className = 'hours-row';
    if (dayNum !== null) row.dataset.day = dayNum;

    const day = document.createElement('span');
    day.className = 'hours-day';
    const name = document.createElement('span');
    name.textContent = dayText;
    day.appendChild(name);

    const hours = document.createElement('span');
    hours.textContent = String(hoursText).replace(/\s*-\s*/g, ' – ');

    row.appendChild(day);
    row.appendChild(hours);
    return row;
}

// Current day and time at the surgery (Irish time), whatever the visitor's own time zone.
function surgeryNow() {
    try {
        const parts = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Europe/Dublin', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
        }).formatToParts(new Date());
        const get = type => parts.find(p => p.type === type).value;
        return { day: dayNumber(get('weekday')), minutes: Number(get('hour')) * 60 + Number(get('minute')) };
    } catch (e) {
        const now = new Date();
        return { day: now.getDay(), minutes: now.getHours() * 60 + now.getMinutes() };
    }
}

function formatTime(minutes) {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return hour12 + (minute ? ':' + String(minute).padStart(2, '0') : '') + (hour >= 12 ? 'pm' : 'am');
}

function updateStatus(schedule) {
    const now = surgeryNow();
    const today = schedule[now.day];
    let open = false;
    let detail = '';

    if (today) {
        const current = today.slots.find(s => now.minutes >= s[0] && now.minutes < s[1]);
        if (current) {
            open = true;
            detail = `Until ${formatTime(current[1])} today`;
        } else {
            const next = today.slots.find(s => now.minutes < s[0]);
            if (next) {
                detail = `${next === today.slots[0] ? 'Opens' : 'Reopens'} at ${formatTime(next[0])} today`;
            }
        }
    }

    if (!open && !detail) {
        for (let ahead = 1; ahead <= 7; ahead++) {
            const d = (now.day + ahead) % 7;
            if (schedule[d] && schedule[d].slots.length) {
                detail = `Opens ${ahead === 1 ? 'tomorrow' : DAY_NAMES[d]} at ${formatTime(schedule[d].slots[0][0])}`;
                break;
            }
        }
    }

    const pill = document.getElementById('open-status');
    if (pill) {
        pill.textContent = open ? 'Open now' : 'Closed now';
        pill.classList.toggle('is-open', open);
        pill.hidden = false;
    }

    const detailEl = document.getElementById('status-detail');
    if (detailEl) {
        detailEl.textContent = detail;
        detailEl.hidden = !detail;
    }

    // Mark today's row
    document.querySelectorAll('#hours-container .hours-row').forEach(row => {
        const isToday = Number(row.dataset.day) === now.day && row.dataset.day !== undefined;
        const day = row.querySelector('.hours-day');
        let tag = row.querySelector('.today-tag');
        if (isToday && !tag) {
            tag = document.createElement('span');
            tag.className = 'today-tag';
            tag.textContent = 'Today';
            day.appendChild(tag);
        } else if (!isToday && tag) {
            tag.remove();
        }
    });
}

/* ---------- Helpers ---------- */

function setText(id, text) {
    const el = document.getElementById(id);
    if (el && text !== undefined && text !== null) el.textContent = text;
}

function setHref(id, href) {
    const el = document.getElementById(id);
    if (el) el.href = href;
}

function fillList(id, items) {
    const list = document.getElementById(id);
    if (list && items) {
        list.textContent = '';
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            list.appendChild(li);
        });
    }
}
