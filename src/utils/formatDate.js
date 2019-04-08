function formatNumber(n) {
    const str = n.toString();
    return str[1] ? str : `0${str}`;
}

export function formatDate(date, format) {
    // if (!date) {
    //     return;
    // }
    date = String(date);
    if (date && date.includes('-')) {
        date = date.replace(/-/g, '/'); // 兼容ios
    }
    date = new Date(date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    const t1 = [month, day].map(formatNumber).join('/');
    const t2 = [hour, minute].map(formatNumber).join(':');

    if (format === 'mm:ss') {
        return `${String.prototype.padStart.call(minute, 2, '0')}:${formatNumber(second)}`;
    }
    if (format === 'YYYY:MM') {
        return `${year}/${formatNumber(month)}`;
    }
    if (format === 'YYYY-MM-DD') {
        return `${year}-${formatNumber(month)}-${formatNumber(day)}`;
    }
    return `${t1} ${t2}`;
}

export const second2ms = s => {
    const m = Math.floor(s / 60);
    s = Math.floor(s % 60);
    return `${String.prototype.padStart.call(m, 2, '0')}:${String.prototype.padStart.call(s, 2, '0')}`;
};

export default formatDate;
