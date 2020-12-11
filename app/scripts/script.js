const $ = new DisplayJS(window);
const reloadTimeout = 60000;
let timer;

// generate the progress elements for availability of a service
function generateProgress(val) {
    val = parseFloat(val);

    let colorClass = "bg-danger";
    if (val >= 90) {
        colorClass = "bg-success";
    }
    if (val < 90) {
        colorClass = "bg-warning";
    }

    return `
        <div class="progress" style="height: 25px;">
            <div class="progress-bar progress-bar-striped ${colorClass}" role="progressbar" style="width: ${val}%" aria-valuenow="${val}" aria-valuemin="0" aria-valuemax="100">${val}%</div>
        </div>
    `;
}

function logArrayElements(element, index, array) {
    let status = '<span class="badge badge-pill badge-secondary">paused</span>';
    switch (element.status) {
        case 2:
            status =
                '<span class="badge badge-pill pull-right badge-success">online</span>';
            break;
        case 8:
            status =
                '<span class="badge badge-pill pull-right badge-warning">seems offline</span>';
            break;
        case 9:
            status =
                '<span class="badge badge-pill pull-right badge-danger">offline</span>';
            break;
        case 1:
            status =
                '<span class="badge badge-pill pull-right badge-secondary">not yet checked</span>';
            break;
    }

    const uptimeRatio = element.custom_uptime_ratio.split("-");

    // appending each repo
    $.append(
        $.select(".uptime-grid"),
        `
        <div class="card">
            <div class="card-header">
                <b>${element.friendly_name}</b>
                ${status}
            </div>
            <div class="card-body">
                <div>
                    <small>last 7 days</small>
                    ${generateProgress(uptimeRatio[0])}
                </div>
                <div class="row older-data">
                    <div class="col-6">
                        <small>last 30 days</small>
                        ${generateProgress(uptimeRatio[1])}
                    </div>
                    <div class="col-6">
                        <small>last 60 days</small>
                        ${generateProgress(uptimeRatio[2])}
                    </div>
                </div>
            </div>
        </div>
    `
    );
}

function loadData() {
    $.ajax("/api/uptime", "GET", "", (data) => {
        $.empty($.select(".uptime-grid"));
        const monitors = JSON.parse(data).monitors;
        monitors.forEach(logArrayElements);
        clearInterval(timer);
        timer = restartTimer();
    });
}

function loadInfo() {
    $.ajax("/static/info", "GET", "", (data) => {
        $.text($.select(".version-info"), `v${JSON.parse(data).version}`);
    });
}

function restartTimer() {
    let timeValue = 1;
    return setInterval(() => {
        const val = (100 / (reloadTimeout / 1000)) * timeValue;
        $.css($.select(".reload-progress"), "width", `${val}%`);
        timeValue++;
    }, 1000);
}

// start all timers and load initial data
loadInfo();
loadData();
setInterval(() => {
    loadData();
}, reloadTimeout);
