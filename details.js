/**
 * Website Content Configuration
 * 
 * INSTRUCTIONS FOR UPDATING:
 * 1. Only change the text inside the quotation marks "".
 * 2. Do not change the variable names (like 'practiceName', 'notices').
 * 3. Be careful not to delete commas or brackets.
 */

const details = {
    // Basic Practice Information
    practiceName: "New Road Surgery",
    address: "New Rd., Castletownroche, Co. Cork, P51 H79N",

    // Contact Information
    contact: {
        phone: "022-26410",
        fax: "022-46984",
        email: "newroadsurgery@gmail.com"
    },

    // Opening Hours
    // You can change the days or times here.
    openingHours: [
        { days: "Mon, Tues, Weds", hours: "9am - 1pm, 2pm - 4pm" },
        { days: "Thurs, Fri", hours: "9am - 1pm" }
    ],

    // The Team
    // Grouped by their role. You can add or remove names from the lists.
    team: {
        gps: ["Dr. Lydia Huisman", "Dr. Cornelius Mocke"],
        nurses: ["Mary O'Flynn", "Helen Cagney"],
        secretaries: ["Marie Lane", "Hannah Sheehan"]
    },

    // Services Offered
    // Add new services as simple text items in this list.
    services: [
        "Childhood Vaccinations",
        "Travel Vaccinations",
        "Winter Vaccinations",
        "Antenatal Care",
        "Family Planning",
        "Cryotherapy",
        "General GP Services"
    ],

    // Important Notices
    // 'active': set to true to show the notice, false to hide it.
    // 'title': Large text at the top of the notice.
    // 'message': The main body of the notice.
    notice: {
        active: true,
        title: "Flu Clinics & Winter Schedule",
        message: "Due to increased pressure from flu-related illnesses, we are running extra clinics until February 9th. The next clinic is Wednesday, December 17th, from 5pm to 7pm. Please check this website weekly for updated clinic times."
    },

    // Appointment Policy
    // This appears permanently to remind patients about appointments.
    appointmentPolicy: "Please note: We do not offer walk-in appointments. All consultations are by appointment only. Please ring the surgery to book."
};

// DON'T TOUCH ANYTHING BELOW THIS LINE
if (typeof module !== 'undefined' && module.exports) {
    module.exports = details;
} else {
    window.practiceDetails = details;
}
