export const getScoreColor = (score) => {
    if (score > 0.8) return "#bbf7d0";
    if (score > 0.6) return "#fef08a";
    return "#fecaca";
}

export const getScoreBorderColor = (score) => {
    if (score > 0.8) return "#16a34a";
    if (score > 0.6) return "#ca8a04";
    return "#dc2626";
}

export const appointmentStatusColor = (status) => {
    const colors = {
        SCHEDULED: "#3b82f6",
        COMPLETED: "#16a34a",
        CANCELED: "#ef4444",
        NO_SHOW: "#6b7280",
        LATE: "#f59e0b",
    };

    return colors[status] || "#3b82f6";
}