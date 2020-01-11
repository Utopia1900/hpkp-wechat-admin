const transformPriceName = priceNameArr => {
    let result = {}
    if(Array.isArray(priceNameArr) && priceNameArr.length !==0){
       priceNameArr.map(item => {
           result[item.key] = item.value
       })
    }
    return result
}

export default transformPriceName