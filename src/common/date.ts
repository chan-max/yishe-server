export function getDateKey(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1; // getMonth() 返回 0-11，所以需要加 1
    let day = date.getDate();
  
    // 格式化为 "yyyy-M-d" 格式
    return `${year}-${month}-${day}`;
  }