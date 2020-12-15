const getFormattedDate = function(date) {
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let fDate = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear() + ", ";

    if(date.getHours() == 0) {
        fDate += ("0" + (date.getHours() + 12)).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + " AM";
    } else if (date.getHours() <= 11) {
        fDate += ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + " AM";
    } else if(date.getHours() == 12) {
        fDate += ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + " PM";
    } else {
        fDate += ("0" + (date.getHours() - 12)).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + " PM";
    }

    return fDate;
}

module.exports = getFormattedDate;