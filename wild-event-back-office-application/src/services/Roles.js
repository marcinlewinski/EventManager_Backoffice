const getAllRoles = async () => {
    try {
        const response = await fetch(`${process.env.REACT_APP_GET_ROLES}`);
        if (!response.ok) {
            throw new Error("There is an issue with fetching roles!");
        }
        return await response.json();
    } catch (error) {
        console.error("Cannot fetch roles:", error);
    }
};

export { getAllRoles };