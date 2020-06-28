var dateParser = d3.timeParse("%Y-%m-%d");

export function filterDatasetBetweenDates(dataset, startDate, endDate) {
    startDate = dateParser(startDate);
    endDate = dateParser(endDate);
    return dataset.filter(function(row) {
      return dateParser(row.date) >= startDate && dateParser(row.date) <= endDate;
    });
}
  
export function sortByStatus(dataset, status) {
    dataset.forEach(function (data) {
      dataset.sort(function(a, b) {
          return status.indexOf(a.status) - status.indexOf(b.status);
        })
    });
}