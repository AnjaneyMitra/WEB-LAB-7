$(document).ready(function() {
    let f1Data = [];

    // Fetch F1 driver standings data from Ergast API
    $.getJSON("http://ergast.com/api/f1/current/driverStandings.json", function(data) {
        f1Data = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
        populateDriverFilter();
        displayData(f1Data);
        $("#loading").hide();
    }).fail(function() {
        $("#book-list").html("<p>Error fetching data. Please try again later.</p>");
        $("#loading").hide();
    });

    // Function to populate driver filter dropdown
    function populateDriverFilter() {
        let options = '<option value="">All Drivers</option>';
        for (let driver of f1Data) {
            options += `<option value="${driver.Driver.driverId}">${driver.Driver.givenName} ${driver.Driver.familyName}</option>`;
        }
        $("#filter-driver").html(options);
    }

    // Function to display F1 data
    function displayData(data) {
        let html = "";
        for (let entry of data) {
            html += `
                <div class="f1-entry">
                    <h3>${entry.Driver.givenName} ${entry.Driver.familyName}</h3>
                    <p>Position: ${entry.position}</p>
                    <p>Points: ${entry.points}</p>
                    <p>Wins: ${entry.wins}</p>
                    <p>Constructor: ${entry.Constructors[0].name}</p> 
                </div>
            `;
        }
        $("#book-list").html(html);
    }

    // Filtering, sorting, and search logic
    $("#filter-driver, #sort, #search").on("input change", function() {
        let filteredData = f1Data;

        // Filter by driver
        let selectedDriver = $("#filter-driver").val();
        if (selectedDriver) {
            filteredData = filteredData.filter(entry => entry.Driver.driverId === selectedDriver);
        }

        // Sort data
        let sortOption = $("#sort").val();
        if (sortOption === "position-asc") {
            filteredData.sort((a, b) => a.position - b.position);
        } else if (sortOption === "position-desc") {
            filteredData.sort((a, b) => b.position - a.position);
        } 

        // Search by team name 
        let searchTerm = $("#search").val().toLowerCase();
        if (searchTerm) {
            filteredData = filteredData.filter(entry => {
                let teamName = entry.Constructors[0].name.toLowerCase(); 
                return teamName.includes(searchTerm);
            });
        }

        displayData(filteredData);
    });

});