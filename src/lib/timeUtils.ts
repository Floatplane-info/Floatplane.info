export const shortMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
];

export function isSameDay(a: Date, b: Date): boolean {
    return (
        a.getDate() == b.getDate() &&
        a.getMonth() == b.getMonth() &&
        a.getFullYear() == b.getFullYear()
    );
}

export function yesterday() {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date;
}