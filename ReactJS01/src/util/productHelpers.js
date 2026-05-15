export const getCategoryLabel = (category) => {
    if (!category) return "Không xác định";
    return typeof category === "string"
        ? category
        : category.name || "Không xác định";
};
