<?php include "header.php"; ?>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fullcalendar@5.11.3/main.min.css">
<script src="https://cdn.jsdelivr.net/npm/fullcalendar@5.11.3/main.min.js"></script>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<div class="container">
    <h2>Doctor Booking Calendar</h2>
    <div id="calendar"></div>
</div>

<script>
    document.addEventListener("DOMContentLoaded", function () {
        let calendarEl = document.getElementById("calendar");
        let calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: "dayGridMonth",
            headerToolbar: {
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay"
            },
            events: "fetch_appointments.php",
            eventColor: "#0C155A"
        });
        calendar.render();
    });
</script>
<?php include "footer.php"; ?>