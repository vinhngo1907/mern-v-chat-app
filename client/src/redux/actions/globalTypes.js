export const GLOBALTYPES = {
    AUTH:"AUTH",
    ALERT:"ALERT",
    STATUS:"STATUS",
    MODAL:"MODAL"
}

export const editData = (data, post, id) =>{
    const newData = data.find(item=>item._id === id ? post : item);
    return newData;
}

export const deleteData = (data, id)=>{
    const newData = data.filter(item=>item._id !== id);
    return newData;
}
